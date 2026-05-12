import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const MAP_W = 204;
const MAP_H = 100;

function project(lat: number, lng: number) {
  return { x: ((lng + 180) / 360) * MAP_W, y: ((90 - lat) / 180) * MAP_H };
}

function arc(s: { x: number; y: number }, e: { x: number; y: number }) {
  const cx = (s.x + e.x) / 2;
  const cy = Math.min(s.y, e.y) - (Math.abs(e.x - s.x) * 0.22 + 5);
  return `M ${s.x} ${s.y} Q ${cx} ${cy} ${e.x} ${e.y}`;
}

const DOTS = [
  { lat: 38.9, lng: -77.0, label: "Washington D.C." },
  { lat: 38.5, lng: -121.5, label: "Sacramento" },
  { lat: 42.7, lng: -73.8, label: "Albany" },
  { lat: 30.3, lng: -97.7, label: "Austin" },
  { lat: 30.4, lng: -84.3, label: "Tallahassee" },
  { lat: 45.4, lng: -75.7, label: "Ottawa" },
  { lat: 51.5, lng: -0.1, label: "London" },
  { lat: 39.8, lng: -89.6, label: "Springfield" },
];

const CONNECTIONS = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [5, 6], [2, 6], [0, 7]];

export function WorldMapMatte() {
  const [svgMap, setSvgMap] = useState("");

  useEffect(() => {
    (async () => {
      const DottedMap = (await import("dotted-map")).default;
      const map = new DottedMap({ height: 100, grid: "diagonal" });
      setSvgMap(
        map.getSVG({
          radius: 0.22,
          color: "rgba(255,255,255,0.05)",
          shape: "circle",
          backgroundColor: "transparent",
        })
      );
    })();
  }, []);

  const pts = DOTS.map((d) => project(d.lat, d.lng));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0c1018",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2.5rem 2rem",
        fontFamily: "system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(30,50,90,0.18) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ textAlign: "center", marginBottom: "2rem", position: "relative", zIndex: 1 }}>
        <p
          style={{
            color: "rgba(148,163,184,0.45)",
            fontSize: "0.65rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            marginBottom: "0.75rem",
          }}
        >
          ADHD Policy Clearinghouse
        </p>
        <h1
          style={{
            fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)",
            fontWeight: 600,
            color: "rgba(248,250,252,0.82)",
            lineHeight: 1.25,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          Policy Activity Across the United States
        </h1>
        <p
          style={{
            color: "rgba(148,163,184,0.35)",
            fontSize: "0.82rem",
            marginTop: "0.75rem",
          }}
        >
          Tracking ADHD legislation across 47 states and 6 territories
        </p>
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "860px",
          aspectRatio: `${MAP_W} / ${MAP_H}`,
        }}
      >
        {svgMap && (
          <img
            src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMap)}`}
            alt=""
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
          />
        )}

        <svg
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
        >
          {CONNECTIONS.map(([a, b], i) => (
            <motion.path
              key={i}
              d={arc(pts[a], pts[b])}
              fill="none"
              stroke="rgba(99,179,237,0.28)"
              strokeWidth="0.35"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 2.0, delay: 0.5 + i * 0.18, ease: "easeOut" }}
            />
          ))}

          {pts.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="1.4" fill="rgba(99,179,237,0.06)" />
              <circle cx={p.x} cy={p.y} r="0.55" fill="rgba(226,232,240,0.55)" />
            </g>
          ))}
        </svg>
      </div>

      <div
        style={{
          display: "flex",
          gap: "3.5rem",
          marginTop: "2rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        {[
          ["47", "States Tracked"],
          ["312", "Active Bills"],
          ["89", "Policy Updates This Month"],
        ].map(([n, l]) => (
          <div key={l} style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: "1.75rem",
                fontWeight: 700,
                color: "rgba(248,250,252,0.7)",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              {n}
            </div>
            <div
              style={{
                fontSize: "0.67rem",
                color: "rgba(148,163,184,0.38)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginTop: "0.4rem",
              }}
            >
              {l}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
