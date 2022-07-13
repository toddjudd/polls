import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextApiHandler } from 'next';
import NextAuth, { type NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

// Prisma adapter for NextAuth, optional and can be removed
import { prisma } from '../../../server/db/client';

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' }, // jwt is foced to be used for session for use with midleware
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here
  ],
};

const authHandler: NextApiHandler = (req, res) => {
  // Here we could grab cookies and pass them to the events and callbacks
  // however then we couldn't export the authOptions object
  // unless we only export a portion of it..

  const ownerToken = req.cookies['poll-user-token'];

  authOptions.events = {
    signIn: async ({ user, account, isNewUser, profile }) => {
      console.log('signIn:', user, account, isNewUser, profile);
      if (ownerToken) {
        await prisma.pollQuestion.updateMany({
          where: { ownerToken },
          data: { ownerToken: null, userId: user.id },
        });
      }
    },
  };
  NextAuth(req, res, authOptions);
};
export default authHandler;
