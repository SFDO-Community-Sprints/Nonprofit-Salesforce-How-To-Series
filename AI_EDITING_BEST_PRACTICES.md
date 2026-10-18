# Best Practices: Creating How-To Videos with AI-Assisted Editing

*A comprehensive guide for creators, editors, and sprint volunteers producing polished software how-to videos using AI tools without the "AI slop."*

---

## 1. Executive Summary & Core Philosophy

AI tools can dramatically accelerate video editing—taking hours of tedious timeline assembly down to seconds. However, unguided AI generation often leads to what viewers perceive as **"AI slop"**: generic stock photos, weirdly deformed AI humans pretending to code, robotic pacing, and inconsistent visual styles.

### The Golden Rule
> **Use AI for automation, calculation, and assembly; use authentic product assets, branded design systems, and human review for visuals.**

* **What AI is fantastic at:**
  * Parsing scripts into structured scene segments.
  * Generating high-fidelity scratch narration (neural TTS) for accurate pacing.
  * Calculating audio durations down to the millisecond.
  * Generating NLE timeline blueprints (FCP XML / EDL) that automatically place audio and images on your timeline.
* **What AI should NOT do:**
  * Generating synthetic, photorealistic images of people or fictional UIs.
  * Blindly guessing UI coordinates for cursor animations over static screenshots.
  * Overcomplicating simple motion graphics with heavy 3D rendering engines (e.g., Unreal Engine) when clean 2D motion graphics communicate far more clearly.

---

## 2. Phase 1: Scripting for AI & Humans (The Foundation)

A smooth edit starts in the script. Using a structured **Two-Column Script** bridges the gap between human storytelling and machine automation.

### The Two-Column Script Format
| Audio (Narration) | Visuals (Screen Actions & Assets) |
| :--- | :--- |
| *"While sometimes it seems Salesforce is always the best friend of the declarative admin, sometimes everyday business needs get ignored."* | **`screen_intro_tabs.jpg`**<br>Highlight the AppExchange listing tabs. |
| *"Building a new DLRS rollup takes four simple steps: specify objects, define the field to summarize, set the target field, and choose the roll-up type."* | **`[GRAPHIC] RollupDiagram.mp4`**<br>Parent-child rollup animated flow diagram showing Contact count increasing from 0 to 3. |

### Scripting Best Practices:
1. **One Row = One Scene / Segment:** Each row in your script table should represent one logical visual thought. This directly maps to a segment in the automated timeline generator (`config.json`).
2. **Explicit Filenames:** In the Visuals column, write the exact filename that will be used (e.g., `screen_rollup_summary.jpg` rather than *"show rollup screen"*).
3. **Explicit Element Tags:** Use clear tags like `[GRAPHIC]`, `[RECORDING]`, or `[TITLE]` for anything that isn't a simple static screenshot.
4. **Actionable Direction:** Include intent (e.g., *"click Next"*, *"zoom to criteria box"*), which tells the post-production editor exactly where to add callouts or cursor highlights.

---

## 3. Phase 2: Screenshot & Asset Hygiene

How you capture and name your visual assets determines whether your editing workflow is effortless or plagued by errors.

### The "Image Sequence" Trap (Critical NLE Bug)
* **The Problem:** Video editing software (DaVinci Resolve, Premiere Pro) treats files with sequential numbering (e.g., `Image 001.jpg`, `Image 002.jpg`, `Image 003.jpg`) as single frames of a video sequence. When imported via XML, this results in immediate **"Media Offline"** errors.
* **The Solution:** Always use descriptive, semantic filenames:
  * ❌ `Image 001.jpg`, `Image 002.jpg`
  * ✅ `screen_rollup_summary.jpg`, `screen_label_desc.jpg`, `screen_fail_stamp.jpg`

### Resolution & Aspect Ratios
* **Target 16:9 Standard:** Capture screenshots at 1920x1080 (1080p) or 3840x2160 (4K).
* **Avoid Odd Crops:** Capturing arbitrary browser cutouts or square regions causes pillarboxing/letterboxing on modern displays. If an object is small, capture the full window and use pan/zoom inside DaVinci Resolve rather than cropping the raw image file.
* **UI Cleanliness:** Use dedicated demo environments with realistic, clean data. Avoid cluttered browser bookmark bars or extraneous browser tabs.

