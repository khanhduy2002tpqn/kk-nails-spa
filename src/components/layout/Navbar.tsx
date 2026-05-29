"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Moon, Sun, Search } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { normalizeConfirmationId } from "@/lib/confirmation";
import { Logo } from "@/components/ui/Logo";
import { useTheme } from "@/components/providers/ThemeProvider";

export function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [confirmationId, setConfirmationId] = useState("");
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const findAppointment = (event: FormEvent) => {
    event.preventDefault();
    const id = normalizeConfirmationId(confirmationId);
    if (!id) return;
    setOpen(false);
    router.push(`/manage?id=${encodeURIComponent(id)}`);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 shadow-lg shadow-pink-cream/20 backdrop-blur-md dark:bg-cream/95"
          : "bg-white/40 backdrop-blur-sm dark:bg-cream/30"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/#home" className="group">
          <Logo />
        </Link>

        <ul className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-base tracking-wide text-foreground/80 transition hover:text-pink-accent dark:hover:text-pink-cream"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <form onSubmit={findAppointment} className="flex items-center rounded-full border border-pink-soft/70 bg-white/70 px-2 py-1 dark:border-white/10 dark:bg-white/5">
            <input
              value={confirmationId}
              onChange={(e) => setConfirmationId(e.target.value)}
              placeholder="Find ID"
              aria-label="Find confirmation ID"
              className="w-32 bg-transparent px-2 py-1.5 font-mono text-xs outline-none placeholder:font-sans placeholder:text-muted xl:w-40"
            />
            <button
              type="submit"
              className="flex h-8 w-8 items-center justify-center rounded-full text-foreground/70 transition hover:bg-pink-blush hover:text-pink-accent dark:hover:bg-white/10"
              aria-label="Find appointment"
            >
              <Search size={15} />
            </button>
          </form>
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full p-2 text-foreground/70 transition hover:bg-pink-blush dark:hover:bg-white/10"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <Link href="/book" className="btn-primary">
            Book Appointment
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full p-2"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="rounded-full p-2"
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-pink-soft/40 bg-white/95 backdrop-blur-lg dark:border-white/10 dark:bg-cream/95 lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-3 text-base hover:bg-pink-soft/40 dark:hover:bg-white/5"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <form onSubmit={findAppointment} className="flex gap-2 px-3 pb-2">
                  <input
                    value={confirmationId}
                    onChange={(e) => setConfirmationId(e.target.value)}
                    placeholder="Find confirmation ID"
                    aria-label="Find confirmation ID"
                    className="input-field flex-1 font-mono text-sm"
                  />
                  <button type="submit" className="btn-outline shrink-0 px-4" aria-label="Find appointment">
                    <Search size={18} />
                  </button>
                </form>
              </li>
              <li>
                <Link href="/book" onClick={() => setOpen(false)} className="btn-primary block text-center">
                  Book Appointment
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
