import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';

// Prisma adapter for NextAuth, optional and can be removed
import { prisma } from '../../../server/db/client';

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        name: {
          label: 'Name',
          type: 'text',
          placeholder: 'Enter your name',
        },
      },
      async authorize(credentials) {
        const user = { id: 1, name: credentials?.name ?? 'J Smith' };
        return user;
      },
    }),
  ],
};

export default NextAuth(authOptions);
