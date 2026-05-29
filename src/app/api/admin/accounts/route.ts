import { NextRequest, NextResponse } from "next/server";
import { createTechnicianAccount, getStaffAccounts } from "@/lib/store";
import { staffAccountSchema } from "@/lib/validation";

function checkAdmin(request: NextRequest): boolean {
  const key = request.headers.get("x-admin-key");
  const expected = process.env.ADMIN_SECRET ?? "kk-admin-2026";
  return key === expected;
}

export async function GET(request: NextRequest) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const accounts = await getStaffAccounts();
  return NextResponse.json(accounts);
}

export async function POST(request: NextRequest) {
  if (!checkAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = staffAccountSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid account data" }, { status: 400 });
    }

    const account = await createTechnicianAccount(parsed.data);
    if (!account) {
      return NextResponse.json({ error: "Username exists or technician is invalid" }, { status: 409 });
    }

    return NextResponse.json(account, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
