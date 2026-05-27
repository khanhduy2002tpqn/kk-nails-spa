"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function PromoBanner() {
  return (
    <section className="relative overflow-hidden bg-pink-blush py-16 dark:bg-zinc-900">
      <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-pink-cream/40 blur-3xl" />
      <div className="absolute -right-10 top-0 h-48 w-48 rounded-full bg-cream/60 blur-2xl" />
      <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="font-tagline text-2xl text-pink-accent sm:text-3xl">New Client Special</p>
          <h2 className="mt-2 font-display text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl">10% Off Your First Visit</h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-muted sm:text-lg">
            Mention this offer when booking. Cannot be combined with other promotions.
          </p>
          <Link href="/book" className="btn-primary mt-8 inline-block">
            Claim Your Offer
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
