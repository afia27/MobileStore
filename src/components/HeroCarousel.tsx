"use client";

import React from "react";
import { Carousel, CarouselItem } from "@/components/ui/carousel";
// Autoplay plugin for Embla
// Make sure to install: npm i embla-carousel-react embla-carousel-autoplay
import Autoplay from "embla-carousel-autoplay";

const IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=1600&auto=format&fit=crop",
    alt: "Modern smartphone on desk",
  },
  {
    src: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1600&auto=format&fit=crop",
    alt: "iPhone on keyboard",
  },
  {
    src: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=1600&auto=format&fit=crop",
    alt: "Android phone showcase",
  },
  {
    src: "https://images.unsplash.com/photo-1601134991665-a020399422e3?q=80&w=400&auto=format&fit=crop",
    alt: "Iphone",
  },
  {
    src: "https://images.pexels.com/photos/5139254/pexels-photo-5139254.jpeg?q=80&w=400&auto=format&fit=crop",
    alt: "Foldable phone",
  }
];

export default function HeroCarousel() {
  return (
    <div className="relative w-full max-w-[900px]">
      <Carousel className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-lg bg-black" plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}>
        {IMAGES.map((img) => (
          <CarouselItem key={img.src}>
            <div className="relative w-full h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover object-center"
                loading="eager"
                decoding="async"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            </div>
          </CarouselItem>
        ))}
      </Carousel>
      <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-2">
        {/* Simple decorative dots; Embla handles autoplay */}
        <span className="w-2 h-2 rounded-full bg-white/80" />
        <span className="w-2 h-2 rounded-full bg-white/60" />
        <span className="w-2 h-2 rounded-full bg-white/60" />
        <span className="w-2 h-2 rounded-full bg-white/60" />
        <span className="w-2 h-2 rounded-full bg-white/60" />
      </div>
    </div>
  );
}


