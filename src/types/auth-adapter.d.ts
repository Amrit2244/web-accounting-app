// src/types/auth-adapter.d.ts

// Important: NextAuth v4 uses `next-auth/adapters` for AdapterUser.
// NextAuth v5 (Auth.js) uses `@auth/core/adapters`.
// Since you're on NextAuth v4.24.13, we target `next-auth/adapters`.
import type { AdapterUser } from "next-auth/adapters"; // Use `type` import for safety
import { UserRole } from "@prisma/client";

declare module "next-auth/adapters" {
  interface AdapterUser {
    role: UserRole;
    companyIds?: string[];
  }
}

// Also augment the NextAuth `User` itself, which the callbacks use
declare module "next-auth" {
  interface User extends AdapterUser {
    // This merges your custom fields onto the NextAuth User type
    // If AdapterUser already has role/companyIds, this ensures consistency.
  }
}

// Ensure JWT and Session also reflect these custom properties
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    companyIds?: string[];
  }
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      companyIds?: string[];
    } & DefaultSession["user"];
  }
}