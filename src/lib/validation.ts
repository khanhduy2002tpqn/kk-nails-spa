import { z } from "zod";

export const bookingSchema = z.object({
  serviceId: z.string().min(1),
  technicianId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().min(1),
  customerName: z.string().min(2).max(100),
  customerPhone: z.string().min(10).max(20),
  customerEmail: z.string().email(),
  notes: z.string().max(500).optional(),
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
