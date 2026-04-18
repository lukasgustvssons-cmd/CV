"use client";

import { useEffect, useRef, useState } from "react";

type FadeInOnScrollProps = {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  fast?: boolean;
  slow?: boolean;
  once?: boolean;
};

export function FadeInOnScroll({
  children,
  delay = 0,
  className = "",
  fast = false,
  slow = false,
  once = true,
}: FadeInOnScrollProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          if (once) {
            observer.unobserve(node);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={[
        "scroll-fade-init",
        isVisible ? "scroll-fade-in" : "",
        fast ? "scroll-fade-fast" : "",
        slow ? "scroll-fade-slow" : "",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}