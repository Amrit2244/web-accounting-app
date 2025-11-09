import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET() {
  try {
    const godowns = await db.godown.findMany({
      include: {
        company: true,
      },
    });
    return NextResponse.json(godowns);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch godowns" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, address, companyId } = body;

    if (!name)
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    if (!companyId)
      return NextResponse.json(
        { error: "Company ID is required" },
        { status: 400 }
      );

    const godown = await db.godown.create({
      data: {
        name,
        address,
        company: {
          connect: { id: companyId },
        },
      },
    });
    return NextResponse.json(godown);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create godown" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, address } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Godown ID is required" },
        { status: 400 }
      );
    }

    const godown = await db.godown.update({
      where: { id },
      data: {
        name,
        address,
      },
    });
    return NextResponse.json(godown);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update godown" },
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
        { error: "Godown ID is required" },
        { status: 400 }
      );
    }

    await db.godown.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Godown deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete godown" },
      { status: 500 }
    );
  }
}
