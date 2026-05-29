import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/lib/store", () => ({
  getBookings: vi.fn(),
  getBlockedSlots: vi.fn(),
  saveBooking: vi.fn(),
  seedSampleData: vi.fn(),
}));

vi.mock("@/lib/email", () => ({
  sendConfirmationEmail: vi.fn(),
}));

import { GET, POST } from "./route";
import type { Booking, BlockedSlot } from "@/types";
import { getBookings, getBlockedSlots, saveBooking, seedSampleData } from "@/lib/store";
import { sendConfirmationEmail } from "@/lib/email";

const mockBooking: Booking = {
  id: "booking-1",
  serviceId: "mani-spa",
  serviceName: "Spa Manicure",
  technicianId: "kim",
  technicianName: "Kim",
  date: "2026-06-02",
  time: "10:00 AM",
  duration: 45,
  customerName: "Test Customer",
  customerPhone: "6105551234",
  customerEmail: "test@example.com",
  notes: "Test booking",
  status: "confirmed",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockedGetBookings = vi.mocked(getBookings);
const mockedGetBlockedSlots = vi.mocked(getBlockedSlots);
const mockedSaveBooking = vi.mocked(saveBooking);
const mockedSeedSampleData = vi.mocked(seedSampleData);
const mockedSendConfirmationEmail = vi.mocked(sendConfirmationEmail);

describe("API /bookings route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("GET returns the current bookings after seeding sample data", async () => {
    mockedSeedSampleData.mockResolvedValue(undefined);
    mockedGetBookings.mockResolvedValue([mockBooking]);

    const response = await GET();
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([mockBooking]);
    expect(mockedSeedSampleData).toHaveBeenCalled();
    expect(mockedGetBookings).toHaveBeenCalled();
  });

  it("POST returns 400 for invalid booking payload", async () => {
    const request = new Request("http://localhost/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const response = await POST(request as any);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Invalid booking data");
  });

  it("POST returns 400 for invalid service or technician", async () => {
    const payload = {
      serviceId: "invalid-service",
      technicianId: "kim",
      date: "2026-06-02",
      time: "10:00 AM",
      customerName: "Jane Doe",
      customerPhone: "6105550000",
      customerEmail: "jane@example.com",
    };

    const request = new Request("http://localhost/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const response = await POST(request as any);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Invalid service or technician");
  });

  it("POST returns 409 when the requested slot is no longer available", async () => {
    mockedGetBookings.mockResolvedValue([mockBooking]);
    mockedGetBlockedSlots.mockResolvedValue([]);

    const payload = {
      serviceId: "mani-spa",
      technicianId: "kim",
      date: mockBooking.date,
      time: "10:00 AM",
      customerName: "Jane Doe",
      customerPhone: "6105550000",
      customerEmail: "jane@example.com",
      notes: "Please arrive early",
    };

    const request = new Request("http://localhost/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const response = await POST(request as any);
    expect(response.status).toBe(409);
    const body = await response.json();
    expect(body.error).toBe("This time slot is no longer available. Please choose another.");
  });

  it("POST successfully creates a booking and sends a confirmation email", async () => {
    mockedGetBookings.mockResolvedValue([]);
    mockedGetBlockedSlots.mockResolvedValue([]);
    mockedSaveBooking.mockResolvedValue(mockBooking);
    mockedSendConfirmationEmail.mockResolvedValue(true);

    const payload = {
      serviceId: "mani-spa",
      technicianId: "kim",
      date: "2026-06-02",
      time: "9:00 AM",
      customerName: "Jane Doe",
      customerPhone: "6105550000",
      customerEmail: "jane@example.com",
      notes: "Looking forward to it",
    };

    const request = new Request("http://localhost/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const response = await POST(request as any);
    expect(response.status).toBe(201);

    const body = await response.json();
    expect(body).toEqual(mockBooking);
    expect(mockedSaveBooking).toHaveBeenCalled();
    expect(mockedSendConfirmationEmail).toHaveBeenCalledWith(mockBooking);
  });
});
