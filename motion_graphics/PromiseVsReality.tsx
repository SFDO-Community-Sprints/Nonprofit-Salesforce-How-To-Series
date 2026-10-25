import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const BLUE_BG = "#0176D3";
const BLUE_DARK = "#014486";
const BLUE_LIGHT = "#1B96FF";
const YELLOW = "#FFD23F";
const ORANGE = "#F59E0B";
const RED = "#EA001E";
const GREEN = "#2E844A";
const FONT = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

const Cloud: React.FC<{ x: number; y: number; scale?: number }> = ({
  x,
  y,
  scale = 1,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `scale(${scale})`,
      transformOrigin: "top left",
      pointerEvents: "none",
    }}
  >
    {[
      [0, 50, 140],
      [80, 0, 180],
      [190, 30, 150],
      [120, 70, 160],
    ].map(([cx, cy, d], k) => (
      <div
        key={k}
        style={{
          position: "absolute",
          left: cx,
          top: cy,
          width: d,
          height: d,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
        }}
      />
    ))}
  </div>
);

// SVG Illustration: Waterbed
const WaterbedIllustration: React.FC<{ frame: number }> = ({ frame }) => {
  const waveOffset = Math.sin(frame / 6) * 4;
  return (
    <svg width="220" height="120" viewBox="0 0 220 120">
      {/* Bed Base (Wood) */}
      <rect x="20" y="75" width="180" height="28" rx="6" fill="#8B5A2B" />
      <rect x="30" y="103" width="16" height="14" rx="3" fill="#5C3A1E" />
      <rect x="174" y="103" width="16" height="14" rx="3" fill="#5C3A1E" />
      {/* Headboard */}
      <rect x="14" y="35" width="20" height="50" rx="4" fill="#6D431D" />
      {/* Water Mattress (Cyan/Blue) */}
      <rect x="34" y="50" width="162" height="30" rx="8" fill="#00A1E0" />
      {/* Wave pattern inside mattress */}
      <path
        d={`M 40 ${65 + waveOffset} Q 80 ${57 - waveOffset} 120 ${65 + waveOffset} T 190 ${65 + waveOffset}`}
        fill="none"
        stroke="#E0F7FA"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Pillow */}
      <rect x="40" y="44" width="34" height="12" rx="4" fill="#FFFFFF" />
      {/* Water droplets */}
      <circle cx="185" cy="46" r="4" fill="#00A1E0" opacity="0.8" />
      <circle cx="195" cy="38" r="3" fill="#4DD0E1" opacity="0.7" />
    </svg>
  );
};

// SVG Illustration: Segway
const SegwayIllustration: React.FC<{ frame: number }> = ({ frame }) => {
  const wobble = Math.sin(frame / 5) * 3;
  return (
    <svg width="200" height="120" viewBox="0 0 200 120">
      <g transform={`rotate(${wobble} 100 100)`}>
        {/* Handlebars */}
        <rect x="75" y="12" width="50" height="8" rx="4" fill="#4A4A4A" />
        <rect x="70" y="10" width="10" height="12" rx="3" fill="#E53935" />
        <rect x="120" y="10" width="10" height="12" rx="3" fill="#E53935" />
        {/* Steering Shaft */}
        <rect x="97" y="20" width="6" height="70" rx="3" fill="#9E9E9E" />
        {/* Base Platform */}
        <rect x="65" y="86" width="70" height="12" rx="5" fill="#424242" />
        {/* Wheels */}
        <circle cx="65" cy="94" r="16" fill="#212121" stroke="#BDBDBD" strokeWidth="3" />
        <circle cx="65" cy="94" r="5" fill="#757575" />
        <circle cx="135" cy="94" r="16" fill="#212121" stroke="#BDBDBD" strokeWidth="3" />
        <circle cx="135" cy="94" r="5" fill="#757575" />
        {/* Mall Security Beacon */}
        <circle cx="100" cy="6" r="5" fill={frame % 12 < 6 ? "#FFEB3B" : "#F57C00"} />
      </g>
    </svg>
  );
};

