"use client";

import { useRef, type ReactNode } from "react";

export function TeamScroller({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  function scrollBy(amount: number) {
    ref.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <section id="yonetim-kurulu-section" className="ttp-team-section">
      <div className="ttp-team-container">
        <div className="ttp-team-header">
          <div className="ttp-team-header-text">
            <h2 className="ttp-team-title">Yönetim Kurulu</h2>
            <p className="ttp-team-subtitle">Terörsüz Türkiye Platformu Kurucu ve İcra Heyeti</p>
          </div>
          <div className="ttp-team-nav-controls">
            <button type="button" className="ttp-team-nav-btn" aria-label="Önceki" onClick={() => scrollBy(-280)}>
              ‹
            </button>
            <button type="button" className="ttp-team-nav-btn" aria-label="Sonraki" onClick={() => scrollBy(280)}>
              ›
            </button>
          </div>
        </div>
        <div
          className="ttp-team-grid"
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
      </div>
    </section>
  );
}
