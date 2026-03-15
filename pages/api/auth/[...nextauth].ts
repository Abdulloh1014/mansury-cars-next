import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === 'google') {
                try {
                    const response = await fetch('http://localhost:3011/graphql', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            query: `
                                mutation GoogleLogin($input: GoogleLoginInput!) {
                                    googleLogin(input: $input) {
                                        _id
                                        memberNick
                                        memberEmail
                                        accessToken
                                    }
                                }
                            `,
                            variables: {
                                input: {
                                    memberEmail: user.email,
                                    memberNick: user.name?.replace(/\s+/g, '_').toLowerCase(),
                                    memberImage: user.image,
                                },
                            },
                        }),
                    });

                    const data = await response.json();

                    if (data?.data?.googleLogin?.accessToken) {
                        user.accessToken = data.data.googleLogin.accessToken;
                        return true;
                    }
                    return false;
                } catch (err) {
                    console.log('Google login error:', err);
                    return false;
                }
            }
            return true;  // ← ortiqcha if o'chirildi
        },

        async jwt({ token, user }) {
            if (user?.accessToken) {
                token.accessToken = user.accessToken;
            }
            return token;
        },

        async session({ session, token }) {
            session.accessToken = token.accessToken;
            return session;
        },
    },
});




