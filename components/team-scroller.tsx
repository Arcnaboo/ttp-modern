"use client";

import { useRef, type ReactNode } from "react";
import { IconChevronLeft, IconChevronRight } from "@/components/icons";

export function TeamScroller({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  function scrollBy(amount: number) {
    ref.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <section id="yonetim-kurulu-section" className="home-section team-section">
      <div className="section-head">
        <div>
          <span className="section-kicker">Kurucu Heyet</span>
          <h2 className="section-title">Yönetim Kurulu</h2>
          <p className="section-lead">Terörsüz Türkiye Platformu Kurucu ve İcra Heyeti</p>
        </div>
        <div className="team-nav">
          <button type="button" className="site-icon-btn" style={{ color: "var(--color-ink)", borderColor: "var(--color-line)" }} aria-label="Önceki üyeler" onClick={() => scrollBy(-280)}>
            <IconChevronLeft />
          </button>
          <button type="button" className="site-icon-btn" style={{ color: "var(--color-ink)", borderColor: "var(--color-line)" }} aria-label="Sonraki üyeler" onClick={() => scrollBy(280)}>
            <IconChevronRight />
          </button>
        </div>
      </div>
      <div
        className="team-track"
        ref={ref}
        onPointerDown={(event) => {
          const current = ref.current;
          if (!current) return;
          const el: HTMLDivElement = current;
          el.classList.add("is-dragging");
          const startX = event.clientX;
          const startLeft = el.scrollLeft;
          function move(moveEvent: PointerEvent) {
            el.scrollLeft = startLeft - (moveEvent.clientX - startX);
          }
          function up() {
            el.classList.remove("is-dragging");
            window.removeEventListener("pointermove", move);
            window.removeEventListener("pointerup", up);
          }
          window.addEventListener("pointermove", move);
          window.addEventListener("pointerup", up);
        }}
      >
        {children}
      </div>
    </section>
  );
}
