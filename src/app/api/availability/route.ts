import { NextRequest, NextResponse } from "next/server";
import { SERVICES } from "@/lib/constants";
import { getAvailableSlots } from "@/lib/booking-utils";
import { getBlockedSlots, getBookings, getTechnicianById } from "@/lib/store";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const serviceId = searchParams.get("serviceId");
  const serviceIdsParam = searchParams.get("serviceIds");
  const technicianId = searchParams.get("technicianId");
  const serviceIds = serviceIdsParam
    ? serviceIdsParam.split(",").map((id) => id.trim()).filter(Boolean)
    : serviceId
      ? [serviceId]
      : [];

  if (!date || serviceIds.length === 0 || !technicianId) {
    return NextResponse.json(
      { error: "date, serviceIds, and technicianId are required" },
      { status: 400 }
    );
  }

  const selectedServices = serviceIds
    .map((id) => SERVICES.find((service) => service.id === id))
    .filter((service): service is (typeof SERVICES)[number] => Boolean(service));
  if (selectedServices.length !== serviceIds.length) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  const technician = await getTechnicianById(technicianId);
  if (!technician?.active) {
    return NextResponse.json({ error: "Technician not found" }, { status: 404 });
  }

  const [bookings, blocked] = await Promise.all([getBookings(), getBlockedSlots()]);
  const duration = selectedServices.reduce((total, service) => total + service.duration, 0);
  const slots = getAvailableSlots(date, duration, technicianId, bookings, blocked);

  return NextResponse.json({ date, slots, duration });
}
