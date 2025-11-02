# Accounting & Inventory Management — Project Scaffold

This document contains the initial scaffold you requested:

1. Project initialization commands
2. Prisma schema for accounting & inventory entities
3. Folder structure (recommended) and base `route.ts` API setup
4. NextAuth setup (Credentials provider) with roles (admin/user)

---

## 1) Project initialization commands

Run these from your workspace root. I assume pnpm (or npm) — adapt if you prefer yarn.

```bash
# create Next.js 15 app using app router
pnpm create next-app@latest apps/web -- --experimental-app
cd apps/web

# Install runtime deps
pnpm add react react-dom next@latest prisma @prisma/client
pnpm add next-auth bcryptjs zod react-hook-form zustand
pnpm add tailwindcss postcss autoprefixer shadcn-ui lucide-react recharts
pnpm add @tanstack/react-table jsPDF xlsx date-fns sonner

# Dev only
pnpm add -D prisma

# Initialize prisma & tailwind (tailwind steps)
npx prisma init --datasource-provider postgresql
pnpm exec tailwindcss init -p

# Optional: add shadcn tooling
pnpm dlx shadcn@latest init

# initialize Git
git init
```

Add environment variables in `.env` (see below in NextAuth section).

---

## 2) Prisma schema

Save this as `packages/prisma/schema.prisma` (if you prefer monorepo) or `apps/web/prisma/schema.prisma`.

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// -----------------------------
// Shared / Multi-company models
// -----------------------------



Notes:

* Use `Decimal` type (requires `@prisma/client` and proper PG numeric mapping). In your `schema.prisma` you might need `@@map` or `@db.Decimal` depending on generator — adjust as needed.
* Normalize additional attributes as you implement features (e.g., GST ledgers, tax configurations, sales/purchase settings).

---

## 3) Folder structure (monorepo friendly)

```
apps/
  web/
    app/
      (auth)/
      dashboard/
      masters/
        groups/
        ledgers/
        items/
        units/
        godowns/
      vouchers/
        create/
        list/
      reports/
        ledger-statement/
        trial-balance/
        p-and-l/
        balance-sheet/
        stock-summary/
    components/
      ui/  // shadcn wrappers and shared components
      table/ // TanStack table defaults
      charts/ // Recharts wrapper
    lib/
      prisma.ts
      auth.ts
      validators.ts
      accounting.ts
    prisma/
      schema.prisma
    utils/
      date.ts
      export.ts  // PDF / Excel helpers
    styles/
    route.ts  // optional root API router
    next.config.js
    tailwind.config.js
    tsconfig.json
packages/
  prisma/  // optional: sleep-safe prisma client generation
  ui/      // shared shadcn components

```

### Base `lib/prisma.ts`

```ts
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
```

### Example `apps/web/app/api/route.ts` (App Router API entry)

```ts
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  return NextResponse.json({ ok: true, message: 'API is running' });
}

export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json({ received: body });
}
```

For modular APIs, create files under `app/api/v1/...` or `app/api/auth/...`.

---

## 4) NextAuth setup (Credentials) — `app/api/auth/[...nextauth]/route.ts`

Create `.env` entries required:

```
DATABASE_URL="postgresql://..."  # Neon connection string
NEXTAUTH_SECRET="a_long_random_secret"
NEXTAUTH_URL="http://localhost:3000"
```

Then create the route:

```ts
// app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const user = await prisma.user.findUnique({ where: { username: credentials.username } });
        if (!user) return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.isAdmin = (user as any).isAdmin ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).user.isAdmin = token.isAdmin;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

Notes:

* This uses the Prisma adapter so `User` model mapping must be compatible with NextAuth. Our `User` model is minimal; you can add fields like `emailVerified` if needed.
* You should seed an admin user (see below).

---

## Seed / Admin creation

Create `prisma/seed.ts` script to create a default company, admin role and admin user. Example:

```ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()

async function main(){
  const adminRole = await prisma.role.upsert({
    where: { name: 'Admin' },
    update: {},
    create: { name: 'Admin', permissions: JSON.stringify({ '*': ['*'] }) }
  })

  const company = await prisma.company.create({ data: { name: 'Default Co', fiscalYearStart: new Date('2025-04-01'), fiscalYearEnd: new Date('2026-03-31') }})

  const passwordHash = await bcrypt.hash('password123', 10)
  const user = await prisma.user.upsert({ where: { email: 'admin@example.com' }, update: {}, create: { email: 'admin@example.com', username: 'admin', password: passwordHash, isAdmin: true }})

  await prisma.userCompany.create({ data: { userId: user.id, companyId: company.id, roleId: adminRole.id }})
}

main().catch(e => { console.error(e); process.exit(1) }).finally(()=>prisma.$disconnect())
```

Run: `ts-node prisma/seed.ts` or compile+run via `node`.

---

## Additional Implementation Notes & Suggested Flow

* **Voucher posting logic**: When posting a voucher, create the Voucher record, then create `VoucherEntry` rows. For each `VoucherEntry` with `ledgerId`, create matching `LedgerEntry` rows (DEBIT/CREDIT). Ensure debits == credits before marking `posted=true`.
* **Inventory update**: For voucher entries containing `itemId` + `quantity`, create `InventoryTransaction` rows (IN for purchase, OUT for sales). Update stock valuation per item using selected valuation method (FIFO/LIFO/AVG) by reading `InventoryTransaction` history.
* **Reports**: Build DB-level queries in `lib/accounting.ts` that aggregate `LedgerEntry` plus `openingBalance` to produce Trial Balance, P&L (group mapping), and Balance Sheet.
* **RBAC**: Use `Role.permissions` JSON to store module permissions and evaluate server-side in APIs.
* **Soft deletes & edit history**: Use `AuditLog` to store `before` and `after` JSON. For soft delete, add a `deletedAt` column where needed or simply mark `active` boolean.
* **Performance**: Add indexes on `companyId`, `date`, `ledgerId`, `itemId` for queries.
* **Backups**: Neon has pg_dump-compatible backups; set up a cron job or Neon scheduled backups.

---

## Next steps I can help with (pick one):

* Generate API endpoints for Groups, Ledgers, Items, Vouchers (CRUD + validations)
* Implement voucher posting logic & unit tests
* Create TanStack tables and sample UI pages (masters & vouchers)
* Build report query implementations (Trial Balance / P&L / Balance Sheet)

---

*End of scaffold.*
