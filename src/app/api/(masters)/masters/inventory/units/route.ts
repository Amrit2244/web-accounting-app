import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const units = await db.unitOfMeasure.findMany({
      include: {
        baseUnit: true,
      },
    });
    return NextResponse.json(units);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch units" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, symbol, companyId } = body;

    if (!name || !symbol || !companyId)
      return NextResponse.json(
        { error: "Name, symbol, and companyId are required" },
        { status: 400 }
      );

    const unit = await db.unitOfMeasure.create({
      data: {
        name,
        symbol,
        companyId,
      },
    });
    return NextResponse.json(unit);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create unit" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, symbol } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Unit ID is required" },
        { status: 400 }
      );
    }

    const unit = await db.unitOfMeasure.update({
      where: { id },
      data: {
        name,
        symbol,
      },
    });
    return NextResponse.json(unit);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update unit" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Unit ID is required" },
        { status: 400 }
      );
    }

    await db.unitOfMeasure.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Unit deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete unit" },
      { status: 500 }
    );
  }
}
