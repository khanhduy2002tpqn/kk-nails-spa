import { z } from "zod";

export const bookingSchema = z.object({
  serviceId: z.string().min(1).optional(),
  serviceIds: z.array(z.string().min(1)).min(1).max(10).optional(),
  technicianId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().min(1),
  customerName: z.string().min(2).max(100),
  customerPhone: z.string().min(10).max(20),
  customerEmail: z.string().email(),
  notes: z.string().max(500).optional(),
}).refine((data) => data.serviceId || data.serviceIds?.length, {
  message: "Select at least one service",
  path: ["serviceIds"],
});

export const rescheduleSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  time: z.string().min(1).optional(),
  status: z.enum(["confirmed", "cancelled", "completed"]).optional(),
});

export const blockedSlotSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  technicianId: z.string().optional(),
  reason: z.string().max(200).optional(),
});

export const staffLoginSchema = z.object({
  username: z.string().trim().min(2).max(50),
  password: z.string().min(6).max(100),
});

export const staffAccountSchema = z.object({
  username: z.string().trim().min(2).max(50),
  password: z.string().min(6).max(100),
  technicianId: z.string().min(1),
});

export const technicianAccountSchema = z.object({
  name: z.string().trim().min(2).max(80),
  title: z.string().trim().min(2).max(100),
  specialties: z.array(z.string().trim().min(1).max(50)).min(1).max(8),
  username: z.string().trim().min(2).max(50),
  password: z.string().min(6).max(100),
});
