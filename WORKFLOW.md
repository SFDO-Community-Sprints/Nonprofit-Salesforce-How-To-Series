# Optimal Workflow: Script → Screenshots → Resolve Timeline → Finished Video

This is the end-to-end process we settled on for the Nonprofit Salesforce How-To Series after several
iterations. It records what to do **and what we learned not to do**, so a new editor (or an AI
assistant such as Claude Code or Antigravity) can follow it without repeating our mistakes.

> **Status key used below**
> ✅ Verified working in our project · ⚠️ Works but has caveats · 🚧 Not built yet / manual

---

## 1. The pipeline at a glance

```mermaid
flowchart LR
    A[Two-column script<br/>Audio | Visuals] --> B[Capture + name<br/>screenshots]
    B --> C[Fill in config.json]
    C --> D[python build_timeline.py]
    D --> E[Output_Package<br/>mp3s + images + XML]
    E --> F[Import XML<br/>into DaVinci Resolve]
    G[Optional: Remotion<br/>animated diagrams] -.manual.-> F
    F --> H[Edit titles, add cursor/<br/>callouts, replace voice]
    H --> I[Deliver: MP4]
```

| Step | Who/what does it | Status |
|---|---|---|
| Write script and screen prompts | Human (Google Doc) | ✅ |
| Capture and rename screenshots | Human | ✅ |
| Generate voiceover (neural TTS) | `build_timeline.py` via `edge-tts` | ✅ |
| Cut images to voiceover length, build XML | `build_timeline.py` | ✅ |
| Editable intro title + end credits | Generated into the XML as text generators | ✅ |
| Animated diagrams (e.g. rollup flow) | Remotion → MP4 → placed manually in Resolve | ⚠️ |
| Mouse-cursor and typing animation | Human in Resolve (or real screen recording) | 🚧 |
| Final voice (human recording) | Human, replaces TTS audio in Resolve | 🚧 |
| Color, fonts, export | Human in Resolve | ✅ |

---

## 2. Tools to install

| Tool | Needed for | Notes |
|---|---|---|
| **Python 3.9+** | `build_timeline.py` | Tick "Add Python to PATH" on Windows. |
| **DaVinci Resolve** (free or Studio) | Editing and export | Install can be slow with Studio "all options" ticked; the extras are not needed. |
| `edge-tts`, `mutagen`, `Pillow` | Voiceover and audio lengths | `build_timeline.py` installs these automatically on first run (or `pip install -r requirements.txt`). |
| **Node.js LTS** | *Only* for the animated diagrams | Skip if you are not making Remotion graphics. |

Not needed: FFmpeg. Remotion renders without a separate FFmpeg install (confirmed on our machine),
and the template only reads MP3 lengths through `mutagen`.

Internet is required while generating the voiceover (`edge-tts` calls an online service).

**Hardware:** for 1080p–2K timelines made of stills and audio, a modern laptop with 16 GB RAM and a
4 GB GPU is plenty. Keep project files on an SSD. No special monitor is required to render 2K/4K.

---

## 3. Step-by-step

### Step 1: Write the script as a two-column table

Use a Google Doc table: **Audio** (what is spoken) on the left, **Visuals** (what is on screen) on the right.

Rules that made the rest of the pipeline work:

- **One row = one segment** in `config.json`. Keep rows to a few sentences.
- **Name the exact screenshot file** in the Visuals cell, e.g. `screen_rollup_summary.jpg`.
- If a row needs several screenshots, list them in order. The template divides the row's time evenly among them.
- Mark anything that is **not a screenshot** (diagram, title card, screen recording) with a clear label such as
  `[GRAPHIC] parent-child rollup diagram`, so it is not forgotten.
- State style constraints in the doc (for us: **no AI-generated people**, real screenshots only, flat infographic look).
- Say what should happen on screen, not just which image: "type the label, then click Next" is something an editor can act on.

### Step 2: Capture and name screenshots

- Capture at the highest practical resolution and crop consistently. 16:9 fills the frame best. Odd shapes
  (e.g. nearly square) will be letterboxed unless you scale them in Resolve.
- Put every file in `assets/`.
- ⚠️ **Do not use sequential numbered names** like `Image 001.jpg`, `Image 002.jpg`.
  Resolve treats these as a single *image sequence* and shows **Media Offline**.
  Use descriptive names: `screen_label_desc.jpg`, `screen_fail_stamp.jpg`.
- Add a title background (e.g. the series cloud card) and reference it as `intro_background`.

### Step 3: Fill in `config.json`

```json
{
  "project_name": "What Is DLRS",
  "intro_duration_seconds": 5,
  "intro_title": "What Is DLRS?",
  "intro_background": "title_background.jpg",
  "end_credits_duration_seconds": 10,
  "end_credits_text": "CREDITS\nDirector: Jane Doe\nWriter: John Smith",
  "segments": [
    { "text": "Narration for scene one…", "images": ["screen_intro_tabs.jpg"] },
    { "text": "Narration for scene two…", "images": ["a.jpg", "b.jpg", "c.jpg"] }
  ]
}
```

Replace the credits with the real people and roles from the production.

### Step 4: Build the timeline

