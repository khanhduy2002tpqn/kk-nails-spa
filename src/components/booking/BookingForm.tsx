"use client";

import { useCallback, useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, addDays, isBefore } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  User,
} from "lucide-react";
import { SERVICES, SHOP_TIME_ZONE } from "@/lib/constants";
import { formatConfirmationId } from "@/lib/confirmation";
import type { Booking, Technician } from "@/types";
import "react-day-picker/style.css";

const STEPS = ["Service", "Technician", "Date & Time", "Your Info", "Confirm"];

function getShopToday(): Date {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: SHOP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const value = (type: string) => parts.find((part) => part.type === type)?.value ?? "1";

  return new Date(Number(value("year")), Number(value("month")) - 1, Number(value("day")));
}

export function BookingForm() {
  const [step, setStep] = useState(0);
  const [serviceIds, setServiceIds] = useState<string[]>([]);
  const [technicianId, setTechnicianId] = useState("");
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState("");
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    notes: "",
  });

  const selectedServices = serviceIds
    .map((id) => SERVICES.find((service) => service.id === id))
    .filter((service): service is (typeof SERVICES)[number] => Boolean(service));
  const totalPrice = selectedServices.reduce((total, service) => total + service.price, 0);
  const technician = technicians.find((t) => t.id === technicianId);
  const dateStr = date ? format(date, "yyyy-MM-dd") : "";
  const shopToday = getShopToday();

  useEffect(() => {
    const loadTechnicians = async () => {
      try {
        const res = await fetch("/api/technicians");
        if (!res.ok) throw new Error("Could not load technicians");
        setTechnicians(await res.json());
      } catch {
        setTechnicians([]);
      }
    };

    loadTechnicians();
  }, []);

  const fetchSlots = useCallback(async () => {
    if (!dateStr || serviceIds.length === 0 || !technicianId) return;
    setLoadingSlots(true);
    setError("");
    try {
      const res = await fetch(
        `/api/availability?date=${dateStr}&serviceIds=${serviceIds.join(",")}&technicianId=${technicianId}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSlots(data.slots ?? []);
      if (!data.slots?.includes(time)) setTime("");
    } catch {
      setSlots([]);
      setError("Could not load availability");
    } finally {
      setLoadingSlots(false);
    }
  }, [dateStr, serviceIds, technicianId, time]);

  useEffect(() => {
    if (step >= 2) fetchSlots();
  }, [step, fetchSlots]);

  const canNext = () => {
    if (step === 0) return serviceIds.length > 0;
    if (step === 1) return !!technicianId;
    if (step === 2) return !!date && !!time;
    if (step === 3)
      return (
        form.customerName.length >= 2 &&
        form.customerPhone.length >= 10 &&
        form.customerEmail.includes("@")
      );
    return true;
  };

  const toggleService = (id: string) => {
    setServiceIds((current) =>
      current.includes(id)
        ? current.filter((serviceId) => serviceId !== id)
        : [...current, id]
    );
    setTime("");
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: serviceIds[0],
          serviceIds,
          technicianId,
          date: dateStr,
          time,
          ...form,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Booking failed");
      setBooking(data);
      setStep(4);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (booking && step === 4) {
    const confirmationIdLines = formatConfirmationId(booking.id);

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="soft-card mx-auto max-w-lg text-center"
      >
        <CheckCircle2 className="mx-auto h-16 w-16 text-pink-accent" />
        <h2 className="mt-4 font-display text-3xl font-bold">Appointment Confirmed!</h2>
        <p className="mt-2 text-base text-muted">
          A confirmation has been sent to {booking.customerEmail}
        </p>
        <dl className="mt-8 space-y-2 text-left text-base">
          <div className="flex justify-between border-b border-pink-soft/40 py-2 dark:border-white/10">
            <dt className="text-muted">Service</dt>
            <dd className="font-medium">{booking.serviceName}</dd>
          </div>
          <div className="flex justify-between border-b border-pink-soft/40 py-2 dark:border-white/10">
            <dt className="text-muted">Technician</dt>
            <dd className="font-medium">{booking.technicianName}</dd>
          </div>
          <div className="flex justify-between border-b border-pink-soft/40 py-2 dark:border-white/10">
            <dt className="text-muted">Date</dt>
            <dd className="font-medium">{booking.date}</dd>
          </div>
          <div className="flex justify-between py-2">
            <dt className="text-muted">Time</dt>
            <dd className="font-medium">{booking.time}</dd>
          </div>
        </dl>
        <p className="mt-6 text-xs text-muted">
          Need to cancel or reschedule? Call us or use your confirmation ID:
          <span className="mx-auto mt-2 block max-w-full overflow-x-auto rounded-lg border border-pink-soft/60 bg-white/60 px-3 py-2 font-mono text-sm leading-relaxed text-foreground dark:border-white/10 dark:bg-white/5">
            {confirmationIdLines.map((line) => (
              <span key={line} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </span>
        </p>
      </motion.div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex justify-between gap-2">
        {STEPS.slice(0, 4).map((label, i) => (
          <div
            key={label}
            className={`flex-1 border-b-2 pb-2 text-center text-xs uppercase tracking-wider sm:text-sm ${
              i <= step
                ? "border-pink-accent text-pink-accent dark:text-pink-cream"
                : "border-pink-soft/60 text-muted dark:border-white/10"
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          className="soft-card"
        >
          {step === 0 && (
            <div>
              <h3 className="font-display text-xl font-bold">Select Your Services</h3>
              <div className="mt-4 max-h-80 space-y-2 overflow-y-auto pr-1">
                {SERVICES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleService(s.id)}
                    className={`flex w-full items-center justify-between rounded-xl border-2 px-4 py-3.5 text-left text-base transition-all duration-300 ease-out ${
                      serviceIds.includes(s.id)
                        ? "scale-[1.01] border-pink-accent bg-pink-blush shadow-md shadow-pink-cream/25"
                        : "border-pink-soft/60 bg-cream/40 hover:-translate-y-0.5 hover:border-pink-accent hover:bg-pink-blush hover:shadow-md hover:shadow-pink-cream/20 dark:border-white/10"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs ${
                          serviceIds.includes(s.id)
                            ? "border-pink-accent bg-pink-accent text-white"
                            : "border-pink-soft bg-white/60 dark:bg-white/5"
                        }`}
                      >
                        {serviceIds.includes(s.id) ? "✓" : ""}
                      </span>
                      {s.name}
                    </span>
                    <span className="shrink-0 text-xs text-muted">{s.priceLabel ?? `$${s.price}`}</span>
                  </button>
                ))}
              </div>
              {selectedServices.length > 0 && (
                <p className="mt-4 rounded-lg bg-pink-blush px-3 py-2 text-sm text-muted dark:bg-white/5">
                  {selectedServices.length} service(s) selected · ${totalPrice}+
                </p>
              )}
            </div>
          )}

          {step === 1 && (
            <div>
              <h3 className="font-display text-xl font-bold">Choose Your Technician</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {technicians.filter((t) => t.active).map((t) => {
                  const selected = technicianId === t.id;
                  return (
                    <motion.button
                      key={t.id}
                      type="button"
                      onClick={() => setTechnicianId(t.id)}
                      whileHover={{ scale: selected ? 1.02 : 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className={`group rounded-xl border-2 p-4 text-left transition-all duration-300 ease-out ${
                        selected
                          ? "border-pink-accent bg-pink-blush shadow-md shadow-pink-cream/30"
                          : "border-pink-soft/60 bg-cream/50 hover:-translate-y-0.5 hover:border-pink-accent hover:bg-pink-blush hover:shadow-md hover:shadow-pink-cream/20 dark:border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-lg font-bold transition-all duration-300 ${
                            selected
                              ? "bg-pink-accent/20 text-pink-accent ring-2 ring-pink-accent/40"
                              : "bg-pink-blush text-pink-accent/80 group-hover:bg-pink-accent/15 group-hover:text-pink-accent group-hover:ring-2 group-hover:ring-pink-accent/25 dark:bg-white/10 dark:text-pink-cream"
                          }`}
                        >
                          {t.name[0]}
                        </div>
                        <div>
                          <p
                            className={`font-display text-base font-bold transition-colors duration-300 ${
                              selected ? "text-pink-accent" : "group-hover:text-pink-accent"
                            }`}
                          >
                            {t.name}
                          </p>
                          <p className="text-sm text-muted">{t.title}</p>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-muted transition-colors duration-300 group-hover:text-foreground/80">
                        {t.specialties.join(" · ")}
                      </p>
                    </motion.button>
                  );
                })}
                {technicians.length === 0 && (
                  <p className="text-sm text-muted">No technicians are available right now.</p>
                )}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="font-display text-xl font-bold">Pick Date & Time</h3>
              <p className="mt-1 text-sm text-muted">
                Checking {technician?.name}&apos;s availability. Available time slots only appear when the technician is free.
              </p>
              <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:justify-center">
                <DayPicker
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => isBefore(d, shopToday) || isBefore(addDays(shopToday, 60), d)}
                  className="mx-auto rounded-xl border border-pink-soft/40 p-3 dark:border-white/10"
                />
                <div className="flex-1">
                  <p className="mb-3 flex items-center gap-2 text-sm text-muted">
                    <Calendar size={16} />
                    {date ? format(date, "EEEE, MMMM d") : "Select a date"}
                  </p>
                  {loadingSlots ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="animate-spin text-pink-accent" />
                    </div>
                  ) : slots.length === 0 && date ? (
                    <p className="text-sm text-muted">No available slots. Try another date or technician.</p>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {slots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setTime(slot)}
                          className={`rounded-lg border-2 py-2.5 text-sm transition-all duration-300 ease-out ${
                            time === slot
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
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="font-display text-xl font-bold">Your Information</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="label">Full Name</label>
                  <input
                    className="input-field"
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    placeholder="Jane Smith"
                  />
                </div>
                <div>
                  <label className="label">Phone Number</label>
                  <input
                    className="input-field"
                    type="tel"
                    value={form.customerPhone}
                    onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                    placeholder="610-555-0123"
                  />
                </div>
                <div>
                  <label className="label">Email</label>
                  <input
                    className="input-field"
                    type="email"
                    value={form.customerEmail}
                    onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <label className="label">Notes (optional)</label>
                  <textarea
                    className="input-field min-h-[80px] resize-none"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Allergies, preferred colors, special requests..."
                  />
                </div>
              </div>
            </div>
          )}

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
              {error}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 flex justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="btn-outline inline-flex items-center gap-1 disabled:opacity-40"
        >
          <ChevronLeft size={16} /> Back
        </button>
        {step < 3 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canNext()}
            className="btn-primary inline-flex items-center gap-1 disabled:opacity-40"
          >
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canNext() || submitting}
            className="btn-primary inline-flex items-center gap-2 disabled:opacity-40"
          >
            {submitting ? <Loader2 size={16} className="animate-spin" /> : <User size={16} />}
            Confirm Booking
          </button>
        )}
      </div>

      {step >= 1 && selectedServices.length > 0 && technician && (
        <p className="mt-4 text-center text-xs text-muted">
          {selectedServices.map((service) => service.name).join(", ")} with {technician.name}
          {date && time ? ` · ${format(date, "MMM d")} at ${time}` : ""}
        </p>
      )}
    </div>
  );
}
