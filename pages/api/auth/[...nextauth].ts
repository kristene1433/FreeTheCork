// pages/api/auth/[...nextauth].ts
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
        // 1) Find user by email
        const user = await User.findOne({ email: credentials?.email });
        if (!user) {
          throw new Error('User not found');
        }

        // 2) Compare password with stored hash
        const isValid = await bcrypt.compare(
          credentials?.password ?? '',
          user.passwordHash
        );
        if (!isValid) {
          throw new Error('Invalid password');
        }

        // 3) Return minimal user object for the JWT
        return {
          id: user._id.toString(),
          email: user.email,
          membership: user.membership, // "basic", "premium", etc.
        };
      },
    }),
  ],
  pages: {
    signIn: '/login', // Custom login page
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  // (Optional) Debug in non-production:
  debug: process.env.NODE_ENV !== 'production',

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.membership = user.membership;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.membership = token.membership;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
