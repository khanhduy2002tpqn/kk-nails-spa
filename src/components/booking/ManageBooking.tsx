"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { normalizeConfirmationId } from "@/lib/confirmation";
import type { Booking } from "@/types";

interface ManageBookingProps {
  redirectOnLookup?: boolean;
}

export function ManageBooking({ redirectOnLookup = false }: ManageBookingProps) {
  const router = useRouter();
  const [bookingId, setBookingId] = useState("");
  const [contact, setContact] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const lookup = async (idParam?: string, contactParam?: string) => {
    const id = normalizeConfirmationId(idParam ?? bookingId);
    const contactValue = (contactParam ?? contact).trim();
    if (!id || !contactValue) {
      setMessage("Enter your confirmation ID and email or phone.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/bookings/${id}?contact=${encodeURIComponent(contactValue)}`);
      if (!res.ok) throw new Error("Booking not found");
      const data = await res.json();
      if (redirectOnLookup) {
        window.sessionStorage.setItem(`manage-contact:${id}`, contactValue);
        router.push(`/manage?id=${encodeURIComponent(id)}`);
        return;
      }
      setBooking(data);
      setNewDate(data.date);
      setNewTime(data.time);
      setBookingId(id);
      setContact(contactValue);
    } catch {
      setBooking(null);
      setMessage("Could not find booking. Check your confirmation ID and email or phone.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const normalizedId = id ? normalizeConfirmationId(id) : "";
    const contactParam = normalizedId ? window.sessionStorage.getItem(`manage-contact:${normalizedId}`) ?? "" : "";
    if (id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBookingId(normalizedId);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setContact(contactParam);
      if (contactParam) lookup(id, contactParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!booking || !newDate) return;

    const loadSlots = async () => {
      setLoadingSlots(true);
      try {
        const serviceIds = booking.serviceIds?.length ? booking.serviceIds : [booking.serviceId];
        const res = await fetch(
          `/api/availability?date=${newDate}&serviceIds=${serviceIds.join(",")}&technicianId=${booking.technicianId}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Could not load availability");

        const availableSlots = data.slots ?? [];
        const visibleSlots =
          newDate === booking.date && !availableSlots.includes(booking.time)
            ? [booking.time, ...availableSlots]
            : availableSlots;

        setSlots(visibleSlots);
        setNewTime((currentTime) => (visibleSlots.includes(currentTime) ? currentTime : ""));
      } catch {
        setSlots([]);
        setMessage("Could not load available time slots.");
      } finally {
        setLoadingSlots(false);
      }
    };

    loadSlots();
  }, [booking, newDate]);

  const cancel = async () => {
    const res = await fetch(`/api/bookings/${bookingId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact: contact.trim() }),
    });
    if (res.ok) {
      setMessage("Appointment cancelled successfully.");
      setBooking(null);
    } else {
      setMessage("Cancel failed. Check your email or phone and try again.");
    }
  };

  const reschedule = async () => {
    const confirmed = window.confirm("Are you sure you want to reschedule this appointment?");
    if (!confirmed) return;

    const res = await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: newDate, time: newTime, contact: contact.trim() }),
    });
    const data = await res.json();
    if (res.ok) {
      setBooking(data);
      setMessage("Appointment rescheduled successfully.");
      router.push("/");
    } else {
      setMessage(data.error ?? "Reschedule failed");
    }
  };

  return (
    <div className="soft-card mx-auto max-w-lg">
      <h3 className="font-display text-lg font-semibold">Manage Your Appointment</h3>
      <p className="mt-1 text-sm text-muted">Enter your confirmation ID and the email or phone from your booking.</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
        <input
          className="input-field font-mono text-sm"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value.trim())}
          placeholder="Confirmation ID"
        />
        <input
          className="input-field text-sm"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Email or phone"
        />
        <button type="button" onClick={() => lookup()} disabled={loading} className="btn-primary shrink-0">
          {loading ? <Loader2 size={16} className="animate-spin" /> : "Find"}
        </button>
      </div>

      {message && <p className="mt-3 text-sm text-muted">{message}</p>}

      {booking && booking.status === "confirmed" && (
        <div className="mt-6 space-y-4 border-t border-pink-soft/40 pt-6 dark:border-white/10">
          <p className="text-sm">
            <strong>{booking.serviceName}</strong> with {booking.technicianName}
            <br />
            {booking.date} at {booking.time}
          </p>
          <div className="space-y-3">
            <input
              type="date"
              className="input-field"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
            <div>
              <p className="mb-2 text-xs text-muted">
                Select an available time.
              </p>
              {loadingSlots ? (
                <div className="flex justify-center rounded-lg border border-pink-soft/50 py-5 dark:border-white/10">
                  <Loader2 size={18} className="animate-spin text-pink-accent" />
                </div>
              ) : slots.length === 0 ? (
                <p className="rounded-lg border border-pink-soft/50 px-3 py-3 text-sm text-muted dark:border-white/10">
                  No available slots for this date.
                </p>
              ) : (
                <div className="grid max-h-44 grid-cols-3 gap-2 overflow-y-auto pr-1 sm:grid-cols-4">
                  {slots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setNewTime(slot)}
                      className={`rounded-lg border-2 py-2.5 text-sm transition-all duration-300 ease-out ${
                        newTime === slot
                          ? "scale-105 border-pink-accent bg-pink-accent text-white shadow-md shadow-pink-cream/30"
                          : "border-pink-soft/60 hover:-translate-y-0.5 hover:border-pink-accent hover:bg-pink-blush hover:text-pink-accent hover:shadow-sm dark:border-white/10"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={reschedule} disabled={!newTime} className="btn-primary flex-1 text-sm disabled:opacity-40">
              Reschedule
            </button>
            <button
              type="button"
              onClick={cancel}
              className="btn-outline flex-1 text-sm text-red-600 dark:text-red-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
