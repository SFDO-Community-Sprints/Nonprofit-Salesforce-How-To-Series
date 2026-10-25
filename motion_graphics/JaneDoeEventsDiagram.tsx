import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
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
const GREEN = "#2E844A";
const GREEN_BG = "#CDEFD6";
const GREEN_TEXT = "#014D2A";
const GRAY_BG = "#E5E5E5";
const GRAY_TEXT = "#5C5C5C";
const PURPLE = "#8B7FE8";
const RED = "#EA001E";
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

interface EventData {
  id: string;
  name: string;
  date: string;
  status: "Attended" | "Registered" | "No Show";
  isAttended: boolean;
  isLatest: boolean;
}

const EVENTS: EventData[] = [
  {
    id: "CM-001",
    name: "Spring Gala",
    date: "March 15",
    status: "Attended",
    isAttended: true,
    isLatest: false,
  },
  {
    id: "CM-002",
    name: "Volunteer Day",
    date: "May 20",
    status: "Registered",
    isAttended: false,
    isLatest: false,
  },
  {
    id: "CM-003",
    name: "Donor Breakfast",
    date: "July 10",
    status: "Attended",
    isAttended: true,
    isLatest: false,
  },
  {
    id: "CM-004",
    name: "Annual Auction",
    date: "Sept 05",
    status: "No Show",
    isAttended: false,
    isLatest: false,
  },
  {
    id: "CM-005",
    name: "Board Retreat",
    date: "Nov 12",
    status: "Attended",
    isAttended: true,
    isLatest: true,
  },
];

