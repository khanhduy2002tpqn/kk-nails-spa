"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { BRAND_IMAGES } from "@/lib/images";

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={BRAND_IMAGES.hero}
          alt="Luxury cream pink manicure at K&K Nails and Spa"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/92 via-cream/88 to-pink-blush/50 dark:from-pink-blush/90 dark:via-cream/85 dark:to-white/70" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 pb-24 pt-32 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-pink-cream/60 bg-white/90 px-5 py-2 text-sm uppercase tracking-[0.2em] text-pink-accent shadow-sm backdrop-blur"
          >
            <Sparkles size={14} />
            Folcroft, Pennsylvania
          </motion.div>

          <h1 className="font-display text-5xl font-bold leading-[1.08] text-foreground sm:text-6xl lg:text-[4.25rem]">
            {BRAND.name}
          </h1>
          <p className="mt-3 font-tagline text-2xl text-pink-accent dark:text-pink-cream sm:text-3xl lg:text-4xl">
            {BRAND.tagline}
          </p>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
            Indulge in a sanctuary of elegance. From bespoke nail artistry to rejuvenating spa
            rituals, every visit is crafted for your comfort and confidence.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/book" className="btn-primary">
              Book Appointment
            </Link>
            <Link href="#services" className="btn-outline">
              View Services
            </Link>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="h-10 w-6 rounded-full border-2 border-pink-cream/50 p-1">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="mx-auto h-2 w-1 rounded-full bg-pink-accent"
          />
        </div>
      </motion.div>
    </section>
  );
}
