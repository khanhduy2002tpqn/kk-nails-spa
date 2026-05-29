"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";

export function Testimonials() {
  return (
    <section id="reviews" className="section-padding bg-pink-blush/50 dark:bg-pink-blush/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="section-label">Testimonials</p>
          <h2 className="section-title">Loved by Our Clients</h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.article
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="soft-card relative"
            >
              <Quote className="absolute right-4 top-4 h-8 w-8 text-pink-cream/40" />
              <div className="flex gap-0.5 text-pink-accent">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="mt-4 text-base leading-relaxed text-foreground/90 sm:text-lg">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-6 border-t border-pink-soft/50 pt-4 dark:border-white/10">
                <p className="font-display text-base font-bold">{t.name}</p>
                <p className="text-sm text-muted">
                  {t.service} · {t.date}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
