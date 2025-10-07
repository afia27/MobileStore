"use client";

// Minimal shadcn/ui-like carousel built on Embla
import * as React from "react";
import useEmblaCarousel, { type EmblaOptionsType, type EmblaPluginType } from "embla-carousel-react";

export function Carousel({
  opts,
  plugins,
  className,
  children,
}: {
  opts?: EmblaOptionsType;
  plugins?: EmblaPluginType[];
  className?: string;
  children: React.ReactNode;
}) {
  const [emblaRef] = useEmblaCarousel({ loop: true, ...opts }, plugins);
  return (
    <div className={className} ref={emblaRef}>
      <div className="flex -ml-4">
        {React.Children.map(children, (child) => (
          <div className="min-w-0 flex-[0_0_100%] pl-4">{child as any}</div>
        ))}
      </div>
    </div>
  );
}

export function CarouselItem({ children }: { children: React.ReactNode }) {
  return <div className="h-full w-full">{children}</div>;
}


