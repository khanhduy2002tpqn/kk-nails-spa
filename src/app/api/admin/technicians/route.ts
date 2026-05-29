import { NextRequest, NextResponse } from "next/server";
import { createTechnicianWithAccount, getTechnicians, removeTechnician } from "@/lib/store";
import { technicianAccountSchema } from "@/lib/validation";

function checkAdmin(request: NextRequest): boolean {
  const key = request.headers.get("x-admin-key");
  const expected = process.env.ADMIN_SECRET ?? "kk-admin-2026";
  return key === expected;
}

export async function GET(request: NextRequest) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const technicians = await getTechnicians();
  return NextResponse.json(technicians);
}

export async function POST(request: NextRequest) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = technicianAccountSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid technician data" }, { status: 400 });
    }

    const result = await createTechnicianWithAccount(parsed.data);
    if (!result) {
      return NextResponse.json({ error: "Username already exists" }, { status: 409 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create technician" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const ok = await removeTechnician(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
