// src/app/api/register/route.ts
import { NextResponse } from 'next/server';
import db from '@/lib/db'; // Your Prisma client instance
import { hashPassword } from '@/lib/auth'; // Your password hashing utility

export async function POST(req: Request) {
  try {
    const { name, email, password, companyName } = await req.json();

    if (!name || !email || !password || !companyName) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    // Transaction to ensure atomicity: either user AND company are created, or neither
    const newUserAndCompany = await db.$transaction(async (prisma: typeof db) => {
      // Check if any company exists (to determine if this is the first admin)
      const companyCount = await prisma.company.count();
      const isFirstAdmin = companyCount === 0;

      let company;
      if (isFirstAdmin) {
        // Create the first company
        company = await prisma.company.create({
          data: {
            name: companyName,
          },
        });
      } else {
        throw new Error("Only the first user can create a new company through registration. Please contact an admin or use an existing company.");
      }

      // Create the user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: isFirstAdmin ? 'ADMIN' : 'USER', // First user is ADMIN
          companies: {
            create: {
              companyId: company.id,
              role: isFirstAdmin ? 'ADMIN' : 'USER', // User's role within this specific company
            },
          },
        },
      });

      return { user, company, isFirstAdmin };
    });

    // After user and company created, create default Accounting Groups and Ledgers (outside transaction)
    if (newUserAndCompany.isFirstAdmin && newUserAndCompany.company) {
      const company = newUserAndCompany.company;
      const defaultPrimaryGroups = [
        { name: "Capital Account", isPrimary: true, nature: "Credit" },
        { name: "Loans (Liability)", isPrimary: true, nature: "Credit" },
        { name: "Current Liabilities", isPrimary: true, nature: "Credit" },
        { name: "Fixed Assets", isPrimary: true, nature: "Debit" },
        { name: "Current Assets", isPrimary: true, nature: "Debit" },
        { name: "Investments", isPrimary: true, nature: "Debit" },
        { name: "Sales Account", isPrimary: true, nature: "Credit" },
        { name: "Purchase Account", isPrimary: true, nature: "Debit" },
        { name: "Direct Expenses", isPrimary: true, nature: "Debit" },
        { name: "Direct Incomes", isPrimary: true, nature: "Credit" },
        { name: "Indirect Expenses", isPrimary: true, nature: "Debit" },
        { name: "Indirect Incomes", isPrimary: true, nature: "Credit" },
      ];
      for (const groupData of defaultPrimaryGroups) {
        await db.accountingGroup.create({
          data: {
            companyId: company.id,
            name: groupData.name,
            isPrimary: groupData.isPrimary,
            nature: groupData.nature
          }
        });
      }
      // Add default Ledgers for basic functionality (Cash, P&L, etc.)
      const currentAssetsGroup = await db.accountingGroup.findFirst({
        where: { companyId: company.id, name: "Current Assets" }
      });
      const capitalAccountGroup = await db.accountingGroup.findFirst({
        where: { companyId: company.id, name: "Capital Account" }
      });
      if (currentAssetsGroup) {
        await db.ledger.create({
          data: {
            companyId: company.id,
            accountingGroupId: currentAssetsGroup.id,
            name: "Cash in Hand",
            openingBalance: 0,
            isDebitOpening: true
          }
        });
        await db.ledger.create({
          data: {
            companyId: company.id,
            accountingGroupId: currentAssetsGroup.id,
            name: "Bank Account",
            openingBalance: 0,
            isDebitOpening: true
          }
        });
      }
      if (capitalAccountGroup) {
        await db.ledger.create({
          data: {
            companyId: company.id,
            accountingGroupId: capitalAccountGroup.id,
            name: "Capital", // Default Capital Ledger
            openingBalance: 0,
            isDebitOpening: false // Capital is Credit in nature
          }
        });
      }
    }
    return NextResponse.json(
      { message: 'User and Company created successfully!', user: newUserAndCompany.user.email },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration API error:', error);
    return NextResponse.json({ message: error.message || 'Something went wrong.' }, { status: 500 });
  }
}