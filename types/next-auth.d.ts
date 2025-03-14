// next-auth.d.ts
import type { DefaultSession } from 'next-auth';
import type { JWT as DefaultJWT } from 'next-auth/jwt';

// Augment the NextAuth Session and User types
declare module 'next-auth' {
  interface Session {
    user?: {
      id?: string;
      email?: string;
      name?: string | null;
      image?: string | null;
      membership?: string; // <-- Add membership here
    } & DefaultSession['user'];
  }

  // The user object returned in authorize() or useSession().data.user
  interface User {
    id: string;
    email: string;
    membership?: string; // <-- Add membership here as well
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id?: string;
    email?: string;
    membership?: string; // If you attach membership info to the JWT
  }
}
