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
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const lookup = async (idParam?: string) => {
    const id = normalizeConfirmationId(idParam ?? bookingId);
    if (!id) return;
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/bookings/${id}`);
      if (!res.ok) throw new Error("Booking not found");
      const data = await res.json();
      if (redirectOnLookup) {
        router.push(`/manage?id=${encodeURIComponent(id)}`);
        return;
      }
      setBooking(data);
      setNewDate(data.date);
      setNewTime(data.time);
      setBookingId(id);
    } catch {
      setBooking(null);
      setMessage("Could not find booking. Check your confirmation ID.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (id) lookup(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cancel = async () => {
    const res = await fetch(`/api/bookings/${bookingId}`, { method: "DELETE" });
    if (res.ok) {
      setMessage("Appointment cancelled successfully.");
      setBooking(null);
    }
  };

  const reschedule = async () => {
    const res = await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: newDate, time: newTime }),
    });
    const data = await res.json();
    if (res.ok) {
      setBooking(data);
      setMessage("Appointment rescheduled successfully.");
    } else {
      setMessage(data.error ?? "Reschedule failed");
    }
  };

  return (
    <div className="soft-card mx-auto max-w-lg">
      <h3 className="font-display text-lg font-semibold">Manage Your Appointment</h3>
      <p className="mt-1 text-sm text-muted">Enter your confirmation ID from your email</p>
      <div className="mt-4 flex gap-2">
        <input
          className="input-field flex-1 font-mono text-sm"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value.trim())}
          placeholder="Confirmation ID"
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
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              className="input-field"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
            <input
              className="input-field"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              placeholder="e.g. 2:00 PM"
            />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={reschedule} className="btn-primary flex-1 text-sm">
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
