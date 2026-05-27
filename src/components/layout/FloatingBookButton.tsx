"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarHeart } from "lucide-react";

export function FloatingBookButton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <Link
        href="/book"
        className="group flex items-center gap-2 rounded-full bg-pink-accent px-6 py-4 text-base font-medium text-white shadow-xl shadow-pink-cream/40 transition hover:bg-pink-cream hover:text-foreground"
      >
        <CalendarHeart size={18} className="transition group-hover:scale-110" />
        <span className="hidden sm:inline">Book Now</span>
      </Link>
    </motion.div>
  );
}
