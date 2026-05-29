"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail } from "lucide-react";
import { BRAND, NAV_LINKS } from "@/lib/constants";
import { Logo } from "@/components/ui/Logo";
import { FacebookIcon, InstagramIcon } from "@/components/ui/SocialIcons";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  return (
    <footer className="border-t border-pink-soft/50 bg-pink-blush/40 dark:border-white/10 dark:bg-pink-blush/20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-base leading-relaxed text-muted">
              Nail and spa services in Folcroft, Pennsylvania with clean stations, friendly care,
              and detailed artistry.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={BRAND.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="Instagram"
              >
                <InstagramIcon size={18} />
              </a>
              <a
                href={BRAND.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                aria-label="Facebook"
              >
                <FacebookIcon size={18} />
              </a>
              <a href={`mailto:${BRAND.email}`} className="social-icon" aria-label="Email">
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display text-base font-bold uppercase tracking-widest text-pink-accent dark:text-pink-cream">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-base text-muted transition hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/book" className="text-base text-muted transition hover:text-foreground">
                  Book Online
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-base font-bold uppercase tracking-widest text-pink-accent dark:text-pink-cream">
              Visit Us
            </h3>
            <address className="mt-4 space-y-2 text-base not-italic text-muted">
              <p>{BRAND.fullAddress}</p>
              <p>
                <a href={`tel:${BRAND.phoneRaw}`} className="hover:text-pink-accent dark:hover:text-pink-cream">
                  {BRAND.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${BRAND.email}`} className="hover:text-pink-accent dark:hover:text-pink-cream">
                  {BRAND.email}
                </a>
              </p>
            </address>
          </div>

          <div>
            <h3 className="font-display text-base font-bold uppercase tracking-widest text-pink-accent dark:text-pink-cream">
              Newsletter
            </h3>
            <p className="mt-4 text-base text-muted">
              Exclusive offers, nail trends, and spa tips delivered to your inbox.
            </p>
            {subscribed ? (
              <p className="mt-4 text-base text-pink-accent dark:text-pink-cream">Thank you for subscribing!</p>
            ) : (
              <form onSubmit={handleNewsletter} className="mt-4 flex gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="input-field flex-1"
                />
                <button type="submit" className="btn-primary shrink-0 px-5">
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-pink-soft/40 pt-8 text-center text-sm text-muted dark:border-white/10 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <p>Cash preferred · Walk-ins welcome when available</p>
        </div>
      </div>
    </footer>
  );
}
