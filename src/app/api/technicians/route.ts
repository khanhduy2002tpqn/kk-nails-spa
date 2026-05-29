import { NextResponse } from "next/server";
import { getTechnicians } from "@/lib/store";

export async function GET() {
  const technicians = await getTechnicians();
  return NextResponse.json(technicians);
}
