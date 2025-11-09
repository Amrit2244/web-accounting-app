import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const items = await db.stockItem.findMany({
      include: {
        stockGroup: true,
        baseUnit: true,
      },
    });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      alias,
      stockGroupId,
      baseUnitId,
      gstPercentage,
      hsnCode,
      openingQuantity,
      openingRate,
      companyId,
    } = body;

    if (!name || !stockGroupId || !baseUnitId || !companyId) {
      return NextResponse.json(
        { error: "Name, stockGroupId, baseUnitId, and companyId are required" },
        { status: 400 }
      );
    }

    const item = await db.stockItem.create({
      data: {
        name,
        alias,
        stockGroupId,
        baseUnitId,
        gstPercentage: gstPercentage ?? 0,
        hsnCode,
        openingQuantity: openingQuantity ?? 0,
        openingRate: openingRate ?? 0,
        companyId,
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      name,
      alias,
      stockGroupId,
      baseUnitId,
      gstPercentage,
      hsnCode,
      openingQuantity,
      openingRate,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    const item = await db.stockItem.update({
      where: { id },
      data: {
        name,
        alias,
        stockGroupId,
        baseUnitId,
        gstPercentage,
        hsnCode,
        openingQuantity,
        openingRate,
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update item" },
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
        { error: "Item ID is required" },
        { status: 400 }
      );
    }

    await db.stockItem.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Item deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
