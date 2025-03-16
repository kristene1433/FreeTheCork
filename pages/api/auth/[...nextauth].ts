import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials?.email });
        if (!user) {
          throw new Error('User not found');
        }
        const isValid = await bcrypt.compare(
          credentials?.password ?? '',
          user.passwordHash
        );
        if (!isValid) {
          throw new Error('Invalid password');
        }
        return {
          id: user._id.toString(),
          email: user.email,
          membership: user.membership,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,

 
  pages: {
    signIn: '/login',
  },

  callbacks: {
    // 1) Copy user info to JWT on login
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.membership = user.membership;
      }
      return token;
    },

    // 2) Re-check membership from DB on each session call
    async session({ session, token }) {
      if (token.email) {
        await dbConnect();
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          session.user = {
            ...session.user,
            id: dbUser._id.toString(),
            email: dbUser.email,
            membership: dbUser.membership,
          };
        }
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
