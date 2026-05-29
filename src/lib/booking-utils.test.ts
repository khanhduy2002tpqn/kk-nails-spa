import { describe, it, expect } from "vitest";
import { getAvailableSlots, isSlotAvailable } from "./booking-utils";
import type { Booking, BlockedSlot } from "../types";

describe("Booking utilities", () => {
  const date = "2026-06-02"; // Tuesday
  const technicianId = "kim";

  it("allows booking when there are no conflicts", () => {
    const bookings: Booking[] = [];
    const blocked: BlockedSlot[] = [];

    const available = isSlotAvailable(date, "10:00 AM", 45, technicianId, bookings, blocked);

    expect(available).toBe(true);
  });

  it("rejects a booking that overlaps an existing confirmed booking", () => {
    const bookings: Booking[] = [
      {
        id: "1",
        serviceId: "mani-spa",
        serviceName: "Spa Manicure",
        technicianId,
        technicianName: "Kim",
        date,
        time: "10:30 AM",
        duration: 45,
        customerName: "Jane Doe",
        customerPhone: "1234567890",
        customerEmail: "jane@example.com",
        status: "confirmed",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const blocked: BlockedSlot[] = [];
    const available = isSlotAvailable(date, "10:00 AM", 45, technicianId, bookings, blocked);

    expect(available).toBe(false);
  });

  it("rejects a booking that overlaps a blocked slot", () => {
    const bookings: Booking[] = [];
    const blocked: BlockedSlot[] = [
      {
        id: "block-1",
        date,
        startTime: "11:00 AM",
        endTime: "12:00 PM",
        technicianId,
        reason: "Lunch break",
      },
    ];

    expect(isSlotAvailable(date, "11:00 AM", 45, technicianId, bookings, blocked)).toBe(false);
    expect(isSlotAvailable(date, "12:00 PM", 45, technicianId, bookings, blocked)).toBe(true);
  });

  it("filters available slots correctly", () => {
    const bookings: Booking[] = [
      {
        id: "1",
        serviceId: "mani-spa",
        serviceName: "Spa Manicure",
        technicianId,
        technicianName: "Kim",
        date,
        time: "10:30 AM",
        duration: 45,
        customerName: "Jane Doe",
        customerPhone: "1234567890",
        customerEmail: "jane@example.com",
        status: "confirmed",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const blocked: BlockedSlot[] = [
      {
        id: "block-1",
        date,
        startTime: "11:00 AM",
        endTime: "12:00 PM",
        technicianId,
        reason: "Lunch break",
      },
    ];

    const slots = getAvailableSlots(date, 45, technicianId, bookings, blocked);

    expect(slots).not.toContain("10:00 AM");
    expect(slots).not.toContain("10:30 AM");
    expect(slots).not.toContain("11:00 AM");
    expect(slots).toContain("12:00 PM");
  });

  it("does not permit bookings that would end after closing time", () => {
    const bookings: Booking[] = [];
    const blocked: BlockedSlot[] = [];

    expect(isSlotAvailable(date, "6:30 PM", 45, technicianId, bookings, blocked)).toBe(false);
  });
});
