import { v4 as uuidv4 } from "uuid";
import type { BlockedSlot, Booking } from "@/types";
import { getMongoDb } from "./mongodb";

const BOOKINGS_COLLECTION = "bookings";
const BLOCKED_COLLECTION = "blockedSlots";

export async function getBookings(): Promise<Booking[]> {
  const db = await getMongoDb();
  return db.collection<Booking>(BOOKINGS_COLLECTION).find().toArray();
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const db = await getMongoDb();
  return db.collection<Booking>(BOOKINGS_COLLECTION).findOne({ id });
}

export async function saveBooking(booking: Omit<Booking, "id" | "createdAt" | "updatedAt">): Promise<Booking> {
  const db = await getMongoDb();
  const now = new Date().toISOString();
  const newBooking: Booking = {
    ...booking,
    id: uuidv4(),
    createdAt: now,
    updatedAt: now,
  };
  await db.collection<Booking>(BOOKINGS_COLLECTION).insertOne(newBooking);
  return newBooking;
}

export async function updateBooking(id: string, patch: Partial<Booking>): Promise<Booking | null> {
  const db = await getMongoDb();
  const updated = await db
    .collection<Booking>(BOOKINGS_COLLECTION)
    .findOneAndUpdate(
      { id },
      { $set: { ...patch, updatedAt: new Date().toISOString() } },
      { returnDocument: "after" }
    );

  if (!updated) {
    return null;
  }

  return updated;
}

export async function getBlockedSlots(): Promise<BlockedSlot[]> {
  const db = await getMongoDb();
  return db.collection<BlockedSlot>(BLOCKED_COLLECTION).find().toArray();
}

export async function saveBlockedSlot(slot: Omit<BlockedSlot, "id">): Promise<BlockedSlot> {
  const db = await getMongoDb();
  const newSlot: BlockedSlot = { ...slot, id: uuidv4() };
  await db.collection<BlockedSlot>(BLOCKED_COLLECTION).insertOne(newSlot);
  return newSlot;
}

export async function removeBlockedSlot(id: string): Promise<boolean> {
  const db = await getMongoDb();
  const result = await db.collection<BlockedSlot>(BLOCKED_COLLECTION).deleteOne({ id });
  return result.deletedCount === 1;
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
