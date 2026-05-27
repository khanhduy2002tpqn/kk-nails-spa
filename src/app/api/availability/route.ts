import { NextRequest, NextResponse } from "next/server";
import { SERVICES } from "@/lib/constants";
import { getAvailableSlots } from "@/lib/booking-utils";
import { getBlockedSlots, getBookings } from "@/lib/store";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const serviceId = searchParams.get("serviceId");
  const technicianId = searchParams.get("technicianId");

  if (!date || !serviceId || !technicianId) {
    return NextResponse.json(
      { error: "date, serviceId, and technicianId are required" },
      { status: 400 }
    );
  }

  const service = SERVICES.find((s) => s.id === serviceId);
  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  const [bookings, blocked] = await Promise.all([getBookings(), getBlockedSlots()]);
  const slots = getAvailableSlots(date, service.duration, technicianId, bookings, blocked);

  return NextResponse.json({ date, slots, duration: service.duration });
}
