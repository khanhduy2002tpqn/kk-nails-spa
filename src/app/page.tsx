import { Hero } from "@/components/home/Hero";
import { About } from "@/components/home/About";
import { Services } from "@/components/home/Services";
import { PromoBanner } from "@/components/home/PromoBanner";
import { Gallery } from "@/components/home/Gallery";
import { Testimonials } from "@/components/home/Testimonials";
import { InstagramFeed } from "@/components/home/InstagramFeed";
import { Contact } from "@/components/home/Contact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <PromoBanner />
      <Gallery />
      <Testimonials />
      <InstagramFeed />
      <Contact />
    </>
  );
}
