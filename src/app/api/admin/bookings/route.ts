import { NextRequest, NextResponse } from "next/server";
import { verifyStaffToken } from "@/lib/staff-auth";
import { getBookings } from "@/lib/store";

export async function GET(request: NextRequest) {
  const session = verifyStaffToken(request.headers.get("x-staff-token"));
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookings = await getBookings();
  if (session.role === "technician") {
    return NextResponse.json(
      bookings.filter((booking) => booking.technicianId === session.technicianId)
    );
  }

  return NextResponse.json(bookings);
}
