import { NextRequest, NextResponse } from "next/server";
import { createTechnicianAccount, getStaffAccounts, resetStaffPassword } from "@/lib/store";
import { verifyStaffToken } from "@/lib/staff-auth";
import { resetStaffPasswordSchema, staffAccountSchema } from "@/lib/validation";

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

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = resetStaffPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid reset password data" }, { status: 400 });
    }

    const session = verifyStaffToken(request.headers.get("x-staff-token"));
    const allowed = checkAdmin(request) || session?.id === parsed.data.accountId;
    if (!allowed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updated = await resetStaffPassword(parsed.data.accountId, parsed.data.password);
    if (!updated) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
  }
}
