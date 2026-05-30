"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SERVICE_CATEGORIES, SERVICES } from "@/lib/constants";

export function Services() {
  const [active, setActive] = useState("manicure");
  const filtered = SERVICES.filter((s) => s.category === active);

  return (
    <section id="services" className="section-padding bg-pink-blush/40 dark:bg-zinc-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="section-label">Services & Pricing</p>
          <h2 className="section-title">Curated Beauty Menu</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Transparent pricing and professional service so you can plan your visit.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActive(cat.id)}
              className={`rounded-full px-5 py-2.5 text-sm font-medium tracking-wide transition sm:text-base ${
                active === cat.id
                  ? "bg-pink-accent text-white shadow-md shadow-pink-cream/25"
                  : "bg-cream text-foreground/70 hover:bg-pink-blush dark:bg-white/10 dark:hover:bg-white/15"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filtered.map((service) => (
              <article key={service.id} className="soft-card group">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-display text-lg font-bold group-hover:text-pink-accent dark:group-hover:text-pink-cream">
                    {service.name}
                  </h3>
                  <span className="shrink-0 font-display text-xl font-bold text-pink-accent dark:text-pink-cream">
                    {service.priceLabel ?? `$${service.price}`}
                  </span>
                </div>
              </article>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 text-center">
          <Link href="/book" className="btn-primary inline-flex items-center gap-2">
            Book Your Service
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
