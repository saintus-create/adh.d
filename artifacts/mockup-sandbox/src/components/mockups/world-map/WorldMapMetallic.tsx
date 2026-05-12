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

export function WorldMapMetallic() {
  const [svgMap, setSvgMap] = useState("");

  useEffect(() => {
    (async () => {
      const DottedMap = (await import("dotted-map")).default;
      const map = new DottedMap({ height: 100, grid: "diagonal" });
      setSvgMap(
        map.getSVG({
          radius: 0.22,
          color: "rgba(180,210,255,0.13)",
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
        background: "#03040a",
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
            "radial-gradient(ellipse 90% 70% at 50% 50%, rgba(30,60,140,0.22) 0%, rgba(10,20,60,0.1) 50%, transparent 80%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(0,0,0,0.8) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <p
          style={{
            color: "rgba(148,180,255,0.5)",
            fontSize: "0.65rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            marginBottom: "0.75rem",
          }}
        >
          ADHD Policy Clearinghouse
        </p>
        <h1
          style={{
            fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)",
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: "-0.025em",
            margin: 0,
            background: "linear-gradient(180deg, #ffffff 0%, #8eaaff 60%, #4a7aff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: "drop-shadow(0 0 20px rgba(100,140,255,0.4))",
          }}
        >
          Policy Activity Across the United States
        </h1>
        <p
          style={{
            color: "rgba(148,180,255,0.35)",
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
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            overflow: "visible",
          }}
        >
          <defs>
            <filter id="arc-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0.6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="dot-glow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {CONNECTIONS.map(([a, b], i) => (
            <g key={i} filter="url(#arc-glow)">
              <motion.path
                d={arc(pts[a], pts[b])}
                fill="none"
                stroke="rgba(180,210,255,0.18)"
                strokeWidth="0.6"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.8, delay: 0.3 + i * 0.15, ease: "easeOut" }}
              />
              <motion.path
                d={arc(pts[a], pts[b])}
                fill="none"
                stroke="rgba(255,255,255,0.75)"
                strokeWidth="0.25"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.8, delay: 0.3 + i * 0.15, ease: "easeOut" }}
              />
            </g>
          ))}

          {pts.map((p, i) => (
            <g key={i} filter="url(#dot-glow)">
              <motion.circle
                cx={p.x}
                cy={p.y}
                r="2.2"
                fill="rgba(100,160,255,0.08)"
                initial={{ scale: 0 }}
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2.5, delay: 1.5 + i * 0.1, repeat: Infinity, repeatDelay: 3 }}
              />
              <circle cx={p.x} cy={p.y} r="1.2" fill="rgba(100,160,255,0.15)" />
              <circle cx={p.x} cy={p.y} r="0.5" fill="rgba(255,255,255,0.9)" />
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
                letterSpacing: "-0.03em",
                lineHeight: 1,
                background: "linear-gradient(180deg, #ffffff 0%, #6090ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {n}
            </div>
            <div
              style={{
                fontSize: "0.67rem",
                color: "rgba(148,180,255,0.35)",
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
