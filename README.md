# DaVinci Resolve AI Video Template

This template acts as an automated "video factory" that transforms a simple text script into a fully-synced, professional DaVinci Resolve timeline with high-quality neural voiceovers and editable titles!

## How It Works (The AI Engine)
This repository contains a powerful Python engine (`build_timeline.py`) that handles the heavy lifting of video editing automatically. 

When run directly, or when triggered by an AI coding assistant (like Claude Code, Antigravity, or GitHub Copilot), the script will:
1. **Read your script** from the `config.json` file.
2. **Generate high-quality robot voiceovers** by connecting to Microsoft's neural Edge TTS service, downloading perfectly narrated `.mp3` files for every scene.
3. **Calculate frame-perfect timing** based on the exact length of the generated audio.
4. **Distribute your screenshots** evenly across the screen time of each voiceover segment.
5. **Compile a DaVinci Resolve XML file** containing your images, the generated audio, and natively editable text graphics for your intro and credits.

You can have an AI assistant run this for you by simply asking: *"Check my PC, ensure the video template tools are installed, and run the packager for me."*

---

## Step 1: Getting the Tools Installed
Before you can generate a video, you need to ensure your environment is set up.

1. **Install Python:** Download and install Python from [python.org](https://www.python.org/downloads/). Ensure you check the box that says "Add Python to PATH" during installation.
2. **Install DaVinci Resolve:** Download the free version or Studio version of [DaVinci Resolve](https://www.blackmagicdesign.com/products/davinciresolve).
3. **Install the Python Dependencies:** Open your terminal (PowerShell, Command Prompt, or Terminal) in this folder and run:
   ```bash
   pip install -r requirements.txt
   ```
   *(This installs `edge-tts` for the voiceovers, `mutagen` for calculating audio lengths, and `Pillow` for image handling).*

---

## Step 2: Crafting the Video Script (config.json)
You control the entire video generation process through one simple file: `config.json`. 

1. **Prepare your assets:** Gather all the screenshots you want to use and a background image for your title screen. Place them all inside the `assets/` folder.
2. **Open `config.json`** in any text editor (like Notepad, VS Code, or Sublime Text).
3. **Set the Meta Information:**
   - `"project_name"`: The name of your timeline in Resolve.
   - `"intro_title"`: The text that will appear on your editable title screen.
   - `"intro_background"`: The exact filename of the background image you put in `assets/`.
   - `"end_credits_text"`: The names and roles of the production team.
4. **Write the Segments:**
   The `segments` array is where the magic happens. For each "scene", create a block like this:
   ```json
   {
     "text": "This is the text the AI voiceover will read out loud for this specific scene.",
     "images": [
       "screenshot_1.jpg", 
       "screenshot_2.jpg"
     ]
   }
   ```
   - `"text"`: The script for this exact scene. The Python script will turn this into an MP3.
   - `"images"`: A list of the image filenames from your `assets/` folder. If you list multiple images, the script will automatically divide the screen time evenly between them while the voiceover plays!

---

## Step 3: Running the Packager
Once your images are in the `assets/` folder and your `config.json` is saved:

1. Open your terminal in this repository folder.
2. Run the script:
   ```bash
   python build_timeline.py
   ```
3. Watch the terminal as it contacts the TTS service, downloads your audio, and builds your timeline!

---

## Step 4: Importing into DaVinci Resolve
When the Python script finishes, it will create a brand new folder called `Output_Package` containing your audio, images, and a file called `resolve_timeline.xml`.

1. Open DaVinci Resolve and create a new, empty project.
2. In the top menu, go to **File > Import > Timeline...**
3. Navigate to the `Output_Package` folder and select `resolve_timeline.xml`.
4. Your entire video will instantly load onto the timeline!
5. **Editing Titles:** You will notice your Intro Title and End Credits are on Video Track 2. Because these are native FCP XML generators, you can simply click on them in Resolve, open the Inspector panel, and change the font, color, or text natively without having to regenerate the video!
