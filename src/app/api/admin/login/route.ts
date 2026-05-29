import { NextRequest, NextResponse } from "next/server";
import { createStaffToken } from "@/lib/staff-auth";
import { verifyStaffLogin } from "@/lib/store";
import { staffLoginSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = staffLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid login data" }, { status: 400 });
    }

    const account = await verifyStaffLogin(parsed.data.username, parsed.data.password);

    if (!account) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    return NextResponse.json({
      ...account,
      token: createStaffToken(account),
      key: account.role === "administrator" ? process.env.ADMIN_SECRET ?? "kk-admin-2026" : "",
    });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