// SVG Illustration: Gourmet Microwave
const MicrowaveIllustration: React.FC<{ frame: number }> = ({ frame }) => {
  const flash = frame % 20 < 10;
  return (
    <svg width="220" height="120" viewBox="0 0 220 120">
      {/* Microwave Body */}
      <rect x="20" y="12" width="180" height="96" rx="10" fill="#ECEFF1" stroke="#90A4AE" strokeWidth="3" />
      {/* Door Window */}
      <rect x="32" y="22" width="115" height="74" rx="6" fill="#263238" />
      {/* Meal Tray Inside */}
      <rect x="52" y="66" width="75" height="16" rx="4" fill="#D7CCC8" />
      {/* Steam curves */}
      <path
        d="M 68 58 Q 72 48 68 40"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        d="M 98 58 Q 102 48 98 40"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.75"
      />
      {/* Control Panel */}
      <rect x="156" y="22" width="36" height="74" rx="4" fill="#CFD8DC" />
      {/* Digital LED Display */}
      <rect x="160" y="26" width="28" height="16" rx="2" fill="#000000" />
      <text
        x="174"
        y="38"
        fill={flash ? "#76FF03" : "#33691E"}
        fontSize="11"
        fontFamily="monospace"
        fontWeight="bold"
        textAnchor="middle"
      >
        0:03
      </text>
      {/* Buttons */}
      <circle cx="174" cy="52" r="4" fill="#78909C" />
      <circle cx="174" cy="64" r="4" fill="#78909C" />
      <rect x="164" y="74" width="20" height="14" rx="3" fill="#43A047" />
    </svg>
  );
};

