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

## Formatting the Script (config.json)

The `config.json` file is where you feed the AI both your voiceover text and the timing for your screenshots. 

For each "scene" in your video, you create a segment block. The Python script will **automatically generate the high-quality neural voiceover audio** for whatever text you type, and then it will perfectly time the images you list to match the duration of that audio!

Here is how to format a segment:
```json
{
  "text": "This is the text the AI voiceover will read out loud for this specific scene.",
  "images": [
    "screenshot_1.jpg", 
    "screenshot_2.jpg"
  ]
}
```
*Note: If you list multiple images in a single segment (like above), the Python script will automatically divide the screen time evenly between them while the voiceover plays!*

Your entire video will be instantly assembled on the timeline, with high-quality neural voiceovers and editable text titles!
