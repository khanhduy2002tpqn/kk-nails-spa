"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { GALLERY_ITEMS } from "@/lib/constants";

const filters = [
  { id: "all", label: "All" },
  { id: "nails", label: "Nail Art" },
  { id: "clients", label: "Our Work" },
] as const;

export function Gallery() {
  const [filter, setFilter] = useState<string>("all");
  const items =
    filter === "all"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((g) => g.category === filter);

  return (
    <section id="gallery" className="section-padding bg-cream dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="section-label">Gallery</p>
          <h2 className="section-title">Artistry in Every Detail</h2>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-5 py-2 text-sm transition sm:text-base ${
                filter === f.id
                  ? "bg-pink-accent text-white"
                  : "text-muted hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 6) * 0.05 }}
              className={`group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl ${
                item.span === "tall" ? "sm:mb-6" : ""
              }`}
            >
              <div className={`relative w-full ${item.span === "tall" ? "aspect-[3/4]" : "aspect-square"}`}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
                <p className="absolute bottom-4 left-4 translate-y-2 font-display text-base font-medium text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                  {item.alt}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
