"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BRAND, INSTAGRAM_PLACEHOLDER } from "@/lib/constants";
import { InstagramIcon } from "@/components/ui/SocialIcons";

export function InstagramFeed() {
  return (
    <section className="section-padding bg-pink-blush/30 dark:bg-zinc-900/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <p className="section-label">Follow Us</p>
            <h2 className="section-title text-2xl sm:text-3xl">@kknailsandspa</h2>
          </div>
          <a
            href={BRAND.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex items-center gap-2"
          >
            <InstagramIcon size={18} />
            View on Instagram
          </a>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-3 lg:grid-cols-6">
          {INSTAGRAM_PLACEHOLDER.map((src, i) => (
            <motion.a
              key={src}
              href={BRAND.instagram}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group relative aspect-square overflow-hidden rounded-xl"
            >
              <Image
                src={src}
                alt={`Instagram post ${i + 1}`}
                fill
                className="object-cover transition duration-500 group-hover:scale-110"
                sizes="200px"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                <span className="text-white"><InstagramIcon size={24} /></span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
