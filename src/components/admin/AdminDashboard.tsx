"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Calendar,
  Lock,
  Trash2,
  Users,
  RefreshCw,
  Ban,
  CheckCircle,
} from "lucide-react";
import { TECHNICIANS } from "@/lib/constants";
import type { BlockedSlot, Booking } from "@/types";

export function AdminDashboard() {
  const [adminKey, setAdminKey] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blocked, setBlocked] = useState<BlockedSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"bookings" | "blocked" | "technicians">("bookings");
  const [blockForm, setBlockForm] = useState({
    date: "",
    startTime: "12:00 PM",
    endTime: "1:00 PM",
    technicianId: "",
    reason: "Lunch break",
  });

  const headers = useCallback(
    () => ({ "x-admin-key": adminKey, "Content-Type": "application/json" }),
    [adminKey]
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [bRes, blRes] = await Promise.all([
        fetch("/api/bookings"),
        fetch("/api/admin/blocked", { headers: headers() }),
      ]);
      if (bRes.ok) setBookings(await bRes.json());
      if (blRes.ok) setBlocked(await blRes.json());
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    if (authenticated) loadData();
  }, [authenticated, loadData]);

  const login = () => {
    if (adminKey.length >= 4) setAuthenticated(true);
  };

  const cancelBooking = async (id: string) => {
    await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    loadData();
  };

  const addBlocked = async () => {
    const res = await fetch("/api/admin/blocked", {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(blockForm),
    });
    if (res.ok) {
      setBlockForm({ ...blockForm, reason: "" });
      loadData();
    }
  };

  const removeBlocked = async (id: string) => {
    await fetch(`/api/admin/blocked?id=${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    loadData();
  };

  const customers = Array.from(
    new Map(
      bookings.map((b) => [
        b.customerEmail,
        {
          name: b.customerName,
          email: b.customerEmail,
          phone: b.customerPhone,
          visits: bookings.filter((x) => x.customerEmail === b.customerEmail).length,
        },
      ])
    ).values()
  );

  if (!authenticated) {
    return (
      <div className="soft-card mx-auto max-w-md">
        <Lock className="mx-auto h-10 w-10 text-pink-accent" />
        <h2 className="mt-4 text-center font-display text-xl font-semibold">Admin Login</h2>
        <p className="mt-2 text-center text-sm text-muted">
          Default key: <code className="text-foreground">kk-admin-2026</code>
        </p>
        <input
          type="password"
          className="input-field mt-6"
          placeholder="Admin secret key"
          value={adminKey}
          onChange={(e) => setAdminKey(e.target.value)}
        />
        <button type="button" onClick={login} className="btn-primary mt-4 w-full">
          Enter Dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold">Admin Dashboard</h1>
        <button
          type="button"
          onClick={loadData}
          disabled={loading}
          className="btn-outline inline-flex items-center gap-2 text-sm"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        {[
          { label: "Total Bookings", value: bookings.length, icon: Calendar },
          { label: "Confirmed", value: bookings.filter((b) => b.status === "confirmed").length, icon: CheckCircle },
          { label: "Customers", value: customers.length, icon: Users },
        ].map((stat) => (
          <div key={stat.label} className="soft-card flex items-center gap-3">
            <stat.icon className="text-pink-accent" size={22} />
            <div>
              <p className="text-2xl font-semibold">{stat.value}</p>
              <p className="text-xs text-muted">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6 flex gap-2 border-b border-pink-soft/40 dark:border-white/10">
        {(["bookings", "blocked", "technicians"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm capitalize transition ${
              tab === t
                ? "border-b-2 border-pink-accent text-pink-accent dark:text-pink-cream"
                : "text-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "bookings" && (
        <div className="overflow-x-auto rounded-2xl border border-pink-soft/40 dark:border-white/10">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-pink-soft/30 text-xs uppercase tracking-wider dark:bg-white/5">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Tech</th>
                <th className="px-4 py-3">Date/Time</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id} className="border-t border-pink-soft/30 dark:border-white/5">
                  <td className="px-4 py-3">
                    <p className="font-medium">{b.customerName}</p>
                    <p className="text-xs text-muted">{b.customerPhone}</p>
                  </td>
                  <td className="px-4 py-3">{b.serviceName}</td>
                  <td className="px-4 py-3">{b.technicianName}</td>
                  <td className="px-4 py-3">
                    {b.date}
                    <br />
                    <span className="text-muted">{b.time}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        b.status === "confirmed"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {b.status === "confirmed" && (
                      <button
                        type="button"
                        onClick={() => cancelBooking(b.id)}
                        className="text-xs text-red-500 hover:underline"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "blocked" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="soft-card space-y-3">
            <h3 className="font-display font-semibold flex items-center gap-2">
              <Ban size={18} /> Block Time Slot
            </h3>
            <input
              type="date"
              className="input-field"
              value={blockForm.date}
              onChange={(e) => setBlockForm({ ...blockForm, date: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                className="input-field"
                value={blockForm.startTime}
                onChange={(e) => setBlockForm({ ...blockForm, startTime: e.target.value })}
                placeholder="Start"
              />
              <input
                className="input-field"
                value={blockForm.endTime}
                onChange={(e) => setBlockForm({ ...blockForm, endTime: e.target.value })}
                placeholder="End"
              />
            </div>
            <select
              className="input-field"
              value={blockForm.technicianId}
              onChange={(e) => setBlockForm({ ...blockForm, technicianId: e.target.value })}
            >
              <option value="">All technicians</option>
              {TECHNICIANS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <input
              className="input-field"
              value={blockForm.reason}
              onChange={(e) => setBlockForm({ ...blockForm, reason: e.target.value })}
              placeholder="Reason"
            />
            <button type="button" onClick={addBlocked} className="btn-primary w-full">
              Block Slot
            </button>
          </div>
          <ul className="space-y-2">
            {blocked.map((bl) => (
              <li key={bl.id} className="soft-card flex items-center justify-between text-sm">
                <span>
                  {bl.date} · {bl.startTime}–{bl.endTime}
                  {bl.technicianId && ` · ${bl.technicianId}`}
                </span>
                <button type="button" onClick={() => removeBlocked(bl.id)} className="text-red-500">
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "technicians" && (
        <div className="grid gap-4 sm:grid-cols-2">
          {TECHNICIANS.map((t) => (
            <div key={t.id} className="soft-card">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-semibold">{t.name}</h3>
                <span
                  className={`text-xs ${t.active ? "text-green-600" : "text-muted"}`}
                >
                  {t.active ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-sm text-muted">{t.title}</p>
              <p className="mt-2 text-xs">{t.specialties.join(", ")}</p>
              <p className="mt-3 text-xs text-muted">
                {
                  bookings.filter(
                    (b) => b.technicianId === t.id && b.status === "confirmed"
                  ).length
                }{" "}
                upcoming bookings
              </p>
            </div>
          ))}
        </div>
      )}

      {tab === "bookings" && customers.length > 0 && (
        <div className="mt-10">
          <h3 className="font-display text-lg font-semibold">Customer Database</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {customers.map((c) => (
              <div key={c.email} className="soft-card text-sm">
                <p className="font-medium">{c.name}</p>
                <p className="text-muted">{c.email}</p>
                <p className="text-muted">{c.phone}</p>
                <p className="mt-2 text-xs text-pink-accent dark:text-pink-cream">{c.visits} visit(s)</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
