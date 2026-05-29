import { v4 as uuidv4 } from "uuid";
import { TECHNICIANS } from "./constants";
import { hashPassword, verifyPassword } from "./passwords";
import type { BlockedSlot, Booking, PublicStaffAccount, StaffAccount, Technician } from "@/types";
import { getMongoDb } from "./mongodb";

const BOOKINGS_COLLECTION = "bookings";
const BLOCKED_COLLECTION = "blockedSlots";
const STAFF_COLLECTION = "staffAccounts";
const TECHNICIANS_COLLECTION = "technicians";

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

export async function ensureDefaultTechnicians(): Promise<void> {
  const db = await getMongoDb();
  const collection = db.collection<Technician>(TECHNICIANS_COLLECTION);
  const existing = await collection.findOne({});
  if (existing) return;

  await collection.insertMany(TECHNICIANS);
}

export async function getTechnicians(includeInactive = false): Promise<Technician[]> {
  await ensureDefaultTechnicians();
  const db = await getMongoDb();
  return db
    .collection<Technician>(TECHNICIANS_COLLECTION)
    .find(includeInactive ? {} : { active: true })
    .sort({ name: 1 })
    .toArray();
}

export async function getTechnicianById(id: string): Promise<Technician | null> {
  await ensureDefaultTechnicians();
  const db = await getMongoDb();
  return db.collection<Technician>(TECHNICIANS_COLLECTION).findOne({ id });
}

function publicStaffAccount(account: StaffAccount): PublicStaffAccount {
  const safeAccount = { ...account };
  delete (safeAccount as Partial<StaffAccount>).passwordHash;
  return safeAccount;
}

export async function ensureDefaultAdminAccount(): Promise<void> {
  const db = await getMongoDb();
  const collection = db.collection<StaffAccount>(STAFF_COLLECTION);
  const existing = await collection.findOne({});
  if (existing) return;

  const now = new Date().toISOString();
  await collection.insertOne({
    id: uuidv4(),
    username: (process.env.ADMIN_USERNAME ?? "admin").trim().toLowerCase(),
    passwordHash: hashPassword(process.env.ADMIN_PASSWORD ?? "kk-admin-2026"),
    role: "administrator",
    active: true,
    createdAt: now,
    updatedAt: now,
  });
}

export async function getStaffAccounts(): Promise<PublicStaffAccount[]> {
  await ensureDefaultAdminAccount();
  const db = await getMongoDb();
  const accounts = await db
    .collection<StaffAccount>(STAFF_COLLECTION)
    .find()
    .sort({ createdAt: -1 })
    .toArray();

  return accounts.map(publicStaffAccount);
}

export async function createTechnicianAccount(input: {
  username: string;
  password: string;
  technicianId: string;
}): Promise<PublicStaffAccount | null> {
  await Promise.all([ensureDefaultAdminAccount(), ensureDefaultTechnicians()]);
  const db = await getMongoDb();
  const technician = await db
    .collection<Technician>(TECHNICIANS_COLLECTION)
    .findOne({ id: input.technicianId, active: true });
  if (!technician) return null;

  const collection = db.collection<StaffAccount>(STAFF_COLLECTION);
  const username = input.username.trim().toLowerCase();
  const existing = await collection.findOne({ username });
  if (existing) return null;

  const now = new Date().toISOString();
  const account: StaffAccount = {
    id: uuidv4(),
    username,
    passwordHash: hashPassword(input.password),
    role: "technician",
    technicianId: technician.id,
    technicianName: technician.name,
    active: true,
    createdAt: now,
    updatedAt: now,
  };

  await collection.insertOne(account);
  return publicStaffAccount(account);
}

export async function createTechnicianWithAccount(input: {
  name: string;
  title: string;
  specialties: string[];
  username: string;
  password: string;
}): Promise<{ technician: Technician; account: PublicStaffAccount } | null> {
  await Promise.all([ensureDefaultAdminAccount(), ensureDefaultTechnicians()]);
  const db = await getMongoDb();
  const staffCollection = db.collection<StaffAccount>(STAFF_COLLECTION);
  const technicianCollection = db.collection<Technician>(TECHNICIANS_COLLECTION);
  const username = input.username.trim().toLowerCase();
  const existingAccount = await staffCollection.findOne({ username });
  if (existingAccount) return null;

  const technician: Technician = {
    id: uuidv4(),
    name: input.name.trim(),
    title: input.title.trim(),
    specialties: input.specialties.map((item) => item.trim()).filter(Boolean),
    active: true,
  };

  const now = new Date().toISOString();
  const account: StaffAccount = {
    id: uuidv4(),
    username,
    passwordHash: hashPassword(input.password),
    role: "technician",
    technicianId: technician.id,
    technicianName: technician.name,
    active: true,
    createdAt: now,
    updatedAt: now,
  };

  await Promise.all([
    technicianCollection.insertOne(technician),
    staffCollection.insertOne(account),
  ]);

  return { technician, account: publicStaffAccount(account) };
}

export async function removeTechnician(id: string): Promise<boolean> {
  await ensureDefaultTechnicians();
  const db = await getMongoDb();
  const technicianResult = await db.collection<Technician>(TECHNICIANS_COLLECTION).updateOne(
    { id },
    { $set: { active: false } }
  );
  await db.collection<StaffAccount>(STAFF_COLLECTION).updateMany(
    { technicianId: id },
    { $set: { active: false, updatedAt: new Date().toISOString() } }
  );
  return technicianResult.matchedCount === 1;
}

export async function verifyStaffLogin(usernameInput: string, password: string): Promise<PublicStaffAccount | null> {
  await ensureDefaultAdminAccount();
  const db = await getMongoDb();
  const username = usernameInput.trim().toLowerCase();
  const account = await db.collection<StaffAccount>(STAFF_COLLECTION).findOne({ username, active: true });

  if (!account || !verifyPassword(password, account.passwordHash)) {
    return null;
  }

  return publicStaffAccount(account);
}

export async function seedSampleData() {
  const existing = await getBookings();
  if (existing.length > 0) return;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split("T")[0];

  await saveBooking({
    serviceId: "mani-gel",
    serviceName: "Signature Gel Manicure",
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
