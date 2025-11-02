// src/types/next-auth.d.ts
import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { UserRole } from "@prisma/client"; // Import from Prisma client types

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      companyIds?: string[];
    } & DefaultSession["user"];
  }

  interface User {
    id: string; // Add id to user
    role: UserRole;
    companyIds?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    companyIds?: string[];
  }
}

declare module "next-auth" {
  interface User extends DefaultUser {
    role?: string;
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role?: string;
    } & DefaultSession["user"];
  }
}