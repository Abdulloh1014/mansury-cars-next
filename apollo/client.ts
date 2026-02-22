import { useMemo } from 'react';
import { ApolloClient, ApolloLink, InMemoryCache, split, from, NormalizedCacheObject } from '@apollo/client';
import createUploadLink from 'apollo-upload-client/public/createUploadLink.js';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { onError } from '@apollo/client/link/error';
import { getJwtToken } from '../libs/auth';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import { sweetErrorAlert } from '../libs/sweetAlert';
import { socketVar } from './store';


/*
 
apolloClient ichida:

Backend URL (qayerga so‘rov yuborish)

Headers (JWT token bilan)

Cache (kelgan datani saqlaydi)

WebSocket link (realtime uchun)

Error handler

Refresh token logikasi

Ya’ni: backend bilan gaplashish uchun hamma sozlama ichida turadi.

 */




// `apolloClient` — **ApolloClient uchun global o‘zgaruvchi**, frontenda bitta nusxani saqlash uchun.
let apolloClient: ApolloClient<NormalizedCacheObject>;



//JWT bo‘lsa Authorization: Bearer <token> ni headerga qo‘shadi, bo‘lmasa bo‘sh header qaytaradi.
function getHeaders() {
	const headers = {} as HeadersInit;
	const token = getJwtToken();
	// @ts-ignore
	if (token) headers['Authorization'] = `Bearer ${token}`;
	return headers;
}



// Tokenni **avtomatik yangilash mexanizmi** uchun link, lekin hozircha real ishlamaydi (har doim true, refresh qilmaydi).
const tokenRefreshLink = new TokenRefreshLink({
	accessTokenField: 'accessToken',
	isTokenValidOrUndefined: () => {
		return true;
	}, // @ts-ignore
	fetchAccessToken: () => {
		// execute refresh token
		return null;
	},
});

// Custom WebSocket client
class LoggingWebSocket {
  private socket: WebSocket;

  constructor(url: string) {
    this.socket = new WebSocket(`${url}?token=${getJwtToken()}`);
	socketVar(this.socket);

    this.socket.onopen = () => {
      console.log('WebSocket connection!');
    };

    this.socket.onmessage = (msg) => {
      console.log('WebSocket message:', msg.data);
    };

    this.socket.onerror = (error) => {
      console.log('WebSocket error:', error);
    };
  }

  
  send(data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView) {
	// @ts-ignore
    this.socket.send(data);
  }

  close() {
    this.socket.close();
  }
}


// Backend bilan aloqa qilish uchun bitta umumiy link yaratadi:
// HTTP so‘rovlarga token qo‘shadi, realtime (subscription) uchun WebSocket ishlatadi, xatolarni tutadi.
function createIsomorphicLink() {
	if (typeof window !== 'undefined') {
		const authLink = new ApolloLink((operation, forward) => {
			operation.setContext(({ headers = {} }) => ({
				headers: {
					...headers,
					...getHeaders(),
				},
			}));
			console.warn('requesting.. ', operation);
			return forward(operation);
		});

		// @ts-ignore
		const link = new createUploadLink({
			uri: process.env.REACT_APP_API_GRAPHQL_URL,
		});

		/* WEBSOCKET SUBSCRIPTION LINK */
		const wsLink = new WebSocketLink({
			uri: process.env.REACT_APP_API_WS ?? 'ws://127.0.0.1:3007',
			options: {
				reconnect: false,  //Agar uzilib qolsa: qayta ulanmaydi ❌
				timeout: 30000,    // 30 sekundda ulanmasa: bekor qiladi
				connectionParams: () => {
					return { headers: getHeaders() };
				},
			},
			webSocketImpl: LoggingWebSocket,
		});

		const errorLink = onError(({ graphQLErrors, networkError, response }) => {
			if (graphQLErrors) {
				graphQLErrors.map(({ message, locations, path, extensions }) => {
                  console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
				  if (!message.includes('input')) sweetErrorAlert(message);
				}
					
				);
			}
			if (networkError) console.log(`[Network error]: ${networkError}`);
			// @ts-ignore
			if (networkError?.statusCode === 401) {
			}
		});

		const splitLink = split(
			({ query }) => {
				const definition = getMainDefinition(query);
				return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
			},
			wsLink,
			authLink.concat(link),
		);

		return from([errorLink, tokenRefreshLink, splitLink]);
	}
}



// Yangi **ApolloClient obyektini yaratadi** (server/brauzerga mos qilib sozlab).
function createApolloClient() {
	return new ApolloClient({
		ssrMode: typeof window === 'undefined',
		link: createIsomorphicLink(),
		cache: new InMemoryCache(),
		resolvers: {},
	});
}



//Apollo Client’ni **yaratadi yoki mavjudini qayta ishlatadi**, cache bo‘lsa yuklaydi, serverda alohida, brauzerda bitta umumiy instance saqlaydi.
export function initializeApollo(initialState = null) {
	const _apolloClient = apolloClient ?? createApolloClient();
	if (initialState) _apolloClient.cache.restore(initialState);
	if (typeof window === 'undefined') return _apolloClient;
	if (!apolloClient) apolloClient = _apolloClient;

	return _apolloClient;
}



// Apollo Client’ni **har safar qayta yaratmasdan**, `initialState` o‘zgargandagina **bitta tayyor bitta nusxa qilib berish** uchun.
export function useApollo(initialState: any) {
	return useMemo(() => initializeApollo(initialState), [initialState]);
}

/**
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

// No Subscription required for develop process

const httpLink = createHttpLink({
  uri: "http://localhost:3007/graphql",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;
*/
