import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { BlockedSlot, Booking } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");
const BLOCKED_FILE = path.join(DATA_DIR, "blocked-slots.json");

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(file, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(file: string, data: T) {
  await ensureDataDir();
  await fs.writeFile(file, JSON.stringify(data, null, 2), "utf-8");
}

export async function getBookings(): Promise<Booking[]> {
  return readJson<Booking[]>(BOOKINGS_FILE, []);
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const bookings = await getBookings();
  return bookings.find((b) => b.id === id) ?? null;
}

export async function saveBooking(booking: Omit<Booking, "id" | "createdAt" | "updatedAt">): Promise<Booking> {
  const bookings = await getBookings();
  const now = new Date().toISOString();
  const newBooking: Booking = {
    ...booking,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  };
  bookings.push(newBooking);
  await writeJson(BOOKINGS_FILE, bookings);
  return newBooking;
}

export async function updateBooking(id: string, patch: Partial<Booking>): Promise<Booking | null> {
  const bookings = await getBookings();
  const idx = bookings.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  bookings[idx] = { ...bookings[idx], ...patch, updatedAt: new Date().toISOString() };
  await writeJson(BOOKINGS_FILE, bookings);
  return bookings[idx];
}

export async function getBlockedSlots(): Promise<BlockedSlot[]> {
  return readJson<BlockedSlot[]>(BLOCKED_FILE, []);
}

export async function saveBlockedSlot(slot: Omit<BlockedSlot, "id">): Promise<BlockedSlot> {
  const slots = await getBlockedSlots();
  const newSlot: BlockedSlot = { ...slot, id: uuidv4() };
  slots.push(newSlot);
  await writeJson(BLOCKED_FILE, slots);
  return newSlot;
}

export async function removeBlockedSlot(id: string): Promise<boolean> {
  const slots = await getBlockedSlots();
  const filtered = slots.filter((s) => s.id !== id);
  if (filtered.length === slots.length) return false;
  await writeJson(BLOCKED_FILE, filtered);
  return true;
}

export async function seedSampleData() {
  const existing = await getBookings();
  if (existing.length > 0) return;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split("T")[0];

  await saveBooking({
    serviceId: "mani-gel",
    serviceName: "Luxury Gel Manicure",
    technicianId: "kim",
    technicianName: "Kim",
    date: dateStr,
    time: "10:00 AM",
    duration: 45,
    customerName: "Sarah Johnson",
    customerPhone: "610-555-0123",
    customerEmail: "sarah@email.com",
    notes: "Prefer soft pink shade",
    status: "confirmed",
  });

  await saveBooking({
    serviceId: "pedi-spa",
    serviceName: "Spa Pedicure",
    technicianId: "kelly",
    technicianName: "Kelly",
    date: dateStr,
    time: "2:00 PM",
    duration: 60,
    customerName: "Maria Garcia",
    customerPhone: "610-555-0456",
    customerEmail: "maria@email.com",
    status: "confirmed",
  });
}
