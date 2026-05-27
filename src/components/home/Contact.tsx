"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, Phone, Mail } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { FacebookIcon, InstagramIcon } from "@/components/ui/SocialIcons";

export function Contact() {
  return (
    <section id="contact" className="section-padding bg-cream dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="section-label">Contact</p>
          <h2 className="section-title">Visit Our Salon</h2>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="luxury-card flex gap-4">
              <MapPin className="shrink-0 text-pink-accent dark:text-pink-cream" size={22} />
              <div>
                <h3 className="font-display text-lg font-bold">Address</h3>
                <p className="mt-1 text-base text-muted">{BRAND.fullAddress}</p>
              </div>
            </div>
            <div className="luxury-card flex gap-4">
              <Phone className="shrink-0 text-pink-accent dark:text-pink-cream" size={22} />
              <div>
                <h3 className="font-display text-lg font-bold">Phone</h3>
                <a
                  href={`tel:${BRAND.phoneRaw}`}
                  className="mt-1 block text-base text-muted hover:text-pink-accent dark:hover:text-pink-cream"
                >
                  {BRAND.phone}
                </a>
              </div>
            </div>
            <div className="luxury-card flex gap-4">
              <Mail className="shrink-0 text-pink-accent dark:text-pink-cream" size={22} />
              <div>
                <h3 className="font-display text-lg font-bold">Email</h3>
                <a
                  href={`mailto:${BRAND.email}`}
                  className="mt-1 block text-base text-muted hover:text-pink-accent dark:hover:text-pink-cream"
                >
                  {BRAND.email}
                </a>
              </div>
            </div>
            <div className="luxury-card flex gap-4">
              <Clock className="shrink-0 text-pink-accent dark:text-pink-cream" size={22} />
              <div>
                <h3 className="font-display text-lg font-bold">Business Hours</h3>
                <ul className="mt-2 space-y-1.5 text-base text-muted">
                  {BRAND.hoursDisplay.map((h) => (
                    <li key={h.days} className="flex justify-between gap-4">
                      <span>{h.days}</span>
                      <span className="text-foreground/80">{h.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex gap-3">
              <a href={BRAND.instagram} target="_blank" rel="noopener noreferrer" className="social-icon">
                <InstagramIcon size={18} />
              </a>
              <a href={BRAND.facebook} target="_blank" rel="noopener noreferrer" className="social-icon">
                <FacebookIcon size={18} />
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-3xl ring-1 ring-pink-soft/60 dark:ring-white/10"
          >
            <iframe
              title="K&K Nails and Spa location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3058!2d-75.283!3d39.892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c6b3f8e8e8e8e8%3A0x0!2zMTg2MCBEZWxtYXIgRHIsIEZvbGNyb2Z0LCBQQSAxOTAzMg!5e0!3m2!1sen!2sus!4v1"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 420 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
