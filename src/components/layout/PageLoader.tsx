"use client";

import { motion } from "framer-motion";

export function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 0.8, duration: 0.5 }}
      className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-cream dark:bg-black"
    >
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="font-display text-4xl font-bold text-pink-accent dark:text-pink-cream"
      >
        K&K
      </motion.div>
    </motion.div>
  );
}
