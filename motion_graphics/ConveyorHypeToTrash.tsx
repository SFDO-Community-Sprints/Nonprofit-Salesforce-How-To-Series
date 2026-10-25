import React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const FONT_FAMILY =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

interface ProductItem {
  id: string;
  name: string;
  category: string;
  hypeBadge: string;
  bgGradient: string;
  borderColor: string;
  accentColor: string;
  icon: string;
  spawnFrame: number;
  isSpecial?: boolean; // For AgentForce
}

export const ConveyorHypeToTrash: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // -------------------------------------------------------------
  // PRODUCTS DEFINITION
  // -------------------------------------------------------------
  const products: ProductItem[] = [
    {
      id: "jigsaw",
      name: "JigSaw",
      category: "Crowdsourced Data (Data.com)",
      hypeBadge: "$142M Acquisition",
      bgGradient: "linear-gradient(135deg, #EA580C 0%, #C2410C 100%)",
      borderColor: "#FB923C",
      accentColor: "#FEF08A",
      icon: "🧩",
      spawnFrame: 15,
    },
    {
      id: "docom",
      name: "Do.com",
      category: "Social Productivity Cloud",
      hypeBadge: "The Future of Work",
      bgGradient: "linear-gradient(135deg, #0284C7 0%, #0369A1 100%)",
      borderColor: "#38BDF8",
      accentColor: "#BAE6FD",
      icon: "📋",
      spawnFrame: 75,
    },
    {
      id: "salesforceiq",
      name: "SalesforceIQ",
      category: "Relationship Intelligence",
      hypeBadge: "$390M RelateIQ",
      bgGradient: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
      borderColor: "#60A5FA",
      accentColor: "#BFDBFE",
      icon: "💡",
      spawnFrame: 135,
    },
    {
      id: "iotcloud",
      name: "IOT Cloud",
      category: "Thunder Event Engine",
      hypeBadge: "Billions of Events",
      bgGradient: "linear-gradient(135deg, #9333EA 0%, #7E22CE 100%)",
      borderColor: "#C084FC",
      accentColor: "#F3E8FF",
      icon: "⚡",
      spawnFrame: 195,
    },
    {
      id: "agentforce",
      name: "Agentforce",
      category: "Autonomous AI Agents",
      hypeBadge: "100% REVOLUTIONARY!",
      bgGradient:
        "linear-gradient(135deg, #4F46E5 0%, #9333EA 50%, #DB2777 100%)",
      borderColor: "#F472B6",
      accentColor: "#FDE047",
      icon: "🤖",
      spawnFrame: 255,
      isSpecial: true,
    },
  ];

  // -------------------------------------------------------------
  // GEOMETRY
  // -------------------------------------------------------------
  const BELT_START_X = 350;
  const BELT_END_X = 1390;
  const BELT_Y = 560;
  const TRASH_TARGET_X = 1530;
  const TRASH_TARGET_Y = 830;

  // Tread motion
  const treadOffset = (frame * 7) % 36;

  // Active spawn flash (detect when any item is spawning ±10 frames)
  const isSpawning = products.some(
    (p) => Math.abs(frame - p.spawnFrame) < 8
  );
  const spawnGlow = isSpawning ? 1.6 : 1.0;

  // Trash can shake on impact
  const isImpact = products.some((p) => {
    const hitFrame = p.spawnFrame + (p.isSpecial ? 130 : 112);
    return frame >= hitFrame && frame <= hitFrame + 8;
  });
  const trashShakeX = isImpact ? (frame % 2 === 0 ? 3 : -3) : 0;
  const trashShakeY = isImpact ? (frame % 2 === 0 ? -2 : 1) : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#070C16",
        backgroundImage:
          "radial-gradient(ellipse at 50% 30%, #111C30 0%, #050810 100%)",
        fontFamily: FONT_FAMILY,
        color: "#FFFFFF",
        overflow: "hidden",
      }}
    >
      {/* Background Factory Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.7,
        }}
      />

      {/* Top Header Sign */}
      <div
        style={{
          position: "absolute",
          top: 32,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "8px 24px",
            borderRadius: 30,
            backgroundColor: "rgba(245, 158, 11, 0.12)",
            border: "1px solid rgba(245, 158, 11, 0.4)",
            boxShadow: "0 0 20px rgba(245, 158, 11, 0.2)",
          }}
        >
          <span style={{ fontSize: 18 }}>🏭</span>
          <span
            style={{
              fontSize: 14,
              letterSpacing: 3,
              fontWeight: 800,
              color: "#FBBF24",
              textTransform: "uppercase",
            }}
          >
            Salesforce Hype Cycle Assembly Line
          </span>
        </div>
        <h1
          style={{
            margin: "10px 0 0 0",
            fontSize: 34,
            fontWeight: 800,
            letterSpacing: -0.5,
            color: "#F1F5F9",
          }}
        >
          From "Bright Idea" to the Deprecation Graveyard
        </h1>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. LEFT STATION: THE LIGHTBULB ("INNOVATION LAB") */}
      {/* ------------------------------------------------------------- */}
      <div
        style={{
          position: "absolute",
          left: 30,
          top: 150,
          width: 340,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 15,
        }}
      >
        {/* "BRIGHT IDEA" Marquee Badge */}
        <div
          style={{
            padding: "6px 20px",
            borderRadius: 20,
            backgroundColor: "rgba(255, 215, 0, 0.18)",
            border: "1.5px solid #FFD700",
            boxShadow: `0 0 ${20 * spawnGlow}px rgba(255, 215, 0, 0.45)`,
            marginBottom: 8,
            display: "flex",
            alignItems: "center",
            gap: 8,
            transform: `scale(${isSpawning ? 1.06 : 1})`,
            transition: "transform 0.1s ease",
          }}
        >
          <span style={{ fontSize: 18 }}>💡</span>
          <span
            style={{
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: 2.5,
              color: "#FFD700",
              textTransform: "uppercase",
            }}
          >
            Bright Idea!
          </span>
        </div>

        {/* Hand-Drawn Lightbulb Cutout */}
        <div
          style={{
            position: "relative",
            width: 300,
            height: 360,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Filament Aura */}
          <div
            style={{
              position: "absolute",
              top: 70,
              width: 90,
              height: 90,
              borderRadius: "50%",
              backgroundColor: "rgba(255, 200, 0, 0.4)",
              filter: "blur(20px)",
              transform: `scale(${spawnGlow})`,
              pointerEvents: "none",
            }}
          />

          <Img
            src={staticFile("lightbulb_cutout.png")}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              filter: `drop-shadow(0 0 ${25 * spawnGlow}px rgba(255, 255, 255, 0.35))`,
            }}
          />
        </div>

        {/* Mechanical Delivery Chute */}
        <div
          style={{
            position: "absolute",
            bottom: -65,
            right: -60,
            width: 150,
            height: 80,
            borderBottom: "8px solid #475569",
            borderRight: "8px solid #334155",
            borderRadius: "0 0 50px 0",
            transform: "rotate(-12deg)",
            boxShadow: "0 8px 15px rgba(0,0,0,0.6)",
          }}
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. CENTER: THE ANIMATED CONVEYOR BELT */}
      {/* ------------------------------------------------------------- */}
      <div
        style={{
          position: "absolute",
          left: BELT_START_X,
          width: BELT_END_X - BELT_START_X,
          top: BELT_Y,
          zIndex: 10,
        }}
      >
        {/* Conveyor Belt Platform */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 38,
            backgroundColor: "#1E293B",
            borderRadius: 8,
            overflow: "hidden",
            border: "2px solid #334155",
            boxShadow:
              "0 15px 30px rgba(0,0,0,0.7), inset 0 2px 4px rgba(255,255,255,0.1)",
          }}
        >
          {/* Moving Treads */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              width: "120%",
              transform: `translateX(-${treadOffset}px)`,
              backgroundImage:
                "repeating-linear-gradient(90deg, #334155 0px, #334155 4px, #0F172A 4px, #0F172A 18px)",
            }}
          />
        </div>

        {/* Rotating Mechanical Rollers */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0 20px",
            marginTop: 4,
          }}
        >
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                backgroundColor: "#475569",
                border: "2px solid #64748B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `rotate(${(frame * 12) % 360}deg)`,
                boxShadow: "0 4px 6px rgba(0,0,0,0.4)",
              }}
            >
              <div
                style={{
                  width: 14,
                  height: 2,
                  backgroundColor: "#94A3B8",
                }}
              />
            </div>
          ))}
        </div>

        {/* Industrial Support Pillars with Hazard Warning Stripes */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginTop: 6,
          }}
        >
          {[0.15, 0.45, 0.75].map((_, idx) => (
            <div
              key={idx}
              style={{
                width: 32,
                height: 280,
                backgroundImage:
                  "repeating-linear-gradient(45deg, #F59E0B 0px, #F59E0B 12px, #0F172A 12px, #0F172A 24px)",
                border: "2px solid #334155",
                boxShadow: "0 10px 20px rgba(0,0,0,0.6)",
              }}
            />
          ))}
        </div>

        {/* Studio Floor Guideline */}
        <div
          style={{
            position: "absolute",
            top: 310,
            left: -400,
            right: -600,
            height: 4,
            backgroundColor: "#1E293B",
            boxShadow: "0 -2px 10px rgba(0,0,0,0.8)",
          }}
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. RIGHT STATION: THE TRASH CAN ("DEPRECATION GRAVEYARD") */}
      {/* ------------------------------------------------------------- */}
      {/* Deprecation Graveyard Header Banner - Mounted cleanly above */}
      <div
        style={{
          position: "absolute",
          left: TRASH_TARGET_X - 160,
          top: 370,
          padding: "7px 22px",
          borderRadius: 20,
          backgroundColor: "rgba(239, 68, 68, 0.18)",
          border: "1.5px solid #EF4444",
          boxShadow: "0 0 25px rgba(239, 68, 68, 0.35)",
          zIndex: 25,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ fontSize: 18 }}>🗑️</span>
        <span
          style={{
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: 2,
            color: "#F87171",
            textTransform: "uppercase",
          }}
        >
          Deprecation Graveyard
        </span>
      </div>

      {/* Back Layer of Trash Can (Background mesh) */}
      <div
        style={{
          position: "absolute",
          left: TRASH_TARGET_X - 180 + trashShakeX,
          top: 470 + trashShakeY,
          width: 360,
          height: 480,
          zIndex: 8, // Behind tumbling boxes so they drop in
        }}
      >
        <Img
          src={staticFile("trashcan_cutout.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. PRODUCTS MOVING ACROSS CONVEYOR & TUMBLING INTO TRASH */}
      {/* ------------------------------------------------------------- */}
      {products.map((item) => {
        const elapsed = frame - item.spawnFrame;
        if (elapsed < 0) return null;

        let currentX = BELT_START_X;
        let currentY = BELT_Y - 95;
        let rotation = 0;
        let opacity = 1;
        let scale = 1;

        if (!item.isSpecial) {
          if (elapsed <= 90) {
            // Riding the conveyor belt
            const progress = elapsed / 90;
            currentX = interpolate(
              progress,
              [0, 1],
              [BELT_START_X, BELT_END_X - 30]
            );
            currentY = BELT_Y - 95 + Math.sin(frame * 0.8) * 1.5;
            rotation = 0;
          } else if (elapsed <= 118) {
            // Tumbling off the edge into trash
            const fallElapsed = elapsed - 90;
            const t = fallElapsed / 28;

            currentX = interpolate(
              t,
              [0, 0.4, 1],
              [BELT_END_X - 30, TRASH_TARGET_X - 50, TRASH_TARGET_X - 20]
            );
            currentY = interpolate(
              t,
              [0, 0.25, 0.7, 1],
              [BELT_Y - 95, BELT_Y - 120, BELT_Y + 120, TRASH_TARGET_Y]
            );
            rotation = interpolate(t, [0, 1], [0, 220]);
            scale = interpolate(t, [0, 1], [1, 0.7]);
            opacity = interpolate(t, [0.8, 1], [1, 0.3]);
          } else {
            opacity = 0;
          }
        } else {
          // =========================================================
          // SPECIAL FINALE: AGENTFORCE DRAMATIC TEETER & PLUNGE
          // =========================================================
          if (elapsed <= 75) {
            const progress = elapsed / 75;
            currentX = interpolate(
              progress,
              [0, 1],
              [BELT_START_X, BELT_END_X - 10]
            );
            currentY = BELT_Y - 100 + Math.sin(frame * 0.8) * 2;
            rotation = 0;
          } else if (elapsed <= 110) {
            // TEETERING ON THE BRINK!
            currentX = BELT_END_X - 5;
            const teeterTime = elapsed - 75;
            rotation =
              28 + Math.sin(teeterTime * 0.45) * 18 + (teeterTime / 35) * 15;
            currentY = BELT_Y - 100 + (teeterTime / 35) * 15;
            scale = 1.05;
          } else if (elapsed <= 135) {
            // PLUNGING INTO TRASH!
            const fallElapsed = elapsed - 110;
            const t = fallElapsed / 25;

            currentX = interpolate(
              t,
              [0, 0.4, 1],
              [BELT_END_X - 5, TRASH_TARGET_X - 40, TRASH_TARGET_X - 15]
            );
            currentY = interpolate(
              t,
              [0, 0.2, 0.6, 1],
              [BELT_Y - 80, BELT_Y - 60, BELT_Y + 140, TRASH_TARGET_Y]
            );
            rotation = interpolate(t, [0, 1], [55, 380]);
            scale = interpolate(t, [0, 1], [1.05, 0.75]);
            opacity = interpolate(t, [0.85, 1], [1, 0.2]);
          } else {
            opacity = 0;
          }
        }

        if (opacity <= 0) return null;

        return (
          <div
            key={item.id}
            style={{
              position: "absolute",
              left: currentX,
              top: currentY,
              width: item.isSpecial ? 250 : 220,
              padding: item.isSpecial ? "14px 18px" : "12px 16px",
              borderRadius: 16,
              background: item.bgGradient,
              border: `2px solid ${item.borderColor}`,
              boxShadow: item.isSpecial
                ? "0 0 35px rgba(244, 114, 182, 0.6), 0 15px 30px rgba(0,0,0,0.6)"
                : "0 10px 25px rgba(0,0,0,0.5)",
              transform: `rotate(${rotation}deg) scale(${scale})`,
              transformOrigin: "center bottom",
              opacity,
              zIndex: elapsed > (item.isSpecial ? 110 : 90) ? 9 : 20, // Slips behind front mesh
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {/* Hype Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "2px 8px",
                borderRadius: 10,
                backgroundColor: "rgba(0, 0, 0, 0.35)",
                width: "fit-content",
              }}
            >
              <span style={{ fontSize: 13 }}>{item.icon}</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: item.accentColor,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                {item.hypeBadge}
              </span>
            </div>

            {/* Name */}
            <div
              style={{
                fontSize: item.isSpecial ? 26 : 22,
                fontWeight: 900,
                color: "#FFFFFF",
                letterSpacing: 0.5,
                lineHeight: 1.1,
              }}
            >
              {item.name}
            </div>

            {/* Category */}
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "rgba(255, 255, 255, 0.8)",
                letterSpacing: 0.5,
              }}
            >
              {item.category}
            </div>

            {/* Teeter Warning Badge on AgentForce */}
            {item.isSpecial && elapsed > 75 && elapsed <= 110 && (
              <div
                style={{
                  marginTop: 6,
                  padding: "4px 8px",
                  borderRadius: 6,
                  backgroundColor: "#EF4444",
                  color: "#FFFFFF",
                  fontSize: 11,
                  fontWeight: 900,
                  letterSpacing: 1,
                  textAlign: "center",
                  boxShadow: "0 0 15px #EF4444",
                }}
              >
                ⚠️ TEETERING ON THE BRINK ⚠️
              </div>
            )}
          </div>
        );
      })}

      {/* ------------------------------------------------------------- */}
      {/* 5. FRONT LAYER OF TRASH CAN (Items drop inside behind it) */}
      {/* ------------------------------------------------------------- */}
      <div
        style={{
          position: "absolute",
          left: TRASH_TARGET_X - 180 + trashShakeX,
          top: 470 + trashShakeY,
          width: 360,
          height: 480,
          zIndex: 12, // In front of falling items, behind impact popups
          pointerEvents: "none",
        }}
      >
        <Img
          src={staticFile("trashcan_front_layer.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 6. COMIC IMPACT LABELS WHEN ITEMS HIT TRASH */}
      {/* ------------------------------------------------------------- */}
      {products.map((item) => {
        const hitFrame = item.spawnFrame + (item.isSpecial ? 130 : 110);
        const hitAge = frame - hitFrame;
        if (hitAge < 0 || hitAge > 20) return null;

        const popScale = interpolate(hitAge, [0, 5, 20], [0.4, 1.3, 0.9]);
        const popOpacity = interpolate(hitAge, [0, 4, 16, 20], [0, 1, 1, 0]);

        return (
          <div
            key={`impact-${item.id}`}
            style={{
              position: "absolute",
              left: TRASH_TARGET_X - 40,
              top: 560,
              transform: `scale(${popScale}) rotate(${
                item.isSpecial ? -12 : 8
              }deg)`,
              opacity: popOpacity,
              zIndex: 30,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                padding: "6px 16px",
                borderRadius: 8,
                backgroundColor: item.isSpecial ? "#EF4444" : "#F59E0B",
                color: "#FFFFFF",
                fontSize: item.isSpecial ? 22 : 16,
                fontWeight: 900,
                letterSpacing: 1.5,
                boxShadow: "0 0 20px rgba(0,0,0,0.6)",
                textTransform: "uppercase",
              }}
            >
              {item.isSpecial ? "💥 CLUNK! 💥" : "PLOP!"}
            </div>
          </div>
        );
      })}

      {/* ------------------------------------------------------------- */}
      {/* 7. CLOSING RESOLUTION BANNER (Frames 370 - 410) */}
      {/* ------------------------------------------------------------- */}
      {frame >= 370 && (
        <div
          style={{
            position: "absolute",
            bottom: 35,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            zIndex: 40,
            opacity: interpolate(frame, [370, 385], [0, 1], {
              extrapolateLeft: "clamp",
            }),
            transform: `translateY(${interpolate(
              frame,
              [370, 385],
              [20, 0],
              { extrapolateLeft: "clamp" }
            )}px)`,
          }}
        >
          <div
            style={{
              padding: "14px 40px",
              borderRadius: 35,
              backgroundColor: "rgba(15, 23, 42, 0.95)",
              border: "1.5px solid rgba(245, 158, 11, 0.6)",
              boxShadow: "0 10px 40px rgba(0,0,0,0.8)",
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            <span style={{ fontSize: 26 }}>💡 ➡️ 🗑️</span>
            <span
              style={{
                fontSize: 19,
                fontWeight: 700,
                color: "#F8FAFC",
                letterSpacing: 0.5,
              }}
            >
              The Enterprise Hype Cycle Never Stops • Meanwhile, DLRS Keeps Working
            </span>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
