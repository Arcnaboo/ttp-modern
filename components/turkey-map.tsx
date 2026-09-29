"use client";

import { useEffect, useState } from "react";
import type { Coordinator, MemberNode, ProvinceData } from "@/lib/content";

const PLACEHOLDER = "/assets/images/placeholder-avatar.svg";

export function TurkeyMap({
  provinces,
  coordinators,
}: {
  provinces: Record<string, ProvinceData>;
  coordinators: Coordinator[];
}) {
  const [markup, setMarkup] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ name: string; x: number; y: number } | null>(null);
  const [certificate, setCertificate] = useState<{ src: string; title: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const response = await fetch("/assets/turkey-map.svg");
      const text = await response.text();
      if (!cancelled) setMarkup(text);
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const root = document.getElementById("turkey-map-root");
    if (!root || !markup) return;
    root.querySelectorAll("g[data-plaka-kodu]").forEach((node) => {
      const plate = (node.getAttribute("data-plaka-kodu") ?? "").padStart(2, "0");
      node.classList.toggle("is-completed", Boolean(provinces[plate]?.hasRepresentative));
      node.classList.toggle("is-selected", plate === selected);
    });
  }, [markup, provinces, selected]);

  function plateFrom(target: EventTarget | null) {
    const group = target instanceof Element ? target.closest("g[data-plaka-kodu]") : null;
    if (!group || group.id === "guney-kibris") return null;
    return (group.getAttribute("data-plaka-kodu") ?? "").padStart(2, "0");
  }

  const current = selected ? provinces[selected] : null;
  const represented = Object.values(provinces)
    .filter((province) => province.hasRepresentative)
    .sort((a, b) => a.name.localeCompare(b.name, "tr"));

  return (
    <section id="teskilat-haritasi" className="turkey-map-section">
      <div className="title-area">
        <h2 className="title">İl ve İlçe Başkanlıkları</h2>
      </div>
      <div
        id="turkey-map-root"
        className="turkey-map-drawing"
        dangerouslySetInnerHTML={{ __html: markup }}
        onClick={(event) => {
          const plate = plateFrom(event.target);
          if (plate) setSelected(plate);
        }}
        onMouseMove={(event) => {
          const plate = plateFrom(event.target);
          if (!plate) return;
          setTooltip({ name: provinces[plate]?.name ?? plate, x: event.pageX, y: event.pageY + 25 });
        }}
        onMouseLeave={() => setTooltip(null)}
      />
      {tooltip ? (
        <div className="turkey-map-name" style={{ position: "absolute", left: tooltip.x, top: tooltip.y, zIndex: 999999 }}>
          <div>{tooltip.name}</div>
        </div>
      ) : null}
      <div className="ttp-mobile-province-list">
        <div className="ttp-mobile-province-chips">
          {represented.map((province) => (
            <button key={province.plate} type="button" className="ttp-mobile-province-chip" onClick={() => setSelected(province.plate)}>
              {province.name}
            </button>
          ))}
        </div>
      </div>
      <div id="temsilciler-piramidi" className="turkey-map-list">
        {current?.hierarchy ? (
          <div className="ttp-panel">
            <div className="ttp-panel-head">
              <h3 className="ttp-panel-city">
                {current.name} <span>İl Temsilciliği</span>
              </h3>
            </div>
            <div className="ttp-pyramid-body">
              <div className="ttp-tier ttp-tier-apex">
                <div className="ttp-card ttp-card-apex">
                  <img className="ttp-photo" src={current.hierarchy.president.photo || PLACEHOLDER} alt={current.hierarchy.president.name} />
                  <div className="ttp-badge-role">İL BAŞKANI</div>
                  <div className="ttp-name-apex">{current.hierarchy.president.name}</div>
                  {current.hierarchy.president.certificate ? (
                    <button
                      type="button"
                      className="ttp-cert-btn"
                      onClick={() =>
                        setCertificate({
                          src: current.hierarchy!.president.certificate,
                          title: `${current.hierarchy!.president.name} - Yetki Belgesi`,
                        })
                      }
                    >
                      Yetki Belgesini Gör
                    </button>
                  ) : null}
                </div>
              </div>
              <MemberLevels nodes={current.hierarchy.children} onCertificate={setCertificate} />
            </div>
          </div>
        ) : current ? (
          <div className="ttp-empty-notice">
            <div>
              <h4>{current.name} Temsilciliği</h4>
              <p>Bu ilimizde teşkilatlanma ve il başkanlığı atama çalışmaları devam etmektedir.</p>
            </div>
            <a href="/iletisim" className="ttp-apply-btn">
              Temsilcilik Başvurusu
            </a>
          </div>
        ) : null}
      </div>
      {coordinators.length ? (
        <div className="ttp-region-section">
          <div className="ttp-region-container">
            <h2 className="ttp-region-title">Bölge Sorumlularımız</h2>
            <div className="ttp-region-grid">
              {coordinators.map((coordinator) => (
                <div className="ttp-region-capsule" key={coordinator.id}>
                  <div className="ttp-region-photo-wrap">
                    <img className="ttp-region-img" src={coordinator.photo ? `/${coordinator.photo.replace(/^\/+/, "")}` : PLACEHOLDER} alt={coordinator.name} />
                  </div>
                  <div className="ttp-region-info">
                    <h4 className="ttp-region-name">{coordinator.name}</h4>
                    <span className="ttp-region-role">{coordinator.title}</span>
                    {coordinator.certificate ? (
                      <button
                        type="button"
                        className="ttp-cert-btn-sm"
                        onClick={() =>
                          setCertificate({
                            src: `/${coordinator.certificate.replace(/^\/+/, "")}`,
                            title: `${coordinator.name} - Yetki Belgesi`,
                          })
                        }
                      >
                        Yetki Belgesi
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
      {certificate ? (
        <div className="ttp-lightbox is-open" onClick={() => setCertificate(null)}>
          <button type="button" className="ttp-lightbox-close" aria-label="Kapat">
            ×
          </button>
          <img className="ttp-lightbox-img" src={certificate.src} alt={certificate.title} />
        </div>
      ) : null}
    </section>
  );
}

function MemberLevels({
  nodes,
  onCertificate,
}: {
  nodes: MemberNode[];
  onCertificate: (value: { src: string; title: string }) => void;
}) {
  const levels: Array<typeof nodes> = [];
  let current = nodes;
  while (current.length) {
    levels.push(current);
    current = current.flatMap((node) => node.children);
  }
  return (
    <>
      {levels.map((level, depth) => (
        <div key={depth}>
          <div className="ttp-connector">
            <div className="ttp-connector-line" />
          </div>
          <div className={`ttp-tier ${depth === 0 ? "ttp-tier-vices" : "ttp-tier-board"}`}>
            <div className="ttp-tier-row">
              {level.map((node) => (
                <div className={`ttp-card ${depth === 0 ? "ttp-card-vice" : "ttp-card-board"}`} key={node.id}>
                  {node.photo ? <img className="ttp-photo ttp-photo-sm" src={node.photo} alt={node.name} /> : null}
                  {node.title ? <div className="ttp-badge-role">{node.title}</div> : null}
                  <div className="ttp-name">{node.name}</div>
                  {node.certificate ? (
                    <button type="button" className="ttp-cert-btn-sm" onClick={() => onCertificate({ src: node.certificate, title: `${node.name} - Yetki Belgesi` })}>
                      Yetki Belgesi
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