export const PromiseVsReality: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase animations
  const setupCardIn = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const waterbedIn = spring({
    frame: frame - 105,
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  const segwayIn = spring({
    frame: frame - 145,
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  const microwaveIn = spring({
    frame: frame - 185,
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  // Stamp impact at frame 232
  const stampProgress = spring({
    frame: frame - 232,
    fps,
    config: { damping: 10, stiffness: 180, mass: 1.2 },
  });

  const shake =
    frame >= 232 && frame <= 244
      ? Math.sin((frame - 232) * 2.5) * (244 - frame) * 1.5
      : 0;

  // Smooth transitions between Phase 1 and Phase 2
  const transitionProgress = interpolate(frame, [72, 92], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Setup card starts big and centered in Phase 1, then smoothly docks at top in Phase 2
  const setupY = interpolate(transitionProgress, [0, 1], [320, 120]);
  const setupScale = interpolate(transitionProgress, [0, 1], [1.15, 0.88]);

  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT,
        background: `linear-gradient(150deg, ${BLUE_LIGHT} 0%, ${BLUE_BG} 50%, ${BLUE_DARK} 100%)`,
        overflow: "hidden",
        transform: `translateY(${shake}px)`,
      }}
    >
      {/* Audio Voiceover Track (synchronized with segment 1) */}
      <Audio src={staticFile("seg_1.mp3")} />

      {/* Decorative Clouds */}
      <Cloud x={-40} y={-30} scale={0.9} />
      <Cloud x={1520} y={-40} scale={0.8} />
      <Cloud x={-60} y={920} scale={1.0} />
      <Cloud x={1480} y={900} scale={0.9} />

      {/* Header Area */}
      <div
        style={{
          position: "absolute",
          top: 24,
          width: "100%",
          textAlign: "center",
          color: "white",
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: YELLOW,
            marginBottom: 4,
          }}
        >
          {transitionProgress < 0.5
            ? "SALESFORCE STANDARD SETUP"
            : "HIGH HOPES VS. HARSH REALITY"}
        </div>
        <div
          style={{
            fontSize: 46,
            fontWeight: 800,
            letterSpacing: -0.5,
          }}
        >
          {transitionProgress < 0.5 ? (
            <span>The Standard Roll-Up Summary Field</span>
          ) : (
            <span>Sounds Revolutionary on Paper, But...</span>
          )}
        </div>
      </div>

      {/* Salesforce Official Field Setup Card */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: setupY,
          width: 840,
          transform: `translateX(-50%) scale(${setupCardIn * setupScale})`,
          opacity: Math.min(1, setupCardIn),
          background: "white",
          borderRadius: 18,
          boxShadow: "0 18px 45px rgba(0,0,0,0.25)",
          overflow: "hidden",
          border: "2px solid rgba(255,255,255,0.4)",
          zIndex: 10,
        }}
      >
        <div
          style={{
            background: "#F3F2F2",
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "2px solid #E5E5E5",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 8,
                background: BLUE_BG,
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              ☁️
            </div>
            <div>
              <div style={{ fontSize: 13, color: "#706E6B", fontWeight: 700 }}>
                FIELD CREATION WIZARD
              </div>
              <div style={{ fontSize: 22, color: "#181818", fontWeight: 800 }}>
                Roll-Up Summary (COUNT, SUM, MIN, MAX)
              </div>
            </div>
          </div>
          <div
            style={{
              background: "#CDEFD6",
              color: "#014D2A",
              fontSize: 14,
              fontWeight: 700,
              padding: "4px 12px",
              borderRadius: 999,
            }}
          >
            Standard Feature
          </div>
        </div>

        <div
          style={{
            padding: "14px 24px",
            display: "flex",
            justifyContent: "space-around",
            background: "white",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 16, color: "#181818", fontWeight: 600 }}>
            <span style={{ color: GREEN, fontSize: 20 }}>✓</span> Clicks, Not Code
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 16, color: "#181818", fontWeight: 600 }}>
            <span style={{ color: GREEN, fontSize: 20 }}>✓</span> Automated Calculation
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 16, color: "#181818", fontWeight: 600 }}>
            <span style={{ color: GREEN, fontSize: 20 }}>✓</span> Zero Apex Required
          </div>
        </div>
      </div>

      {/* The 3 Analogy Cards Container */}
      <div
        style={{
          position: "absolute",
          top: 250,
          left: 100,
          right: 100,
          display: "flex",
          gap: 28,
          justifyContent: "center",
          opacity: transitionProgress,
          transform: `translateY(${(1 - transitionProgress) * 40}px)`,
        }}
      >
        {/* CARD 1: WATERBEDS */}
        <div
          style={{
            flex: 1,
            maxWidth: 520,
            background: "white",
            borderRadius: 22,
            padding: "20px 24px",
            boxShadow: "0 16px 40px rgba(0,0,0,0.22)",
            transform: `translateY(${(1 - waterbedIn) * 60}px) scale(${waterbedIn})`,
            opacity: Math.min(1, waterbedIn),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderTop: "8px solid #00A1E0",
          }}
        >
          <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <WaterbedIllustration frame={frame} />
          </div>
          <div style={{ fontSize: 30, fontWeight: 800, color: "#181818", marginTop: 4 }}>
            Waterbeds
          </div>
          <div
            style={{
              background: "#E1F5FE",
              color: "#0277BD",
              fontSize: 15,
              fontWeight: 700,
              padding: "4px 12px",
              borderRadius: 8,
              marginTop: 4,
            }}
          >
            The 1980s Revolution
          </div>
          <div style={{ marginTop: 14, width: "100%", fontSize: 15, color: "#444", lineHeight: 1.4 }}>
            <div style={{ color: GREEN, fontWeight: 700, marginBottom: 2 }}>
              ★ The Promise:
            </div>
            <div>Floating weightlessly in absolute liquid luxury.</div>
            <div style={{ color: RED, fontWeight: 700, marginTop: 8, marginBottom: 2 }}>
              ✕ The Reality:
            </div>
            <div>Seasickness, catastrophic leaks & frozen water.</div>
          </div>
        </div>

        {/* CARD 2: SEGWAYS */}
        <div
          style={{
            flex: 1,
            maxWidth: 520,
            background: frame >= 145 ? "white" : "rgba(255,255,255,0.15)",
            border: frame >= 145 ? "none" : "2px dashed rgba(255,255,255,0.4)",
            borderRadius: 22,
            padding: "20px 24px",
            boxShadow: frame >= 145 ? "0 16px 40px rgba(0,0,0,0.22)" : "none",
            transform: `translateY(${(1 - segwayIn) * 60}px) scale(${Math.max(0.9, segwayIn)})`,
            opacity: frame >= 145 ? Math.min(1, segwayIn) : 0.6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderTop: frame >= 145 ? `8px solid ${ORANGE}` : undefined,
          }}
        >
          {frame >= 145 ? (
            <>
              <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <SegwayIllustration frame={frame} />
              </div>
              <div style={{ fontSize: 30, fontWeight: 800, color: "#181818", marginTop: 4 }}>
                Segways
              </div>
              <div
                style={{
                  background: "#FFF3E0",
                  color: "#E65100",
                  fontSize: 15,
                  fontWeight: 700,
                  padding: "4px 12px",
                  borderRadius: 8,
                  marginTop: 4,
                }}
              >
                The 2000s Vision
              </div>
              <div style={{ marginTop: 14, width: "100%", fontSize: 15, color: "#444", lineHeight: 1.4 }}>
                <div style={{ color: GREEN, fontWeight: 700, marginBottom: 2 }}>
                  ★ The Promise:
                </div>
                <div>Transforming urban cities and replacing walking forever.</div>
                <div style={{ color: RED, fontWeight: 700, marginTop: 8, marginBottom: 2 }}>
                  ✕ The Reality:
                </div>
                <div>Banned on sidewalks. Exclusively used by mall security.</div>
              </div>
            </>
          ) : (
            <div style={{ height: 360, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 24, fontWeight: 700 }}>
              Up Next...
            </div>
          )}
        </div>

        {/* CARD 3: GOURMET MICROWAVE */}
        <div
          style={{
            flex: 1,
            maxWidth: 520,
            background: frame >= 185 ? "white" : "rgba(255,255,255,0.15)",
            border: frame >= 185 ? "none" : "2px dashed rgba(255,255,255,0.4)",
            borderRadius: 22,
            padding: "20px 24px",
            boxShadow: frame >= 185 ? "0 16px 40px rgba(0,0,0,0.22)" : "none",
            transform: `translateY(${(1 - microwaveIn) * 60}px) scale(${Math.max(0.9, microwaveIn)})`,
            opacity: frame >= 185 ? Math.min(1, microwaveIn) : 0.6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderTop: frame >= 185 ? `8px solid ${RED}` : undefined,
          }}
        >
          {frame >= 185 ? (
            <>
              <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MicrowaveIllustration frame={frame} />
              </div>
              <div style={{ fontSize: 30, fontWeight: 800, color: "#181818", marginTop: 4 }}>
                Microwave Cuisine
              </div>
              <div
                style={{
                  background: "#FFEBEE",
                  color: "#C62828",
                  fontSize: 15,
                  fontWeight: 700,
                  padding: "4px 12px",
                  borderRadius: 8,
                  marginTop: 4,
                }}
              >
                The 3-Minute Miracle
              </div>
              <div style={{ marginTop: 14, width: "100%", fontSize: 15, color: "#444", lineHeight: 1.4 }}>
                <div style={{ color: GREEN, fontWeight: 700, marginBottom: 2 }}>
                  ★ The Promise:
                </div>
                <div>Five-star restaurant caliber dining in 180 seconds.</div>
                <div style={{ color: RED, fontWeight: 700, marginTop: 8, marginBottom: 2 }}>
                  ✕ The Reality:
                </div>
                <div>Boiling lava on the edge, solid block of ice in the center.</div>
              </div>
            </>
          ) : (
            <div style={{ height: 360, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 24, fontWeight: 700 }}>
              Up Next...
            </div>
          )}
        </div>
      </div>

      {/* PHASE 4: The Giant Red Stamp Punchline (Frames 232+) */}
      {frame >= 232 && (
        <div
          style={{
            position: "absolute",
            top: 240,
            left: "50%",
            transform: `translateX(-50%) rotate(-7deg) scale(${
              0.8 + 0.2 * stampProgress
            })`,
            opacity: Math.min(1, stampProgress * 1.5),
            border: `10px solid ${RED}`,
            borderRadius: 22,
            padding: "16px 44px",
            background: "rgba(255, 255, 255, 0.96)",
            boxShadow: "0 20px 80px rgba(234, 0, 30, 0.55)",
            textAlign: "center",
            zIndex: 100,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              color: RED,
              fontSize: 66,
              fontWeight: 900,
              letterSpacing: 4,
              textTransform: "uppercase",
              lineHeight: 1,
            }}
          >
            MASTER-DETAIL ONLY!
          </div>
          <div
            style={{
              color: "#333",
              fontSize: 24,
              fontWeight: 700,
              marginTop: 8,
              letterSpacing: 0.5,
            }}
          >
            🚫 Does NOT work on standard Lookup relationships
          </div>
        </div>
      )}

      {/* Bottom Subtitle Bar */}
      <div
        style={{
          position: "absolute",
          bottom: 28,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "white",
            fontSize: 25,
            fontWeight: 600,
            padding: "10px 30px",
            borderRadius: 999,
            textAlign: "center",
          }}
        >
          {frame < 75 && "Salesforce has a roll-up summary field type..."}
          {frame >= 75 &&
            frame < 105 &&
            "...but it feels more like the promise of..."}
          {frame >= 105 && frame < 145 && "• Waterbeds •"}
          {frame >= 145 && frame < 185 && "• Segways •"}
          {frame >= 185 && frame < 232 && "• And Gourmet Microwave Cuisine •"}
          {frame >= 232 && "⚠️ That's where DLRS comes in!"}
        </div>
      </div>
    </AbsoluteFill>
  );
};
