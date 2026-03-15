// import NextAuth from 'next-auth';

// declare module 'next-auth' {
//     interface Session {
//         accessToken?: string;
//     }
//     interface User {
//         accessToken?: string;
//     }
// }

// declare module 'next-auth/jwt' {
//     interface JWT {
//         accessToken?: string;
//     }
// }


import NextAuth, { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        accessToken?: string;
        user: {
            _id?: string;
            memberNick?: string;
            memberStatus?: string;
            memberType?: string;
            memberImage?: string;
        } & DefaultSession['user']; // Eski name, email, image larni saqlab qolish uchun
    }

    interface User {
        _id?: string;
        accessToken?: string;
        memberNick?: string;
        memberStatus?: string;
        memberType?: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken?: string;
        memberData?: any; // Backenddan kelgan hamma ma'lumotni saqlash uchun
    }
}