// app/api/masters/groups/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const groupSchema = z.object({
  name: z.string().min(2),
  parentGroupId: z.string().optional(),
  companyId: z.string(),
  nature: z.string().optional(),
});

export async function GET() {
  // You may want to filter by companyId in a real app
  const groups = await prisma.accountingGroup.findMany({
    include: { parentGroup: true, childGroups: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(groups);
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = groupSchema.safeParse(body);
  if (!parsed.success)
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });

  const group = await prisma.accountingGroup.create({ data: parsed.data });
  return NextResponse.json(group);
}

export async function PUT(req: Request) {
  const { id, name, parentGroupId, nature } = await req.json();
  const updated = await prisma.accountingGroup.update({
    where: { id },
    data: { name, parentGroupId, nature },
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.accountingGroup.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
