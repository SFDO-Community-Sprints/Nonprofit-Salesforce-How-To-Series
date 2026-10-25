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
const GREEN = "#2E844A";
const GREEN_BG = "#CDEFD6";
const GREEN_TEXT = "#014D2A";
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

export const SuperpowersShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrances
  const titleIn = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });
  const leftPanelIn = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 100 } });
  const rightPanelIn = spring({ frame: frame - 25, fps, config: { damping: 14, stiffness: 100 } });

  // Phase timings (Total: 420 frames = 14s @ 30fps)
  // 0 - 60: Intro
  // 60 - 190: Feature 1: Concatenate (Audio: "...including the ability to Concatenate...")
  // 190 - 320: Feature 2: Relative Date Filters (Audio: "...and use relative date filters.")
  // 320 - 420: Summary (Audio: "It's a huge time-saver and makes complex reporting and automation much simpler.")

  const isConcatenateActive = frame >= 60 && frame < 190;
  const isDateFilterActive = frame >= 190;
  const isFinalSummary = frame >= 320;

  // Concatenate animation timing
  // 3 separate groups of event types:
  // Item 1: Gala (Purple)
  // Item 2: Volunteer (Blue)
  // Item 3: Board Meeting (Green)
  const item1In = spring({ frame: frame - 65, fps, config: { damping: 12, stiffness: 120 } });
  const item2In = spring({ frame: frame - 78, fps, config: { damping: 12, stiffness: 120 } });
  const item3In = spring({ frame: frame - 90, fps, config: { damping: 12, stiffness: 120 } });

  // Movement into the combined field: frames 120 - 165
  const mergeProgress = interpolate(frame, [115, 155], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Relative Date Filter calendar dates
  // 5 sample event dates:
  // Oct 10 (Fri) - Weekday
  // Oct 11 (Sat) - Weekend [MATCH 1]
  // Oct 18 (Sat) - Weekend [MATCH 2]
  // Oct 22 (Wed) - Weekday
  // Oct 25 (Sun) - Weekend [MATCH 3]
  const dateScanProgress = interpolate(frame, [200, 240], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const weekendCount =
    frame < 220
      ? 0
      : frame < 245
      ? 1
      : frame < 270
      ? 2
      : 3;

  const weekendCountPop =
    frame >= 220 && frame < 285
      ? 1 + 0.15 * Math.sin((frame - 220) * 0.4)
      : 1;

  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT,
        background: `linear-gradient(150deg, ${BLUE_LIGHT} 0%, ${BLUE_BG} 50%, ${BLUE_DARK} 100%)`,
        overflow: "hidden",
      }}
    >
      {/* Audio Voiceover Track */}
      <Audio src={staticFile("seg_4.mp3")} />

      {/* Decorative Cloud Accents */}
      <Cloud x={-40} y={-30} scale={0.9} />
      <Cloud x={1520} y={-40} scale={0.8} />
      <Cloud x={-60} y={920} scale={1.0} />
      <Cloud x={1480} y={900} scale={0.9} />

      {/* Top Banner Header */}
      <div
        style={{
          position: "absolute",
          top: 24,
          width: "100%",
          textAlign: "center",
          color: "white",
          transform: `scale(${titleIn})`,
          opacity: Math.min(1, titleIn),
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            color: YELLOW,
            marginBottom: 4,
          }}
        >
          MORE POWER THAN STANDARD ROLLUPS
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            letterSpacing: -0.5,
          }}
        >
          {isConcatenateActive
            ? "Superpower #1: Concatenate Text Fields"
            : isDateFilterActive && !isFinalSummary
            ? "Superpower #2: Relative Date Filters (Weekends Only)"
            : isFinalSummary
            ? "A Huge Time-Saver for Reporting & Automation"
            : "DLRS Gives You Powers Standard Salesforce Can't"}
        </div>
      </div>

      {/* TWO HERO PANELS SIDE BY SIDE */}
      <div
        style={{
          position: "absolute",
          top: 130,
          left: 80,
          right: 80,
          display: "flex",
          gap: 40,
        }}
      >
        {/* ============================================================== */}
        {/* LEFT PANEL: CONCATENATE EXAMPLE */}
        {/* ============================================================== */}
        <div
          style={{
            flex: 1,
            background: "white",
            borderRadius: 24,
            padding: "28px 32px",
            boxShadow: isConcatenateActive
              ? `0 24px 60px rgba(0,0,0,0.35), 0 0 0 5px ${YELLOW}`
              : "0 18px 45px rgba(0,0,0,0.22)",
            transform: `translateY(${(1 - leftPanelIn) * 60}px) scale(${
              isConcatenateActive ? 1.02 : 1
            })`,
            opacity: Math.min(1, leftPanelIn) * (isDateFilterActive && !isFinalSummary ? 0.45 : 1),
            transition: "opacity 0.3s, transform 0.3s, box-shadow 0.3s",
            borderTop: `8px solid ${PURPLE}`,
            display: "flex",
            flexDirection: "column",
            height: 640,
            boxSizing: "border-box",
          }}
        >
          {/* Panel Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: PURPLE,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  fontWeight: 900,
                  boxShadow: "0 6px 16px rgba(139,127,232,0.4)",
                }}
              >
                🔤
              </div>
              <div>
                <div style={{ fontSize: 13, color: "#706E6B", fontWeight: 700, letterSpacing: 1 }}>
                  TEXT AGGREGATION
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#181818" }}>
                  Concatenate Strings
                </div>
              </div>
            </div>
            <div
              style={{
                background: "#EDE7F6",
                color: "#512DA8",
                fontSize: 14,
                fontWeight: 700,
                padding: "6px 14px",
                borderRadius: 999,
              }}
            >
              Action: CONCATENATE
            </div>
          </div>

          <div style={{ fontSize: 15, color: "#555", marginTop: 12, lineHeight: 1.4 }}>
            Take values from separate related records and merge them into one single text field with your choice of delimiter.
          </div>

          {/* Section A: The 3 Separate Event Types */}
          <div
            style={{
              marginTop: 20,
              background: "#F8F9FA",
              borderRadius: 18,
              padding: "18px 20px",
              border: "2px dashed #D0D5DD",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: "#706E6B", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
              3 Separate Related Event Records:
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "space-between" }}>
              {/* Event Type 1: Gala */}
              <div
                style={{
                  flex: 1,
                  background: "white",
                  border: "2px solid #E0E0E0",
                  borderRadius: 14,
                  padding: "14px 12px",
                  textAlign: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  transform: `scale(${item1In})`,
                  opacity: Math.min(1, item1In),
                }}
              >
                <div style={{ fontSize: 24 }}>🎟️</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#181818", marginTop: 4 }}>
                  Gala
                </div>
                <div style={{ fontSize: 12, color: "#706E6B", marginTop: 2 }}>
                  Record #1 Type
                </div>
              </div>

              {/* Event Type 2: Volunteer */}
              <div
                style={{
                  flex: 1,
                  background: "white",
                  border: "2px solid #E0E0E0",
                  borderRadius: 14,
                  padding: "14px 12px",
                  textAlign: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  transform: `scale(${item2In})`,
                  opacity: Math.min(1, item2In),
                }}
              >
                <div style={{ fontSize: 24 }}>🤝</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#181818", marginTop: 4 }}>
                  Volunteer
                </div>
                <div style={{ fontSize: 12, color: "#706E6B", marginTop: 2 }}>
                  Record #2 Type
                </div>
              </div>

              {/* Event Type 3: Board Meeting */}
              <div
                style={{
                  flex: 1,
                  background: "white",
                  border: "2px solid #E0E0E0",
                  borderRadius: 14,
                  padding: "14px 12px",
                  textAlign: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                  transform: `scale(${item3In})`,
                  opacity: Math.min(1, item3In),
                }}
              >
                <div style={{ fontSize: 24 }}>📋</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#181818", marginTop: 4 }}>
                  Board Meeting
                </div>
                <div style={{ fontSize: 12, color: "#706E6B", marginTop: 2 }}>
                  Record #3 Type
                </div>
              </div>
            </div>
          </div>

          {/* Animated Connecting Arrow */}
          <div style={{ textAlign: "center", margin: "14px 0", color: PURPLE, fontSize: 28, fontWeight: 900 }}>
            <span style={{ display: "inline-block", transform: `translateY(${Math.sin(frame / 6) * 4}px)` }}>
              ⬇ DLRS Concatenate Tool ⬇
            </span>
          </div>

          {/* Section B: Single Comma-Separated Text Field on Contact */}
          <div
            style={{
              background: mergeProgress > 0.5 ? "#F3E5F5" : "#FAFAFA",
              border: mergeProgress > 0.5 ? `3px solid ${PURPLE}` : "2px solid #E0E0E0",
              borderRadius: 18,
              padding: "18px 24px",
              transition: "background 0.3s, border 0.3s",
              boxShadow: mergeProgress > 0.5 ? "0 10px 25px rgba(139,127,232,0.25)" : "none",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#706E6B", textTransform: "uppercase", letterSpacing: 1 }}>
                Single Text Field on Contact Record:
              </div>
              <div style={{ fontSize: 12, color: PURPLE, fontWeight: 700 }}>
                Delimiter: Comma & Space (&quot;, &quot;)
              </div>
            </div>

            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#181818",
                marginTop: 8,
                background: "white",
                padding: "14px 18px",
                borderRadius: 12,
                border: "2px solid #D0D5DD",
                display: "flex",
                alignItems: "center",
                gap: 6,
                minHeight: 56,
                boxSizing: "border-box",
              }}
            >
              {mergeProgress < 0.2 ? (
                <span style={{ color: "#9E9E9E", fontStyle: "italic", fontSize: 18 }}>
                  [ Field Empty - Ready to Roll Up ]
                </span>
              ) : (
                <span>
                  <span style={{ color: "#512DA8", fontWeight: 800 }}>Gala</span>
                  {mergeProgress >= 0.5 && (
                    <span style={{ color: RED, fontWeight: 900, margin: "0 2px" }}>, </span>
                  )}
                  {mergeProgress >= 0.5 && (
                    <span style={{ color: "#0277BD", fontWeight: 800 }}>Volunteer</span>
                  )}
                  {mergeProgress >= 0.85 && (
                    <span style={{ color: RED, fontWeight: 900, margin: "0 2px" }}>, </span>
                  )}
                  {mergeProgress >= 0.85 && (
                    <span style={{ color: "#2E7D32", fontWeight: 800 }}>Board Meeting</span>
                  )}
                </span>
              )}
            </div>

            <div style={{ marginTop: 10, fontSize: 13, color: GREEN, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
              <span>✓</span> Standard Salesforce roll-up summary fields cannot concatenate text!
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT PANEL: RELATIVE DATE FILTERS (WEEKENDS ONLY) */}
        {/* ============================================================== */}
        <div
          style={{
            flex: 1,
            background: "white",
            borderRadius: 24,
            padding: "28px 32px",
            boxShadow: isDateFilterActive && !isFinalSummary
              ? `0 24px 60px rgba(0,0,0,0.35), 0 0 0 5px ${YELLOW}`
              : "0 18px 45px rgba(0,0,0,0.22)",
            transform: `translateY(${(1 - rightPanelIn) * 60}px) scale(${
              isDateFilterActive && !isFinalSummary ? 1.02 : 1
            })`,
            opacity: Math.min(1, rightPanelIn) * (isConcatenateActive ? 0.45 : 1),
            transition: "opacity 0.3s, transform 0.3s, box-shadow 0.3s",
            borderTop: `8px solid ${ORANGE}`,
            display: "flex",
            flexDirection: "column",
            height: 640,
            boxSizing: "border-box",
          }}
        >
          {/* Panel Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: ORANGE,
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  fontWeight: 900,
                  boxShadow: "0 6px 16px rgba(245,158,11,0.4)",
                }}
              >
                📅
              </div>
              <div>
                <div style={{ fontSize: 13, color: "#706E6B", fontWeight: 700, letterSpacing: 1 }}>
                  DYNAMIC CALENDAR LOGIC
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#181818" }}>
                  Relative Date Filters
                </div>
              </div>
            </div>
            <div
              style={{
                background: "#FFF3E0",
                color: "#E65100",
                fontSize: 14,
                fontWeight: 700,
                padding: "6px 14px",
                borderRadius: 999,
              }}
            >
              Filter: Weekends Only
            </div>
          </div>

          <div style={{ fontSize: 15, color: "#555", marginTop: 12, lineHeight: 1.4 }}>
            Filter child records dynamically by relative dates (e.g. THIS_MONTH, LAST_N_DAYS) or isolate weekend events automatically.
          </div>

          {/* Section: Calendar Schedule Matrix */}
          <div
            style={{
              marginTop: 18,
              background: "#F8F9FA",
              borderRadius: 18,
              padding: "16px 20px",
              border: "2px solid #E0E0E0",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#706E6B", textTransform: "uppercase", letterSpacing: 1 }}>
                All Scheduled Events (October):
              </div>
              <div style={{ fontSize: 12, background: YELLOW, color: "#181818", fontWeight: 800, padding: "2px 8px", borderRadius: 6 }}>
                Active Filter: Day = Saturday OR Sunday
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {/* Row 1: Friday Oct 10 (Weekday) */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 14px",
                  borderRadius: 10,
                  background: "white",
                  border: "1px solid #E0E0E0",
                  opacity: dateScanProgress > 0.2 ? 0.35 : 1,
                  transition: "opacity 0.3s",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, color: "#424242" }}>
                  🗓️ Oct 10 · Friday Night Mixer
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#757575", background: "#EEEEEE", padding: "2px 8px", borderRadius: 4 }}>
                  Weekday (Ignored)
                </div>
              </div>

              {/* Row 2: Saturday Oct 11 (Weekend) */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 14px",
                  borderRadius: 10,
                  background: dateScanProgress > 0.3 ? GREEN_BG : "white",
                  border: dateScanProgress > 0.3 ? `2px solid ${GREEN}` : "1px solid #E0E0E0",
                  boxShadow: dateScanProgress > 0.3 ? "0 4px 12px rgba(46,132,74,0.2)" : "none",
                  transition: "background 0.3s, border 0.3s",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 800, color: dateScanProgress > 0.3 ? GREEN_TEXT : "#181818" }}>
                  🌟 Oct 11 · Saturday Park Cleanup
                </div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "white", background: GREEN, padding: "2px 10px", borderRadius: 4 }}>
                  ✓ Weekend Match (#1)
                </div>
              </div>

              {/* Row 3: Saturday Oct 18 (Weekend) */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 14px",
                  borderRadius: 10,
                  background: dateScanProgress > 0.6 ? GREEN_BG : "white",
                  border: dateScanProgress > 0.6 ? `2px solid ${GREEN}` : "1px solid #E0E0E0",
                  boxShadow: dateScanProgress > 0.6 ? "0 4px 12px rgba(46,132,74,0.2)" : "none",
                  transition: "background 0.3s, border 0.3s",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 800, color: dateScanProgress > 0.6 ? GREEN_TEXT : "#181818" }}>
                  🌟 Oct 18 · Saturday 5K Charity Run
                </div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "white", background: GREEN, padding: "2px 10px", borderRadius: 4 }}>
                  ✓ Weekend Match (#2)
                </div>
              </div>

              {/* Row 4: Wednesday Oct 22 (Weekday) */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 14px",
                  borderRadius: 10,
                  background: "white",
                  border: "1px solid #E0E0E0",
                  opacity: dateScanProgress > 0.7 ? 0.35 : 1,
                  transition: "opacity 0.3s",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700, color: "#424242" }}>
                  🗓️ Oct 22 · Wednesday Board Meeting
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#757575", background: "#EEEEEE", padding: "2px 8px", borderRadius: 4 }}>
                  Weekday (Ignored)
                </div>
              </div>

              {/* Row 5: Sunday Oct 25 (Weekend) */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 14px",
                  borderRadius: 10,
                  background: dateScanProgress > 0.9 ? GREEN_BG : "white",
                  border: dateScanProgress > 0.9 ? `2px solid ${GREEN}` : "1px solid #E0E0E0",
                  boxShadow: dateScanProgress > 0.9 ? "0 4px 12px rgba(46,132,74,0.2)" : "none",
                  transition: "background 0.3s, border 0.3s",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 800, color: dateScanProgress > 0.9 ? GREEN_TEXT : "#181818" }}>
                  🌟 Oct 25 · Sunday Youth Mentorship
                </div>
                <div style={{ fontSize: 12, fontWeight: 800, color: "white", background: GREEN, padding: "2px 10px", borderRadius: 4 }}>
                  ✓ Weekend Match (#3)
                </div>
              </div>
            </div>
          </div>

          {/* Section: Resulting Summary Field */}
          <div
            style={{
              marginTop: 14,
              background: "#FFF8E1",
              border: `2px solid ${ORANGE}`,
              borderRadius: 16,
              padding: "14px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#706E6B", textTransform: "uppercase" }}>
                Target Field on Contact:
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#181818" }}>
                Weekend_Events_Attended__c
              </div>
            </div>

            <div
              style={{
                fontSize: 36,
                fontWeight: 900,
                color: weekendCount > 0 ? GREEN : "#181818",
                background: "white",
                padding: "4px 20px",
                borderRadius: 12,
                border: "2px solid #E0E0E0",
                transform: `scale(${weekendCountPop})`,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              {weekendCount}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Subtitle / Educational Banner */}
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
            background: "rgba(0,0,0,0.6)",
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
          {frame < 60 && (
            <span>Dolores brings superpowers that native Salesforce roll-up summaries lack.</span>
          )}
          {isConcatenateActive && (
            <span>
              💡 <b style={{ color: YELLOW }}>Concatenate:</b> Multiple child text values merged into a single comma-separated list!
            </span>
          )}
          {isDateFilterActive && !isFinalSummary && (
            <span>
              💡 <b style={{ color: YELLOW }}>Relative Date Filters:</b> Automatically calculate records matching dynamic date rules (e.g. Weekends only = 3)!
            </span>
          )}
          {isFinalSummary && (
            <span>
              ⚡ <b style={{ color: YELLOW }}>Time-Saver:</b> Complex reporting and automation made simple without writing custom code!
            </span>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
