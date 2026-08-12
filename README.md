# Auto Resolve Video Template

This template allows you to automatically generate a fully-synced DaVinci Resolve timeline from a text script and a folder of screenshots!

## Setup

1. Make sure you have Python installed.
2. Install the requirements:
   ```bash
   pip install -r requirements.txt
   ```

## How to Make a New Video

1. **Add Your Images:** Drop all your screenshots and background images into the `assets/` folder.
2. **Write Your Script:** Open `config.json` in any text editor.
   - Set your `project_name` and `intro_title`.
   - Under `segments`, type out the voiceover text for each scene, and list the exact filenames of the images you want to appear during that scene.
3. **Run the Packager:**
   ```bash
   python build_timeline.py
   ```
4. **Import:** The script will create a new folder called `Output_Package`. Open DaVinci Resolve, go to **File > Import > Timeline...** and select `resolve_timeline.xml`.

Your entire video will be instantly assembled on the timeline, with high-quality neural voiceovers and editable text titles!
