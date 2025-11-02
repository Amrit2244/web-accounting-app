// src/app/api/auth/[...nextauth]/route.ts
// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { SessionStrategy } from "next-auth"; // ADD SessionStrategy here
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
// import { UserRole } from "@prisma/client"; // Removed, use string for role type
import { verifyPassword } from "@/lib/auth";
import db from "@/lib/db";
// Explicitly type the PrismaClient instance if needed, though db from "@/lib/db" is fine
// const prisma = db; // No need for this line, directly use 'db'

export const authOptions: any = {
  adapter: PrismaAdapter(db) as any, // Use the 'db' instance directly
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({ // Use 'db' directly
          where: { email: credentials.email },
          include: { companies: true } // Include companies to get companyIds
        });

        if (!user) {
          throw new Error("No user found with the email provided.");
        }

        const isValid = await verifyPassword(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Could not log you in. Invalid password.");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          companyIds: user.companies.map((uc: { companyId: any; }) => uc.companyId),
        };
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy, // Specify session strategy
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) { // `session` not typically needed here
      if (user) {
        token.id = user.id;
        token.role = (user as any).role as string; // Cast to string
        token.companyIds = (user as any).companyIds as string[]; // Cast to string array
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.companyIds = token.companyIds as string[];
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions) ;

export { handler as GET, handler as POST };