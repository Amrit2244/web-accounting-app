import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const stockGroups = await db.stockGroup.findMany({
      include: {
        parentGroup: true,
      },
    });
    return NextResponse.json(stockGroups);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch stock groups" },
      { status: 500 }
    );
  }
}
