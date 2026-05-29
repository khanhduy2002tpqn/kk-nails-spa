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
  LogOut,
  UserPlus,
} from "lucide-react";
import type { BlockedSlot, Booking, PublicStaffAccount, StaffRole, Technician } from "@/types";

type AdminTab = "bookings" | "blocked" | "technicians";

interface AdminSession {
  role: StaffRole;
  key: string;
  token: string;
  username: string;
  technicianId?: string;
  technicianName?: string;
}

export function AdminDashboard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [session, setSession] = useState<AdminSession | null>(null);
  const [loginError, setLoginError] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blocked, setBlocked] = useState<BlockedSlot[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [accounts, setAccounts] = useState<PublicStaffAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [accountMessage, setAccountMessage] = useState("");
  const [tab, setTab] = useState<AdminTab>("bookings");
  const [blockForm, setBlockForm] = useState({
    date: "",
    startTime: "12:00 PM",
    endTime: "1:00 PM",
    technicianId: "",
    reason: "Lunch break",
  });
  const [technicianForm, setTechnicianForm] = useState({
    name: "",
    title: "",
    specialties: "",
    username: "",
    password: "",
  });

  const headers = useCallback(
    () => ({ "x-admin-key": session?.key ?? "", "Content-Type": "application/json" }),
    [session]
  );
  const staffHeaders = useCallback(
    () => ({ "x-staff-token": session?.token ?? "", "Content-Type": "application/json" }),
    [session]
  );

  const isAdministrator = session?.role === "administrator";

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [bRes, blRes] = await Promise.all([
        fetch("/api/admin/bookings", { headers: staffHeaders() }),
        isAdministrator
          ? fetch("/api/admin/blocked", { headers: headers() })
          : Promise.resolve(null),
      ]);
      if (bRes.ok) setBookings(await bRes.json());
      if (blRes?.ok) setBlocked(await blRes.json());
      if (isAdministrator) {
        const [accountsRes, techniciansRes] = await Promise.all([
          fetch("/api/admin/accounts", { headers: headers() }),
          fetch("/api/admin/technicians", { headers: headers() }),
        ]);
        if (accountsRes.ok) setAccounts(await accountsRes.json());
        if (techniciansRes.ok) setTechnicians(await techniciansRes.json());
      }
    } finally {
      setLoading(false);
    }
  }, [headers, isAdministrator, staffHeaders]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (session) loadData();
  }, [session, loadData]);

  const login = async () => {
    setLoginError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Login failed");
      setSession(data);
      setTab("bookings");
      setPassword("");
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setSession(null);
    setBlocked([]);
    setBookings([]);
    setAccounts([]);
    setTab("bookings");
  };

  const cancelBooking = async (id: string) => {
    if (!isAdministrator) return;
    await fetch(`/api/bookings/${id}`, { method: "DELETE" });
    loadData();
  };

  const addBlocked = async () => {
    if (!isAdministrator) return;
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
    if (!isAdministrator) return;
    await fetch(`/api/admin/blocked?id=${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    loadData();
  };

  const addTechnician = async () => {
    if (!isAdministrator) return;
    setAccountMessage("");
    const res = await fetch("/api/admin/technicians", {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        ...technicianForm,
        specialties: technicianForm.specialties
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setAccountMessage("Technician and account created.");
      setTechnicianForm({ name: "", title: "", specialties: "", username: "", password: "" });
      loadData();
    } else {
      setAccountMessage(data.error ?? "Could not create technician.");
    }
  };

  const deleteTechnician = async (id: string) => {
    if (!isAdministrator) return;
    const res = await fetch(`/api/admin/technicians?id=${id}`, {
      method: "DELETE",
      headers: headers(),
    });
    if (res.ok) {
      setAccountMessage("Technician deleted.");
      loadData();
    } else {
      const data = await res.json();
      setAccountMessage(data.error ?? "Could not delete technician.");
    }
  };

  const visibleBookings = session?.role === "technician"
    ? bookings.filter((booking) => booking.technicianId === session.technicianId)
    : bookings;

  const customers = Array.from(
    new Map(
      visibleBookings.map((b) => [
        b.customerEmail,
        {
          name: b.customerName,
          email: b.customerEmail,
          phone: b.customerPhone,
          visits: visibleBookings.filter((x) => x.customerEmail === b.customerEmail).length,
        },
      ])
    ).values()
  );

  if (!session) {
    return (
      <div className="soft-card mx-auto max-w-md">
        <Lock className="mx-auto h-10 w-10 text-pink-accent" />
        <h2 className="mt-4 text-center font-display text-xl font-semibold">Staff Login</h2>
        <p className="mt-2 text-center text-sm text-muted">
          Sign in with your staff username and password.
        </p>
        <input
          className="input-field mt-6"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="input-field mt-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {loginError && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
            {loginError}
          </p>
        )}
        <button type="button" onClick={login} disabled={loading || !username || !password} className="btn-primary mt-4 w-full disabled:opacity-50">
          Enter Dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            {isAdministrator ? "Administrator Dashboard" : "Technician Dashboard"}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {isAdministrator
              ? `Signed in as ${session.username}`
              : `Signed in as ${session.technicianName ?? session.username}`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="btn-outline inline-flex items-center gap-2 text-sm"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            type="button"
            onClick={logout}
            className="btn-outline inline-flex items-center gap-2 text-sm"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        {[
          { label: "Total Bookings", value: visibleBookings.length, icon: Calendar },
          { label: "Confirmed", value: visibleBookings.filter((b) => b.status === "confirmed").length, icon: CheckCircle },
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

      {isAdministrator && (
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
      )}

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
              {visibleBookings.map((b) => (
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
                    {isAdministrator && b.status === "confirmed" && (
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

      {isAdministrator && tab === "blocked" && (
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
              {technicians.filter((t) => t.active).map((t) => (
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

      {isAdministrator && tab === "technicians" && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
          <div className="grid gap-4 sm:grid-cols-2">
            {technicians.map((t) => (
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
                    visibleBookings.filter(
                      (b) => b.technicianId === t.id && b.status === "confirmed"
                    ).length
                  }{" "}
                  upcoming bookings
                </p>
                <p className="mt-2 text-xs text-muted">
                  Account:{" "}
                  {accounts.some((account) => account.technicianId === t.id)
                    ? "Created"
                    : "Not created"}
                </p>
                <button
                  type="button"
                  onClick={() => deleteTechnician(t.id)}
                  className="mt-4 inline-flex items-center gap-1 text-xs text-red-500 hover:underline"
                >
                  <Trash2 size={14} /> Delete technician
                </button>
              </div>
            ))}
          </div>

          <div className="soft-card h-fit space-y-3">
            <h3 className="flex items-center gap-2 font-display font-semibold">
              <UserPlus size={18} /> Add Technician
            </h3>
            <input
              className="input-field"
              value={technicianForm.name}
              onChange={(e) => setTechnicianForm({ ...technicianForm, name: e.target.value })}
              placeholder="Technician name"
            />
            <input
              className="input-field"
              value={technicianForm.title}
              onChange={(e) => setTechnicianForm({ ...technicianForm, title: e.target.value })}
              placeholder="Title"
            />
            <input
              className="input-field"
              value={technicianForm.specialties}
              onChange={(e) => setTechnicianForm({ ...technicianForm, specialties: e.target.value })}
              placeholder="Specialties, separated by commas"
            />
            <input
              className="input-field"
              value={technicianForm.username}
              onChange={(e) => setTechnicianForm({ ...technicianForm, username: e.target.value })}
              placeholder="Username"
            />
            <input
              type="password"
              className="input-field"
              value={technicianForm.password}
              onChange={(e) => setTechnicianForm({ ...technicianForm, password: e.target.value })}
              placeholder="Password"
            />
            {accountMessage && <p className="text-sm text-muted">{accountMessage}</p>}
            <button
              type="button"
              onClick={addTechnician}
              disabled={
                !technicianForm.name ||
                !technicianForm.title ||
                !technicianForm.specialties ||
                !technicianForm.username ||
                technicianForm.password.length < 6
              }
              className="btn-primary w-full disabled:opacity-50"
            >
              Add Technician
            </button>

            <div className="border-t border-pink-soft/40 pt-3 dark:border-white/10">
              <h4 className="text-sm font-semibold">Staff Accounts</h4>
              <ul className="mt-2 space-y-2 text-sm text-muted">
                {accounts.map((account) => (
                  <li key={account.id} className="flex items-center justify-between gap-3">
                    <span>{account.username}</span>
                    <span className="capitalize">{account.role}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {isAdministrator && tab === "bookings" && customers.length > 0 && (
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
