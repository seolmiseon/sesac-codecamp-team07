import { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import NaverProvider from 'next-auth/providers/naver';
import KakaoProvider from 'next-auth/providers/kakao';
import { FirestoreAdapter } from '@auth/firebase-adapter';
import Credentials from 'next-auth/providers/credentials';
import { cert } from 'firebase-admin/app';
import { auth } from '@/lib/firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { User } from 'next-auth';
import { Adapter } from 'next-auth/adapters';

export const authOptions: AuthOptions = {
    adapter: FirestoreAdapter({
        credential: cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY?.replace(
                /\\n/g,
                '\n'
            ),
        }),
    }) as Adapter,

    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            // credentials -> credentials로 수정 필요
            async authorize(
                credentials: Record<'email' | 'password', string> | undefined
            ): Promise<User | null> {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        return null;
                    }

                    const userCredential = await signInWithEmailAndPassword(
                        auth,
                        credentials.email,
                        credentials.password
                    );

                    if (userCredential.user) {
                        return {
                            id: userCredential.user.uid,
                            email: userCredential.user.email || undefined,
                            name: userCredential.user.displayName || undefined,
                        };
                    }
                    return null;
                } catch (error) {
                    console.error('Authentication error', error);
                    return null;
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
        }),
        NaverProvider({
            clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID!,
            clientSecret: process.env.NEXT_PUBLIC_NAVER_CLIENT_SECRET!,
        }),
        KakaoProvider({
            clientId: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID!,
            clientSecret: process.env.NEXT_PUBLIC_KAKAO_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub as string;
            }
            return session;
        },
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },
    jwt: {
        secret: process.env.NEXT_PUBLIC_JWT_SECRET,
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    },
};
