import { createHmac, timingSafeEqual } from "crypto";
import type { PublicStaffAccount, StaffRole } from "@/types";

export interface StaffTokenPayload {
  id: string;
  role: StaffRole;
  technicianId?: string;
}

function tokenSecret(): string {
  return process.env.ADMIN_SECRET ?? "kk-admin-2026";
}

function encodePayload(payload: StaffTokenPayload): string {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

function signPayload(payload: string): string {
  return createHmac("sha256", tokenSecret()).update(payload).digest("base64url");
}

export function createStaffToken(account: PublicStaffAccount): string {
  const payload = encodePayload({
    id: account.id,
    role: account.role,
    technicianId: account.technicianId,
  });

  return `${payload}.${signPayload(payload)}`;
}

export function verifyStaffToken(token: string | null): StaffTokenPayload | null {
  if (!token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expected = Buffer.from(signPayload(payload));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return null;
  }

  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as StaffTokenPayload;
  } catch {
    return null;
  }
}
