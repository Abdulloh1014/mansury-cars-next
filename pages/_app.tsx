import type { AppProps } from 'next/app';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { light } from '../scss/MaterialTheme';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../apollo/client';
import { appWithTranslation } from 'next-i18next';
import { SessionProvider, useSession } from 'next-auth/react';
import { getJwtToken, updateUserInfo } from '../libs/auth';

import '../scss/app.scss';
import '../scss/pc/main.scss';
import '../scss/mobile/main.scss';

const TokenSaver = () => {
    const { data: session } = useSession();

    useEffect(() => {
        if (session?.accessToken) {
            localStorage.setItem('accessToken', session.accessToken as string);
            updateUserInfo(session.accessToken as string);
        }
    }, [session]);

    return null;
};

const App = ({ Component, pageProps }: AppProps) => {
    // @ts-ignore
    const [theme, setTheme] = useState(createTheme(light));
    const client = useApollo(pageProps.initialApolloState);

    return (
        <SessionProvider session={pageProps.session}>
            <ApolloProvider client={client}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <TokenSaver />
                    <Component {...pageProps} />
                </ThemeProvider>
            </ApolloProvider>
        </SessionProvider>
    );
};

export default appWithTranslation(App);