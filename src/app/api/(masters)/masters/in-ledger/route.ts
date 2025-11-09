export async function PUT(req: Request) {
  const body = await req.json();
  const { id, name, alias, openingBalance, isDebitOpening, accountingGroupId } = body;
  if (!id) {
    return NextResponse.json({ error: 'Missing ledger id' }, { status: 400 });
  }
  const updated = await prisma.ledger.update({
    where: { id },
    data: {
      name,
      alias,
      openingBalance,
      isDebitOpening,
      accountingGroupId,
    },
  });
  return NextResponse.json(updated);
}
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const ledgerSchema = z.object({
  name: z.string().min(2),
  alias: z.string().optional(),
  openingBalance: z.number().default(0),
  isDebitOpening: z.boolean().default(true),
  accountingGroupId: z.string(),
  companyId: z.string(),
});

export async function GET() {
  // You may want to filter by companyId in a real app
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

  const ledger = await prisma.ledger.create({ data: parsed.data });
  return NextResponse.json(ledger);
}
