"use client";

import { useEffect, useId, useRef, useState } from "react";
import { IconClose, IconSearch } from "@/components/icons";

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKey);
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = original;
      buttonRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="site-icon-btn"
        aria-label="Haberlerde ara"
        aria-expanded={open}
        aria-controls="site-search-dialog"
        onClick={() => setOpen(true)}
      >
        <IconSearch />
      </button>
      {open ? (
        <div
          className="site-search-overlay"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div
            ref={panelRef}
            id="site-search-dialog"
            className="site-search-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
          >
            <div className="site-search-close">
              <button type="button" className="site-icon-btn" style={{ color: "var(--color-ink)", borderColor: "var(--color-line)" }} aria-label="Kapat" onClick={() => setOpen(false)}>
                <IconClose />
              </button>
            </div>
            <h2 id={titleId} className="page-intro-kicker" style={{ marginBottom: "0.75rem" }}>
              Haberlerde ara
            </h2>
            <form className="site-search-form" action="/haberler" method="get">
              <label htmlFor="site-search-input">Arama terimi</label>
              <input
                ref={inputRef}
                id="site-search-input"
                className="site-search-input"
                type="search"
                name="s"
                placeholder="Anahtar kelime yazın…"
                autoComplete="off"
              />
              <button type="submit" className="site-btn site-btn-primary">
                Ara
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