export const JaneDoeEventsDiagram: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Story Beats (360 frames = 12s @ 30fps):
  // 0 - 80: Jane Doe + 5 events branch down. Non-technical overview.
  // 80 - 180: "Calculate child records" -> Filter/highlight Attended (count: 3)
  // 180 - 270: "Find the latest record" -> Highlight Board Retreat (Nov 12)
  // 270 - 360: "Across a lookup relationship" -> The limitation challenge

  // Spring entrances
  const janeIn = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const linesIn = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Highlight states
  const showCountHighlight = frame >= 85 && frame < 185;
  const showLatestHighlight = frame >= 185;

  // Counter animation (0 to 3) during count phase
  const countValue =
    frame < 110
      ? "?"
      : frame < 135
      ? "1"
      : frame < 160
      ? "2"
      : "3";

  // Latest event animation
  const latestValue = frame < 205 ? "?" : "Board Retreat";

  // Pulse effect on values
  const countPop =
    frame >= 110 && frame < 170
      ? 1 + 0.15 * Math.sin((frame - 110) * 0.4)
      : 1;

  const latestPop =
    frame >= 205 && frame < 250
      ? 1 + 0.12 * Math.sin((frame - 205) * 0.4)
      : 1;

  // Dimensions for top-down layout
  // Center top card: width 760, centered at x=960 -> left=580, top=70, bottom=230
  // Stem down from (960, 230) to (960, 310)
  // Horizontal branch bar: y=310, from x=290 to x=1630
  // 5 drops from y=310 to y=380 at card centers: x = 290, 625, 960, 1295, 1630
  const cardWidth = 315;
  const cardGap = 20;
  const startX = (1920 - (5 * cardWidth + 4 * cardGap)) / 2; // ~132.5
  const cardCenters = [0, 1, 2, 3, 4].map(
    (i) => startX + i * (cardWidth + cardGap) + cardWidth / 2
  );

  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT,
        background: `linear-gradient(150deg, ${BLUE_LIGHT} 0%, ${BLUE_BG} 50%, ${BLUE_DARK} 100%)`,
        overflow: "hidden",
      }}
    >
      {/* Voiceover audio track */}
      <Audio src={staticFile("seg_2.mp3")} />

      {/* Background Cloud Accents */}
      <Cloud x={-40} y={-30} scale={0.9} />
      <Cloud x={1520} y={-40} scale={0.8} />
      <Cloud x={-60} y={920} scale={1.0} />
      <Cloud x={1480} y={900} scale={0.9} />

      {/* Top Banner Title */}
      <div
        style={{
          position: "absolute",
          top: 20,
          width: "100%",
          textAlign: "center",
          color: "white",
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: YELLOW,
            marginBottom: 2,
          }}
        >
          {frame < 85
            ? "THE REAL-WORLD NONPROFIT SCENARIO"
            : showCountHighlight
            ? "QUESTION 1: HOW MANY EVENTS DID JANE ATTEND?"
            : showLatestHighlight && frame < 275
            ? "QUESTION 2: WHAT WAS HER MOST RECENT EVENT?"
            : "THE CHALLENGE: STANDARD SALESFORCE CAN'T ROLL THIS UP"}
        </div>
      </div>

      {/* TOP ELEMENT: Jane Doe (The Parent Contact Record) */}
      <div
        style={{
          position: "absolute",
          left: 580,
          top: 65,
          width: 760,
          height: 165,
          background: "white",
          borderRadius: 22,
          boxShadow: "0 20px 50px rgba(0,0,0,0.28)",
          transform: `scale(${janeIn})`,
          opacity: Math.min(1, janeIn),
          display: "flex",
          padding: "16px 24px",
          boxSizing: "border-box",
          border: "2px solid rgba(255,255,255,0.6)",
          zIndex: 10,
        }}
      >
        {/* Left Side: Avatar & Contact Info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            flex: 1,
            borderRight: "2px solid #E5E5E5",
            paddingRight: 16,
          }}
        >
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 18,
              background: PURPLE,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 800,
              boxShadow: "0 8px 20px rgba(139,127,232,0.4)",
              flexShrink: 0,
            }}
          >
            JD
          </div>
          <div>
            <div
              style={{
                fontSize: 13,
                color: "#706E6B",
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              CONTACT RECORD (PARENT)
            </div>
            <div style={{ fontSize: 32, color: "#181818", fontWeight: 800, lineHeight: 1.1 }}>
              Jane Doe
            </div>
            <div style={{ fontSize: 16, color: "#5C5C5C", marginTop: 4 }}>
              Active Supporter & Volunteer
            </div>
          </div>
        </div>

        {/* Right Side: The Questions We Need Answered */}
        <div
          style={{
            display: "flex",
            gap: 14,
            paddingLeft: 20,
            alignItems: "center",
          }}
        >
          {/* Stat 1: Total Attended */}
          <div
            style={{
              background: showCountHighlight ? "#E8F5E9" : "#F8F9FA",
              border: showCountHighlight ? `3px solid ${GREEN}` : "2px solid #E0E0E0",
              borderRadius: 14,
              padding: "10px 14px",
              textAlign: "center",
              minWidth: 110,
              transform: `scale(${countPop})`,
              transition: "transform 0.2s",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: "#5C5C5C" }}>
              Events Attended
            </div>
            <div
              style={{
                fontSize: 34,
                fontWeight: 900,
                color: countValue !== "?" ? GREEN : "#181818",
                marginTop: 2,
              }}
            >
              {countValue}
            </div>
          </div>

          {/* Stat 2: Latest Event */}
          <div
            style={{
              background: showLatestHighlight ? "#FFF9C4" : "#F8F9FA",
              border: showLatestHighlight ? `3px solid ${ORANGE}` : "2px solid #E0E0E0",
              borderRadius: 14,
              padding: "10px 14px",
              textAlign: "center",
              minWidth: 140,
              transform: `scale(${latestPop})`,
              transition: "transform 0.2s",
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: "#5C5C5C" }}>
              Most Recent Event
            </div>
            <div
              style={{
                fontSize: latestValue === "?" ? 34 : 17,
                fontWeight: 800,
                color: latestValue !== "?" ? "#E65100" : "#181818",
                marginTop: latestValue === "?" ? 2 : 8,
              }}
            >
              {latestValue}
            </div>
          </div>
        </div>
      </div>

      {/* TOP-DOWN CONNECTOR TREE (SVG) */}
      <svg
        width="1920"
        height="1080"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          pointerEvents: "none",
          opacity: linesIn,
        }}
      >
        {/* Main Vertical Stem dropping from Jane Doe */}
        <line
          x1={960}
          y1={230}
          x2={960}
          y2={305}
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Horizontal Crossbar branching to all 5 events */}
        <line
          x1={cardCenters[0]}
          y1={305}
          x2={cardCenters[4]}
          y2={305}
          stroke="white"
          strokeWidth={frame >= 275 ? 4 : 4}
          strokeDasharray={frame >= 275 ? "10 8" : undefined}
          strokeLinecap="round"
        />

        {/* 5 Vertical Drop Lines connecting to each event card */}
        {cardCenters.map((cx, i) => {
          const isAttended = EVENTS[i].isAttended;
          const isLatest = EVENTS[i].isLatest;

          const isLineActive =
            (showCountHighlight && isAttended) ||
            (showLatestHighlight && isLatest);

          return (
            <g key={i}>
              <line
                x1={cx}
                y1={305}
                x2={cx}
                y2={375}
                stroke={
                  isLineActive
                    ? YELLOW
                    : "white"
                }
                strokeWidth={isLineActive ? 6 : 4}
                strokeLinecap="round"
              />
              {/* Joint Dots */}
              <circle
                cx={cx}
                y1={305}
                cy={305}
                r={isLineActive ? 7 : 5}
                fill={isLineActive ? YELLOW : "white"}
              />
            </g>
          );
        })}
      </svg>

      {/* Relationship Tag centered on the branch */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 285,
          transform: "translateX(-50%)",
          opacity: linesIn,
        }}
      >
        <div
          style={{
            background: frame >= 275 ? "#FFEBEE" : "rgba(255,255,255,0.92)",
            border: frame >= 275 ? `2px solid ${RED}` : "2px solid white",
            color: frame >= 275 ? RED : "#014486",
            fontSize: 14,
            fontWeight: 800,
            padding: "4px 16px",
            borderRadius: 999,
            boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {frame >= 275 ? "⚠️ Lookup Relationship (Not Master-Detail)" : "🔗 Related Event Invitations (Related List)"}
        </div>
      </div>

      {/* BOTTOM ROW: The 5 Event Cards (Horizontal Layout) */}
      <div
        style={{
          position: "absolute",
          top: 375,
          left: startX,
          display: "flex",
          gap: cardGap,
        }}
      >
        {EVENTS.map((event, i) => {
          const cardIn = spring({
            frame: frame - (35 + i * 8),
            fps,
            config: { damping: 14, stiffness: 110 },
          });

          // Dimming/Highlighting logic
          const isAttended = event.isAttended;
          const isLatest = event.isLatest;

          const isHighlighted =
            (showCountHighlight && isAttended) ||
            (showLatestHighlight && isLatest);

          const isDimmed =
            (showCountHighlight && !isAttended) ||
            (showLatestHighlight && !isLatest);

          return (
            <div
              key={event.id}
              style={{
                width: cardWidth,
                height: 400,
                background: "white",
                borderRadius: 22,
                boxShadow: isHighlighted
                  ? `0 20px 50px rgba(0,0,0,0.35), 0 0 0 5px ${YELLOW}`
                  : "0 14px 35px rgba(0,0,0,0.22)",
                transform: `translateY(${(1 - cardIn) * 60}px) scale(${
                  isHighlighted ? 1.05 : cardIn
                })`,
                opacity: isDimmed ? 0.35 : Math.min(1, cardIn),
                transition: "opacity 0.3s, transform 0.3s, box-shadow 0.3s",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                borderTop: isHighlighted ? `8px solid ${YELLOW}` : "8px solid #00A1E0",
              }}
            >
              {/* Event Card Header (Star Icon + Date) */}
              <div
                style={{
                  padding: "16px 18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #EEEEEE",
                  background: "#FAFAFA",
                }}
              >
                {/* Gold Star Badge (matches the user's uploaded screenshot!) */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: ORANGE,
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    fontWeight: 900,
                    boxShadow: "0 4px 10px rgba(245,158,11,0.3)",
                  }}
                >
                  ★
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#706E6B",
                    background: "#F0F0F0",
                    padding: "4px 10px",
                    borderRadius: 6,
                  }}
                >
                  {event.date}
                </div>
              </div>

              {/* Event Card Body */}
              <div style={{ padding: "18px", flex: 1, display: "flex", flexDirection: "column" }}>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    color: "#181818",
                    lineHeight: 1.2,
                  }}
                >
                  {event.name}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: "#706E6B",
                    marginTop: 6,
                    fontWeight: 600,
                  }}
                >
                  Campaign Member ·{" "}
                  <span
                    style={{
                      background: "#FFF9C4",
                      padding: "2px 6px",
                      borderRadius: 4,
                      color: "#5D4037",
                    }}
                  >
                    Id: {event.id}
                  </span>
                </div>

                {/* Plain-English Context Description */}
                <div
                  style={{
                    fontSize: 14,
                    color: "#424242",
                    marginTop: 14,
                    lineHeight: 1.4,
                    flex: 1,
                  }}
                >
                  {i === 0 && "Spring fundraising gala dinner for supporters."}
                  {i === 1 && "Signed up for community park cleanup day."}
                  {i === 2 && "Attended private briefing for major donors."}
                  {i === 3 && "Invited to auction; could not make it."}
                  {i === 4 && "Attended annual board leadership session."}
                </div>

                {/* Status Pill Badge (matches uploaded screenshot!) */}
                <div
                  style={{
                    alignSelf: "flex-start",
                    fontSize: 16,
                    fontWeight: 800,
                    padding: "8px 18px",
                    borderRadius: 999,
                    background: event.isAttended ? GREEN_BG : GRAY_BG,
                    color: event.isAttended ? GREEN_TEXT : GRAY_TEXT,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <span>{event.isAttended ? "✓" : "○"}</span>
                  <span>{event.status}</span>
                </div>
              </div>

              {/* Highlight Pin/Flag Overlay */}
              {showCountHighlight && isAttended && (
                <div
                  style={{
                    background: GREEN,
                    color: "white",
                    textAlign: "center",
                    padding: "8px 0",
                    fontSize: 14,
                    fontWeight: 800,
                    letterSpacing: 1,
                  }}
                >
                  ATTENDED RECORD MATCH
                </div>
              )}

              {showLatestHighlight && isLatest && (
                <div
                  style={{
                    background: ORANGE,
                    color: "white",
                    textAlign: "center",
                    padding: "8px 0",
                    fontSize: 14,
                    fontWeight: 800,
                    letterSpacing: 1,
                  }}
                >
                  🌟 MOST RECENT DATE (NOV 12)
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Educational Subtitle Bar */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.25)",
            color: "white",
            fontSize: 24,
            fontWeight: 600,
            padding: "12px 36px",
            borderRadius: 999,
            textAlign: "center",
            boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
          }}
        >
          {frame < 85 && (
            <span>Jane Doe is connected to 5 events in a related list.</span>
          )}
          {showCountHighlight && (
            <span>
              💡 <b style={{ color: YELLOW }}>Calculate Child Records:</b> Count how many times status was &quot;Attended&quot; (3)
            </span>
          )}
          {showLatestHighlight && frame < 275 && (
            <span>
              💡 <b style={{ color: YELLOW }}>Find Latest Record:</b> Grab the newest event date (Board Retreat · Nov 12)
            </span>
          )}
          {frame >= 275 && (
            <span>
              ⚠️ <b style={{ color: YELLOW }}>The Problem:</b> Standard roll-up fields can&apos;t do this on Lookup relationships!
            </span>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