---

## 4. Phase 3: Audio Generation & Precise Timing Synchronization

A common point of failure in AI-assisted video editing is **audio timing drift**. 

### Lessons Learned: Why Estimations Fail
* Estimating scene durations using average word counts (e.g., *"150 words per minute"*) will always fail. Natural voice pauses, commas, periods, and breathing accumulate seconds of drift, causing visuals to trigger several seconds too early or too late.
* **The Fix: Audio-First Measurement:**
  1. Generate the voiceover first using neural TTS (like `edge-tts`).
  2. Measure the exact duration of each audio file down to the millisecond using audio libraries (like `mutagen`).
  3. Set the video clip length to match the real audio file length exactly.

### Automated Assembly via XML
Instead of manually cutting dozens of images to audio clips, use a Python generator (e.g., `build_timeline.py`) that exports a standard **Final Cut Pro 7 XML (`xmeml`)**:
* It places all audio clips sequentially on Audio Track 1.
* It places corresponding screenshots cut to the exact frame lengths on Video Track 1.
* It injects native, editable title cards on Video Track 2.
* When imported into DaVinci Resolve via **File > Import > Timeline**, the entire rough cut is assembled in seconds.

---

## 5. Phase 4: Motion Graphics & Diagrams (Replacing the Slop)

When a concept cannot be explained with a static screenshot (such as data relationships, code loops, or abstract features), avoid AI image generators. Instead, use clean, branded 2D motion graphics.

### The Infographic Approach:
* **Brand Consistency:** Use the project's official design system (e.g., Salesforce Lightning Design System - SLDS), matching brand colors, rounded card corners, and standard icon sets.
* **Code-Driven Motion (Remotion / Motion Canvas):**
  * Code-driven animation allows you to build reusable, mathematical diagrams (e.g., parent-child relationship flows where records visibly roll up into a counter).
  * Render these animations as standalone 1080p/4K MP4 clips and place them into the timeline just like any screenshot.
* **Why This Beats 3D/Unreal Engine:**
  * Software how-tos benefit from clarity, clean typography, and focus.
  * 3D game engines (Unreal Engine) add huge hardware overhead (requiring heavy GPUs, 32GB+ RAM) with minimal visual benefit for UI-focused education.
  * Lightweight 2D web-based motion graphics (Remotion) run on any laptop without specialized hardware.

---

## 6. Phase 5: The DaVinci Resolve Finishing Workflow

The AI engine gets you to an 80% rough cut in seconds. The final 20% is where human polish turns it into a high-quality production.

### Step-by-Step Finishing:
1. **Import the XML Blueprint:**
   * Go to **File > Import > Timeline...** and select `resolve_timeline.xml`.
   * Ensure "Automatically import source clips into media pool" is checked.
2. **Customize Native Titles:**
   * Because titles are generated as native XML text generators, click on the **Intro Title** or **End Credits** on Video Track 2.
   * In the **Inspector** panel, easily update fonts, brand colors, and team credits.
3. **Add Focus & Motion:**
   * Apply dynamic zoom or position keyframes on screenshots to guide the viewer’s eye toward specific form fields.
   * Add cursor pointers or callout boxes on important UI buttons.
4. **Human Voiceover Replacement:**
   * When final human narration is recorded by volunteers, drop the audio onto Audio Track 2.
   * Simply slide and re-trim the existing cuts to match the human speaker’s natural cadence.
5. **Master & Export:**
   * Navigate to the **Deliver** page.
   * Export using standard H.264 / YouTube 1080p or 4K presets.

---

## 7. Quick Volunteer & Editor Checklist

Before publishing or sharing a project, check off these standards:

- [ ] **No AI Humans/Deformed Graphics:** Visuals consist solely of authentic UI captures or intentional 2D infographic diagrams.
- [ ] **Descriptive Filenames:** Zero sequential filenames (e.g., no `Image 001.jpg`) to prevent sequence errors.
- [ ] **16:9 Aspect Ratio:** All assets fit the standard frame without accidental letterboxing.
- [ ] **Audio-Driven Timing:** Scene changes occur in harmony with the narration cues.
- [ ] **Editable Project Packaging:** Project files are contained in a unified folder structure (`assets/`, `config.json`, `build_timeline.py`) so any contributor can clone and re-run the build across Windows, macOS, or Linux.