```bash
python build_timeline.py
```

What the script does, in order:

1. Installs missing Python packages if needed.
2. Reads `config.json`.
3. Calls `edge-tts` for each segment (voice `en-US-ChristopherNeural`) → `seg_N.mp3`.
4. Measures each MP3's real length with `mutagen` and converts it to frames at 30 fps.
5. Splits that duration evenly across the segment's images.
6. Copies everything into a fresh `Output_Package/` folder.
7. Writes `resolve_timeline.xml`: intro background + editable title (Video 2), image track (Video 1),
   voiceover (Audio 1), a 1-second gap, then editable end credits.

Because durations come from the real audio, scenes stay locked to the voice. This replaced earlier attempts that
estimated timing from word counts and drifted by several seconds.

### Step 5: Import into DaVinci Resolve

1. New, empty project.
2. **File → Import → Timeline…** and choose `Output_Package/resolve_timeline.xml`.
3. Select the **Intro Title** / **End Credits** clips on Video 2 and edit text, font and color in the **Inspector**.

### Step 6 (optional): Animated diagrams with Remotion ⚠️

For concepts a screenshot cannot explain, we render a short silent clip and place it on the timeline by hand.

`motion_graphics/RollupDiagram.tsx` is a 1080p, 18-second "How a DLRS rollup works" animation:
a Contact (parent) card, five Campaign Member (child) cards, and records flowing into a
`Total Events Attended` count (0 → 3), with a step tracker matching the four script steps.

To render it:

1. Create or open a Remotion project (`npx create-video@latest --blank`).
2. Copy `RollupDiagram.tsx` into its `src/`.
3. Register it in your composition file:
   `<Composition id="RollupDiagram" component={RollupDiagram} durationInFrames={540} fps={30} width={1920} height={1080} />`
4. Preview with `npm start`; render with `npx remotion render RollupDiagram out/rollup_diagram.mp4`.
5. Import the MP4 into Resolve's Media Pool and place it over the matching narration segment.

Note: `npm run build` in a default Remotion project only *bundles*. Use `npx remotion render` to produce the MP4.

Caveats: the clip is a fixed 18 s and is **not** synced to the narration automatically. Trim or retime it in
Resolve. Children, statuses, colors and step timings are constants at the top of the file.

### Step 7: Add motion that the script prompts call for 🚧

Cursor movement, typing into fields and the FAIL stamp are done **in Resolve** (or with a real screen recording).
We tried generating cursor and typing animation in code over static screenshots; keeping coordinates, text size and
timing aligned was fragile and cost many iterations, so the template deliberately stops at the cut.

### Step 8: Replace the voice 🚧

The TTS voice is a placeholder. To use a human voice, record each segment, lay it over the timeline,
and re-trim the image cuts to the new lengths. The template does not yet regenerate the XML from human recordings.

### Step 9: Export

Resolve **Deliver** page → pick the YouTube/H.264 preset at 1080p (or higher) → Add to Render Queue → Render.

---

## 4. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| **Media Offline** on images | Sequential filenames grouped as a sequence | Rename files (Step 2), re-run the script, re-import. |
| **Media Offline** after moving the folder | The XML stores absolute file paths | Re-run `build_timeline.py` where the files now live, or use *Relink Selected Clips*. |
| Titles show a default font | XML text generators carry no styling | Set font/size/color in the Inspector. |
| `edge-tts` errors or empty audio | No internet, or the online service changed | Check connection; the service is unofficial and may change without notice. |
| `python` not found | Windows PATH, or macOS/Linux use `python3` | Reinstall with PATH ticked; on macOS/Linux see the note below. |
| Images look letterboxed | Source not 16:9 | Crop the screenshot or scale it in Resolve. |

---

## 5. Honest limitations

- ⚠️ **Mac/Linux is untested.** The script should be portable, but two things are Windows-leaning:
  it launches the voice generator with the literal command `python` (many macOS/Linux systems only have `python3`),
  and the file URLs in the XML are written in a Windows-drive style that Resolve may not accept elsewhere.
  Treat cross-platform support as *expected, not confirmed* until someone has run it.
- Voice is hard-coded to one English voice; change it in `build_timeline.py`.
- Images within a segment are split evenly, not matched to individual sentences.
- The "show the next screen about a second after the narration starts" behaviour is not implemented;
  a segment's first image appears exactly when its audio begins.
- `config.json` accepts images only, not video clips. Diagram MP4s are placed manually.

---

## 6. Repository layout

```
Resolve_Template/
├── WORKFLOW.md          ← this document
├── README.md            ← quick start
├── build_timeline.py    ← voiceover + timeline generator
├── config.json          ← script and image mapping (edit this)
├── requirements.txt
├── assets/              ← screenshots and backgrounds
├── motion_graphics/     ← Remotion diagram source (optional)
└── Output_Package/      ← generated, git-ignored
```

## 7. Ideas queued for later

- Let `config.json` reference video clips (e.g. rendered diagrams) as well as stills.
- Fix the cross-platform issues above and test on macOS and Linux.
- Per-sentence image timing from word-level timestamps.
- Sync diagram beats to the narration using the segment durations.
- A "swap in human recordings" mode.
