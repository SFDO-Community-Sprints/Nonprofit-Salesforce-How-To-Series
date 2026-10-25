import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const FONT_FAMILY =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export const CommunityTrustedShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // -------------------------------------------------------------
  // ANIMATION TIMELINE (Total: 564 frames / 18.792s @ 30fps)
  // -------------------------------------------------------------
  // 0 - 60 (0.0s - 2.0s): Header & 3 Pillar wireframe/ghost setup
  // 60 - 180 (2.0s - 6.0s): Word 1: TRUSTED (Surges vibrant cyan, 27,000+ roll-up)
  // 180 - 225 (6.0s - 7.5s): Word 2: MAINTAINED (Surges vibrant emerald, pulsing beacon)
  // 225 - 265 (7.5s - 8.8s): Word 3: COMMUNITY DESIGNED (Surges warm gold, network nodes)
  // 265 - 390 (8.8s - 13.0s): Extends Declarative Capabilities (Beam connection + pill banner)
  // 390 - 430 (13.0s - 14.3s): "Hit a wall with standard rollups" (Limit barrier bypass)
  // 430 - 564 (14.3s - 18.8s): "DLRS is your answer" (Hero Badge & Final Verdict)

  // Header Animation
  const headerOpacity = interpolate(
    frame,
    [0, 25, 425, 445],
    [0, 1, 1, 0.2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Pillar 1: TRUSTED
  // Starts as subtle ghost at frame 20, activates at frame 60
  const p1Intro = spring({
    frame: frame - 15,
    fps,
    config: { damping: 15, stiffness: 90 },
  });
  const p1Active = spring({
    frame: frame - 60,
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  const p1WordGlow = interpolate(
    frame,
    [65, 85, 120, 160],
    [0, 1, 1, 0.4],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const countProgress = interpolate(frame, [65, 140], [0, 27000], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const formattedCount = Math.floor(countProgress).toLocaleString();

  // Pillar 2: MAINTAINED
  // Starts as subtle ghost at frame 25, activates at frame 180
  const p2Intro = spring({
    frame: frame - 22,
    fps,
    config: { damping: 15, stiffness: 90 },
  });
  const p2Active = spring({
    frame: frame - 180,
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  const p2WordGlow = interpolate(
    frame,
    [185, 205, 230, 255],
    [0, 1, 1, 0.4],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const pulseScale = 1 + 0.25 * Math.sin(frame / 4);

  // Pillar 3: COMMUNITY DESIGNED
  // Starts as subtle ghost at frame 30, activates at frame 225
  const p3Intro = spring({
    frame: frame - 29,
    fps,
    config: { damping: 15, stiffness: 90 },
  });
  const p3Active = spring({
    frame: frame - 225,
    fps,
    config: { damping: 12, stiffness: 100 },
  });
  const p3WordGlow = interpolate(
    frame,
    [230, 250, 280, 310],
    [0, 1, 1, 0.4],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Connecting Bracket / Declarative Capabilities (Frame 265 - 390)
  const beamProgress = interpolate(frame, [265, 305], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const capabilitiesBannerOpacity = interpolate(
    frame,
    [280, 305, 415, 430],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // "Hit a Wall" Transition (Frame 390 - 430)
  const wallCardOpacity = interpolate(
    frame,
    [390, 402, 422, 432],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Pillars Shift / Complete Fade during Resolution (Frame 420 - 445)
  const pillarsFade = interpolate(frame, [420, 442], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const beamFade = interpolate(frame, [415, 432], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "DLRS is your answer" Hero Finale (Frame 430+)
  const heroSpring = spring({
    frame: frame - 430,
    fps,
    config: { damping: 14, stiffness: 95 },
  });
  const heroBadgeGlow = interpolate(
    frame,
    [440, 480, 564],
    [0.7, 1, 0.85],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#070D1A",
        backgroundImage:
          "radial-gradient(ellipse 90% 65% at 50% 35%, #0D1C38 0%, #060B16 100%)",
        fontFamily: FONT_FAMILY,
        color: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      {/* Audio Voiceover Sync */}
      <Audio src={staticFile("seg_8.mp3")} />

      {/* Subtle Background Blueprint Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.8,
        }}
      />

      {/* Ambient Lighting Orbs */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "20%",
          width: 550,
          height: 550,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0, 229, 255, 0.08) 0%, transparent 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "15%",
          right: "20%",
          width: 550,
          height: 550,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.07) 0%, transparent 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      {/* ------------------------------------------------------------- */}
      {/* TOP HEADER: Clean & Minimalist */}
      {/* ------------------------------------------------------------- */}
      <div
        style={{
          position: "absolute",
          top: 48,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: headerOpacity,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "7px 22px",
            borderRadius: 30,
            backgroundColor: "rgba(1, 118, 211, 0.15)",
            border: "1px solid rgba(0, 229, 255, 0.35)",
            boxShadow: "0 0 20px rgba(0, 229, 255, 0.15)",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#00E5FF",
              boxShadow: "0 0 10px #00E5FF",
            }}
          />
          <span
            style={{
              fontSize: 14,
              letterSpacing: 3,
              fontWeight: 700,
              color: "#38BDF8",
              textTransform: "uppercase",
            }}
          >
            Declarative Lookup Rollup Summary (DLRS)
          </span>
        </div>

        <h1
          style={{
            margin: "12px 0 0 0",
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: -0.5,
            color: "#F8FAFC",
          }}
        >
          The 3 Pillars of Declarative Excellence
        </h1>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* THE 3 PILLARS CONTAINER */}
      {/* ------------------------------------------------------------- */}
      {pillarsFade > 0 && (
        <div
          style={{
            position: "absolute",
            top: 175,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            gap: 36,
            padding: "0 80px",
            opacity: pillarsFade,
            pointerEvents: "none",
          }}
        >
          {/* ========================================================= */}
          {/* PILLAR 1: TRUSTED */}
          {/* ========================================================= */}
          <div
            style={{
              width: 520,
              height: 480,
              backgroundColor:
                p1Active > 0.5 ? "rgba(13, 27, 54, 0.9)" : "rgba(11, 20, 38, 0.45)",
              backdropFilter: "blur(12px)",
              borderRadius: 24,
              border: `1.5px solid ${
                p1WordGlow > 0.5
                  ? "rgba(0, 229, 255, 0.85)"
                  : p1Active > 0.1
                  ? "rgba(0, 229, 255, 0.3)"
                  : "rgba(255, 255, 255, 0.08)"
              }`,
              boxShadow:
                p1WordGlow > 0.5
                  ? "0 20px 50px rgba(0, 229, 255, 0.22), inset 0 0 30px rgba(0, 229, 255, 0.08)"
                  : p1Active > 0.1
                  ? "0 15px 35px rgba(0, 0, 0, 0.4)"
                  : "none",
              padding: "44px 36px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              opacity: p1Intro * (0.25 + 0.75 * p1Active),
              transform: `translateY(${(1 - p1Intro) * 30 + (1 - p1Active) * 15}px) scale(${
                0.97 + 0.03 * p1Active + p1WordGlow * 0.02
              })`,
              transition: "border 0.3s ease, background-color 0.3s ease",
            }}
          >
            {/* Shield Check Icon */}
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                backgroundColor:
                  p1Active > 0.1 ? "rgba(0, 229, 255, 0.12)" : "rgba(255, 255, 255, 0.05)",
                border: `1.5px solid ${p1Active > 0.1 ? "#00E5FF" : "rgba(255, 255, 255, 0.2)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
                boxShadow: p1Active > 0.1 ? "0 0 25px rgba(0, 229, 255, 0.35)" : "none",
              }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L4 5V11C4 16.52 7.42 21.62 12 22C16.58 21.62 20 16.52 20 11V5L12 2Z"
                  fill={p1Active > 0.1 ? "rgba(0, 229, 255, 0.2)" : "none"}
                  stroke={p1Active > 0.1 ? "#00E5FF" : "#64748B"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 12L11 14L15 10"
                  stroke={p1Active > 0.1 ? "#FFFFFF" : "#64748B"}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Word: TRUSTED */}
            <div
              style={{
                fontSize: 30,
                fontWeight: 800,
                letterSpacing: 4,
                color: p1Active > 0.1 ? "#00E5FF" : "#64748B",
                textTransform: "uppercase",
                marginBottom: 8,
                textShadow:
                  p1WordGlow > 0.5
                    ? "0 0 25px rgba(0, 229, 255, 0.9), 0 0 10px rgba(0, 229, 255, 0.5)"
                    : "none",
              }}
            >
              TRUSTED
            </div>

            <div
              style={{
                fontSize: 13,
                letterSpacing: 1.5,
                color: p1Active > 0.1 ? "#94A3B8" : "#475569",
                textTransform: "uppercase",
                fontWeight: 600,
                marginBottom: 24,
              }}
            >
              Enterprise Production Grade
            </div>

            {/* Metric */}
            <div
              style={{
                fontSize: 64,
                fontWeight: 900,
                letterSpacing: -1,
                color: p1Active > 0.1 ? "#F8FAFC" : "#64748B",
                lineHeight: 1,
                marginBottom: 8,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {formattedCount}
              <span style={{ color: p1Active > 0.1 ? "#00E5FF" : "#64748B", marginLeft: 4 }}>
                +
              </span>
            </div>

            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: p1Active > 0.1 ? "#38BDF8" : "#64748B",
                marginBottom: 20,
              }}
            >
              Active Salesforce Orgs
            </div>

            <p
              style={{
                fontSize: 15,
                lineHeight: 1.5,
                color: p1Active > 0.1 ? "#CBD5E1" : "#475569",
                margin: 0,
              }}
            >
              De-facto standard across nonprofits, higher education, and Fortune 500 enterprises.
            </p>
          </div>

          {/* ========================================================= */}
          {/* PILLAR 2: MAINTAINED */}
          {/* ========================================================= */}
          <div
            style={{
              width: 520,
              height: 480,
              backgroundColor:
                p2Active > 0.5 ? "rgba(13, 27, 54, 0.9)" : "rgba(11, 20, 38, 0.45)",
              backdropFilter: "blur(12px)",
              borderRadius: 24,
              border: `1.5px solid ${
                p2WordGlow > 0.5
                  ? "rgba(16, 185, 129, 0.85)"
                  : p2Active > 0.1
                  ? "rgba(16, 185, 129, 0.3)"
                  : "rgba(255, 255, 255, 0.08)"
              }`,
              boxShadow:
                p2WordGlow > 0.5
                  ? "0 20px 50px rgba(16, 185, 129, 0.22), inset 0 0 30px rgba(16, 185, 129, 0.08)"
                  : p2Active > 0.1
                  ? "0 15px 35px rgba(0, 0, 0, 0.4)"
                  : "none",
              padding: "44px 36px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              opacity: p2Intro * (0.25 + 0.75 * p2Active),
              transform: `translateY(${(1 - p2Intro) * 30 + (1 - p2Active) * 15}px) scale(${
                0.97 + 0.03 * p2Active + p2WordGlow * 0.02
              })`,
              transition: "border 0.3s ease, background-color 0.3s ease",
            }}
          >
            {/* Cycle SVG Icon */}
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                backgroundColor:
                  p2Active > 0.1 ? "rgba(16, 185, 129, 0.12)" : "rgba(255, 255, 255, 0.05)",
                border: `1.5px solid ${p2Active > 0.1 ? "#10B981" : "rgba(255, 255, 255, 0.2)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
                boxShadow: p2Active > 0.1 ? "0 0 25px rgba(16, 185, 129, 0.35)" : "none",
              }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21.5 2V6M21.5 6H17.5M21.5 6L18 2.5C16.4 0.9 14.3 0 12 0C5.4 0 0 5.4 0 12C0 18.6 5.4 24 12 24C17.5 24 22.1 20.3 23.5 15.2"
                  stroke={p2Active > 0.1 ? "#10B981" : "#64748B"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="3" fill={p2Active > 0.1 ? "#10B981" : "#64748B"} />
              </svg>
            </div>

            {/* Word: MAINTAINED */}
            <div
              style={{
                fontSize: 30,
                fontWeight: 800,
                letterSpacing: 4,
                color: p2Active > 0.1 ? "#34D399" : "#64748B",
                textTransform: "uppercase",
                marginBottom: 8,
                textShadow:
                  p2WordGlow > 0.5
                    ? "0 0 25px rgba(52, 211, 153, 0.9), 0 0 10px rgba(52, 211, 153, 0.5)"
                    : "none",
              }}
            >
              MAINTAINED
            </div>

            <div
              style={{
                fontSize: 13,
                letterSpacing: 1.5,
                color: p2Active > 0.1 ? "#94A3B8" : "#475569",
                textTransform: "uppercase",
                fontWeight: 600,
                marginBottom: 24,
              }}
            >
              Continuous Active Lifecycle
            </div>

            {/* Live Status Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 26px",
                borderRadius: 30,
                backgroundColor:
                  p2Active > 0.1 ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.05)",
                border: `1.5px solid ${
                  p2Active > 0.1 ? "rgba(16, 185, 129, 0.4)" : "rgba(255, 255, 255, 0.1)"
                }`,
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  backgroundColor: p2Active > 0.1 ? "#10B981" : "#64748B",
                  boxShadow: p2Active > 0.1 ? "0 0 15px #10B981" : "none",
                  transform: p2Active > 0.1 ? `scale(${pulseScale})` : "none",
                }}
              />
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: p2Active > 0.1 ? "#F8FAFC" : "#64748B",
                  letterSpacing: 0.5,
                }}
              >
                Regular Releases
              </span>
            </div>

            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: p2Active > 0.1 ? "#34D399" : "#64748B",
                marginBottom: 16,
              }}
            >
              Salesforce Release Ready
            </div>

            <p
              style={{
                fontSize: 15,
                lineHeight: 1.5,
                color: p2Active > 0.1 ? "#CBD5E1" : "#475569",
                margin: 0,
              }}
            >
              Continually updated for seasonal Salesforce releases, critical security updates, and API parity.
            </p>
          </div>

          {/* ========================================================= */}
          {/* PILLAR 3: COMMUNITY DESIGNED */}
          {/* ========================================================= */}
          <div
            style={{
              width: 520,
              height: 480,
              backgroundColor:
                p3Active > 0.5 ? "rgba(13, 27, 54, 0.9)" : "rgba(11, 20, 38, 0.45)",
              backdropFilter: "blur(12px)",
              borderRadius: 24,
              border: `1.5px solid ${
                p3WordGlow > 0.5
                  ? "rgba(245, 158, 11, 0.85)"
                  : p3Active > 0.1
                  ? "rgba(245, 158, 11, 0.3)"
                  : "rgba(255, 255, 255, 0.08)"
              }`,
              boxShadow:
                p3WordGlow > 0.5
                  ? "0 20px 50px rgba(245, 158, 11, 0.22), inset 0 0 30px rgba(245, 158, 11, 0.08)"
                  : p3Active > 0.1
                  ? "0 15px 35px rgba(0, 0, 0, 0.4)"
                  : "none",
              padding: "44px 36px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              opacity: p3Intro * (0.25 + 0.75 * p3Active),
              transform: `translateY(${(1 - p3Intro) * 30 + (1 - p3Active) * 15}px) scale(${
                0.97 + 0.03 * p3Active + p3WordGlow * 0.02
              })`,
              transition: "border 0.3s ease, background-color 0.3s ease",
            }}
          >
            {/* Collaborative Nodes Icon */}
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                backgroundColor:
                  p3Active > 0.1 ? "rgba(245, 158, 11, 0.12)" : "rgba(255, 255, 255, 0.05)",
                border: `1.5px solid ${p3Active > 0.1 ? "#F59E0B" : "rgba(255, 255, 255, 0.2)"}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
                boxShadow: p3Active > 0.1 ? "0 0 25px rgba(245, 158, 11, 0.35)" : "none",
              }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="5"
                  r="3"
                  stroke={p3Active > 0.1 ? "#F59E0B" : "#64748B"}
                  strokeWidth="2"
                  fill={p3Active > 0.1 ? "rgba(245,158,11,0.2)" : "none"}
                />
                <circle
                  cx="5"
                  cy="18"
                  r="3"
                  stroke={p3Active > 0.1 ? "#F59E0B" : "#64748B"}
                  strokeWidth="2"
                  fill={p3Active > 0.1 ? "rgba(245,158,11,0.2)" : "none"}
                />
                <circle
                  cx="19"
                  cy="18"
                  r="3"
                  stroke={p3Active > 0.1 ? "#F59E0B" : "#64748B"}
                  strokeWidth="2"
                  fill={p3Active > 0.1 ? "rgba(245,158,11,0.2)" : "none"}
                />
                <path
                  d="M10 7L7 16M14 7L17 16M8 18H16"
                  stroke={p3Active > 0.1 ? "#F59E0B" : "#64748B"}
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Word: COMMUNITY DESIGNED */}
            <div
              style={{
                fontSize: 27,
                fontWeight: 800,
                letterSpacing: 2.5,
                color: p3Active > 0.1 ? "#FBBF24" : "#64748B",
                textTransform: "uppercase",
                marginBottom: 8,
                textShadow:
                  p3WordGlow > 0.5
                    ? "0 0 25px rgba(251, 191, 36, 0.9), 0 0 10px rgba(251, 191, 36, 0.5)"
                    : "none",
              }}
            >
              COMMUNITY DESIGNED
            </div>

            <div
              style={{
                fontSize: 13,
                letterSpacing: 1.5,
                color: p3Active > 0.1 ? "#94A3B8" : "#475569",
                textTransform: "uppercase",
                fontWeight: 600,
                marginBottom: 24,
              }}
            >
              Open Source • Salesforce Commons
            </div>

            {/* Badge: Salesforce Commons */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "14px 24px",
                borderRadius: 30,
                backgroundColor:
                  p3Active > 0.1 ? "rgba(245, 158, 11, 0.15)" : "rgba(255, 255, 255, 0.05)",
                border: `1.5px solid ${
                  p3Active > 0.1 ? "rgba(245, 158, 11, 0.4)" : "rgba(255, 255, 255, 0.1)"
                }`,
                marginBottom: 18,
              }}
            >
              <span style={{ fontSize: 20 }}>🤝</span>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: p3Active > 0.1 ? "#F8FAFC" : "#64748B",
                  letterSpacing: 0.5,
                }}
              >
                Salesforce Commons
              </span>
            </div>

            <div
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: p3Active > 0.1 ? "#FBBF24" : "#64748B",
                marginBottom: 16,
              }}
            >
              By Admins, For Admins
            </div>

            <p
              style={{
                fontSize: 15,
                lineHeight: 1.5,
                color: p3Active > 0.1 ? "#CBD5E1" : "#475569",
                margin: 0,
              }}
            >
              Originating with Andrew Fawcett and actively enhanced at Salesforce Community Sprints worldwide.
            </p>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* CONNECTING BEAM & EXTENDING CAPABILITIES BANNER */}
      {/* ------------------------------------------------------------- */}
      {beamProgress > 0 && beamFade > 0 && (
        <div
          style={{
            position: "absolute",
            top: 678,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: beamFade,
            pointerEvents: "none",
          }}
        >
          {/* Animated Connecting Line */}
          <div
            style={{
              width: 1560 * beamProgress,
              height: 3,
              background:
                "linear-gradient(90deg, #00E5FF 0%, #10B981 50%, #F59E0B 100%)",
              boxShadow: "0 0 15px rgba(0, 229, 255, 0.6)",
              borderRadius: 2,
              marginBottom: 20,
            }}
          />

          {/* Subtitle Banner: Extending Declarative Capabilities */}
          <div
            style={{
              opacity: capabilitiesBannerOpacity,
              transform: `translateY(${(1 - capabilitiesBannerOpacity) * 20}px)`,
              display: "inline-flex",
              alignItems: "center",
              gap: 24,
              padding: "16px 36px",
              borderRadius: 40,
              backgroundColor: "rgba(15, 23, 42, 0.95)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
            }}
          >
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: 2,
                color: "#38BDF8",
                textTransform: "uppercase",
              }}
            >
              Extending Salesforce's Declarative Capabilities
            </span>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "#94A3B8",
              }}
            />
            <span style={{ fontSize: 16, color: "#E2E8F0", fontWeight: 500 }}>
              Clicks, Not Code • Lookup Relationships • Formula Filters
            </span>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* "HIT A WALL WITH STANDARD ROLLUPS" (Frames 390 - 430) */}
      {/* ------------------------------------------------------------- */}
      {wallCardOpacity > 0 && (
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            opacity: wallCardOpacity,
            zIndex: 30,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              padding: "24px 44px",
              backgroundColor: "rgba(234, 0, 30, 0.2)",
              border: "2px solid #EA001E",
              borderRadius: 20,
              backdropFilter: "blur(16px)",
              display: "flex",
              alignItems: "center",
              gap: 20,
              boxShadow: "0 0 50px rgba(234, 0, 30, 0.5)",
            }}
          >
            <span style={{ fontSize: 40 }}>🧱</span>
            <div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#FF8080",
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                }}
              >
                Standard Rollup Summary Limitation
              </div>
              <div style={{ fontSize: 16, color: "#FFFFFF", marginTop: 4 }}>
                Restricted to Master-Detail Relationships Only • No Lookup Rollups
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* RESOLUTION: "DLRS IS YOUR ANSWER" HERO FINALE (Frame 430+) */}
      {/* ------------------------------------------------------------- */}
      {frame >= 430 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 40,
            opacity: heroSpring,
            transform: `scale(${0.88 + heroSpring * 0.12})`,
            pointerEvents: "none",
          }}
        >
          {/* Hero Backdrop Glow */}
          <div
            style={{
              position: "absolute",
              width: 800,
              height: 800,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(1, 118, 211, 0.45) 0%, rgba(0, 229, 255, 0.12) 50%, transparent 75%)",
              filter: "blur(60px)",
              opacity: heroBadgeGlow,
            }}
          />

          {/* Official DLRS Badge */}
          <div
            style={{
              position: "relative",
              marginBottom: 32,
              filter: `drop-shadow(0 0 40px rgba(0, 229, 255, ${heroBadgeGlow * 0.9}))`,
            }}
          >
            <Img
              src={staticFile("DLRS_New_Badge_2022.png")}
              style={{
                width: 240,
                height: "auto",
                objectFit: "contain",
              }}
            />
          </div>

          {/* Hero Punchline */}
          <h2
            style={{
              fontSize: 72,
              fontWeight: 900,
              letterSpacing: 1,
              color: "#FFFFFF",
              margin: "0 0 20px 0",
              textShadow: "0 4px 30px rgba(0, 0, 0, 0.9)",
              textAlign: "center",
            }}
          >
            DLRS IS YOUR ANSWER
          </h2>

          {/* Hero Subtitle 3-Pill Row */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 22,
              padding: "16px 40px",
              borderRadius: 35,
              backgroundColor: "rgba(10, 20, 42, 0.95)",
              border: "1.5px solid rgba(0, 229, 255, 0.6)",
              boxShadow: "0 12px 35px rgba(0, 229, 255, 0.25)",
              marginBottom: 20,
            }}
          >
            <span style={{ fontSize: 19, color: "#00E5FF", fontWeight: 700 }}>
              27,000+ Organizations
            </span>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "#64748B",
              }}
            />
            <span style={{ fontSize: 19, color: "#34D399", fontWeight: 700 }}>
              Regularly Maintained
            </span>
            <div
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                backgroundColor: "#64748B",
              }}
            />
            <span style={{ fontSize: 19, color: "#FBBF24", fontWeight: 700 }}>
              Community Designed
            </span>
          </div>

          {/* Final Tagline */}
          <div
            style={{
              fontSize: 18,
              letterSpacing: 2,
              color: "#94A3B8",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Clicks, Not Code • Limitless Rollups • 100% Free & Open Source
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
