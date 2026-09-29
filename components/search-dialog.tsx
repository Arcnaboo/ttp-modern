"use client";

import { useState } from "react";

export function SearchDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" className="ekit_navsearch-button ttp-search-open" aria-label="Ara" aria-expanded={open} onClick={() => setOpen(true)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </button>
      <div className="ttp-search-overlay" role="dialog" aria-modal="true" aria-label="Sitede ara" hidden={!open}>
        <button type="button" className="ttp-search-close" aria-label="Kapat" onClick={() => setOpen(false)}>
          ×
        </button>
        <form className="ttp-search-form" action="/haberler" method="get">
          <input className="ttp-search-input" type="search" name="s" placeholder="Haberlerde ara…" aria-label="Arama terimi" />
          <button type="submit" className="ttp-search-submit">
            Ara
          </button>
        </form>
      </div>
    </>
  );
}
