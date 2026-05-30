import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@/lib/store", () => ({
  getBookings: vi.fn(),
  getBlockedSlots: vi.fn(),
  getTechnicianById: vi.fn(),
  saveBooking: vi.fn(),
}));

vi.mock("@/lib/email", () => ({
  sendConfirmationEmail: vi.fn(),
}));

import { GET, POST } from "./route";
import type { Booking } from "@/types";
import { getBookings, getBlockedSlots, getTechnicianById, saveBooking } from "@/lib/store";
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
const mockedGetTechnicianById = vi.mocked(getTechnicianById);
const mockedSaveBooking = vi.mocked(saveBooking);
const mockedSendConfirmationEmail = vi.mocked(sendConfirmationEmail);

describe("API /bookings route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("GET is not exposed publicly", async () => {
    const response = await GET();
    expect(response.status).toBe(405);
    const body = await response.json();
    expect(body.error).toContain("/api/admin/bookings");
    expect(mockedGetBookings).not.toHaveBeenCalled();
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
    mockedGetTechnicianById.mockResolvedValue({
      id: "kim",
      name: "Kim",
      title: "Lead Nail Artist",
      specialties: ["Gel"],
      active: true,
    });

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
    mockedGetTechnicianById.mockResolvedValue({
      id: "kim",
      name: "Kim",
      title: "Lead Nail Artist",
      specialties: ["Gel"],
      active: true,
    });
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
    mockedGetTechnicianById.mockResolvedValue({
      id: "kim",
      name: "Kim",
      title: "Lead Nail Artist",
      specialties: ["Gel"],
      active: true,
    });
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
