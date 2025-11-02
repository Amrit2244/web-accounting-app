// app/api/masters/ledgers/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const ledgerSchema = z.object({
  name: z.string().min(2),
  groupId: z.string(),
  companyId: z.string(),
  openingBalance: z.number().default(0),
  openingType: z.enum(["DEBIT", "CREDIT"]),
});

export async function GET() {
  const ledgers = await prisma.ledger.findMany({
    include: { group: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(ledgers);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = ledgerSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });

  const ledger = await prisma.ledger.create({
    data: {
      ...parsed.data,
      accountingGroupId: parsed.data.groupId, // or set appropriately
    },
  });
  return NextResponse.json(ledger);
}

export async function PUT(req: Request) {
  const { id, name, openingBalance, openingType, groupId } = await req.json();
  const updated = await prisma.ledger.update({
    where: { id },
    data: { 
      name, 
      openingBalance, 
      group: { connect: { id: groupId } } 
    },
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.ledger.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
