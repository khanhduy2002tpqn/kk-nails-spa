import { format, parse, isSunday, isSaturday } from "date-fns";
import { BOOKING_HOURS, SHOP_TIME_ZONE, SLOT_INTERVAL_MINUTES } from "./constants";
import type { BlockedSlot, Booking } from "@/types";

function getShopNow(): { date: string; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SHOP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    hourCycle: "h23",
  }).formatToParts(new Date());
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? "0";

  return {
    date: `${value("year")}-${value("month")}-${value("day")}`,
    minutes: Number(value("hour")) * 60 + Number(value("minute")),
  };
}

export function getDayHours(date: Date): { open: number; close: number } {
  if (isSunday(date)) return BOOKING_HOURS.sunday;
  if (isSaturday(date)) return BOOKING_HOURS.saturday;
  return BOOKING_HOURS.weekday;
}

export function generateTimeSlots(date: Date): string[] {
  const { open, close } = getDayHours(date);
  const slots: string[] = [];
  let minutes = open * 60;
  const closeMinutes = close * 60;

  while (minutes < closeMinutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const slotDate = new Date(date);
    slotDate.setHours(h, m, 0, 0);
    slots.push(format(slotDate, "h:mm a"));
    minutes += SLOT_INTERVAL_MINUTES;
  }

  return slots;
}

export function timeToMinutes(time: string, date: Date): number {
  const t = parse(time, "h:mm a", date);
  return t.getHours() * 60 + t.getMinutes();
}

export function rangesOverlap(
  startA: number,
  endA: number,
  startB: number,
  endB: number
): boolean {
  return startA < endB && startB < endA;
}

export function isSlotAvailable(
  date: string,
  time: string,
  duration: number,
  technicianId: string,
  bookings: Booking[],
  blocked: BlockedSlot[]
): boolean {
  const dateObj = parse(date, "yyyy-MM-dd", new Date());
  const start = timeToMinutes(time, dateObj);
  const end = start + duration;

  const dayBookings = bookings.filter(
    (b) =>
      b.date === date &&
      b.technicianId === technicianId &&
      b.status === "confirmed"
  );

  for (const b of dayBookings) {
    const bStart = timeToMinutes(b.time, dateObj);
    const bEnd = bStart + b.duration;
    if (rangesOverlap(start, end, bStart, bEnd)) return false;
  }

  const dayBlocked = blocked.filter(
    (bl) => bl.date === date && (!bl.technicianId || bl.technicianId === technicianId)
  );

  for (const bl of dayBlocked) {
    const bStart = timeToMinutes(bl.startTime, dateObj);
    const bEnd = timeToMinutes(bl.endTime, dateObj);
    if (rangesOverlap(start, end, bStart, bEnd)) return false;
  }

  const { close } = getDayHours(dateObj);
  if (end > close * 60) return false;

  return true;
}

export function getAvailableSlots(
  date: string,
  duration: number,
  technicianId: string,
  bookings: Booking[],
  blocked: BlockedSlot[]
): string[] {
  const dateObj = parse(date, "yyyy-MM-dd", new Date());
  const shopNow = getShopNow();

  if (date < shopNow.date) return [];

  return generateTimeSlots(dateObj).filter((time) =>
    (date !== shopNow.date || timeToMinutes(time, dateObj) >= shopNow.minutes) &&
    isSlotAvailable(date, time, duration, technicianId, bookings, blocked)
  );
}
