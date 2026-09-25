"use client";

import { useState, type ComponentProps } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

// next/image that fades in once its file has arrived, over whatever
// background its container paints (the cream box), instead of popping in and
// shoving the layout around. Also handles images that finished loading before
// React attached the handler (server-rendered pages), which would otherwise
// stay invisible forever.
export function FadeImage({ className, onLoad, alt, ...props }: ComponentProps<typeof Image>) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      {...props}
      alt={alt}
      ref={(img) => {
        if (img && img.complete && img.naturalWidth > 0 && !loaded) setLoaded(true);
      }}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      className={cn(className, !loaded && "opacity-0")}
    />
  );
}
