"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Droplets, Heart, Shield, Sparkles, Users } from "lucide-react";
import { BRAND_IMAGES } from "@/lib/images";

const features = [
  {
    icon: Sparkles,
    title: "Expert Nail Technicians",
    text: "Our licensed artists specialize in gel, acrylic, dip powder, and custom nail art with precision and care.",
  },
  {
    icon: Shield,
    title: "Clean & Hygienic",
    text: "Hospital-grade sanitation, single-use tools, and spotless stations ensure your safety at every visit.",
  },
  {
    icon: Heart,
    title: "Comfortable Atmosphere",
    text: "Relax in a calm, welcoming space designed to make every visit easy and comfortable.",
  },
  {
    icon: Droplets,
    title: "Professional Products",
    text: "We use trusted professional brands for lasting shine, gentle formulas, and beautiful results.",
  },
  {
    icon: Users,
    title: "Friendly Service",
    text: "Warm welcomes, attentive care, and personalized recommendations — because you deserve to feel valued.",
  },
];

export function About() {
  return (
    <section id="about" className="section-padding bg-cream dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative aspect-[4/5] overflow-hidden rounded-3xl"
          >
            <Image
              src={BRAND_IMAGES.about}
              alt="Professional nail art at K&K Nails and Spa"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-pink-cream/40" />
          </motion.div>

          <div>
            <p className="section-label">About Us</p>
            <h2 className="section-title">Your Local Nail & Spa Studio</h2>
            <p className="mt-4 text-lg text-muted leading-relaxed">
              Welcome to K&K Nails and Spa — Folcroft&apos;s destination for nail care and spa
              services. We blend artistry with relaxation, delivering detailed manicures,
              pedicures, waxing, and lash treatments in a clean, friendly environment.
            </p>
            <p className="mt-4 text-lg text-muted leading-relaxed">
              Whether you&apos;re preparing for a special occasion or treating yourself to weekly
              self-care, our team is dedicated to making every moment memorable.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="soft-card text-center sm:text-left"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pink-blush text-pink-accent dark:bg-white/5 dark:text-pink-cream sm:mx-0">
                <f.icon size={22} />
              </div>
              <h3 className="font-display text-base font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">{f.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
