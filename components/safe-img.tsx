"use client";

import { useEffect, useState } from "react";

const PLACEHOLDER = "/assets/images/placeholder-avatar.svg";

export function SafeImg({
  src,
  alt,
  width,
  height,
  className,
  fallback = PLACEHOLDER,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallback?: string;
}) {
  const [current, setCurrent] = useState(src || fallback);

  useEffect(() => {
    setCurrent(src || fallback);
  }, [src, fallback]);

  return (
    <img
      className={className}
      src={current || fallback}
      alt={alt}
      width={width}
      height={height}
      onError={() => {
        if (current !== fallback) setCurrent(fallback);
      }}
    />
  );
}
