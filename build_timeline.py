import os
import json
import shutil
import subprocess
import sys

def install_dependencies():
    print("Checking dependencies...")
    try:
        import edge_tts
        import mutagen
        from PIL import Image
    except ImportError:
        print("Missing required libraries. Installing them automatically now...")
        subprocess.run([sys.executable, "-m", "pip", "install", "edge-tts", "mutagen", "Pillow"], check=True)
        print("Dependencies installed successfully!")

# Ensure dependencies are installed before importing them
install_dependencies()
from mutagen.mp3 import MP3

def build():
    # 1. Setup paths
    template_dir = os.path.dirname(os.path.abspath(__file__))
    assets_dir = os.path.join(template_dir, "assets")
    output_dir = os.path.join(template_dir, "Output_Package")
    config_path = os.path.join(template_dir, "config.json")

    # Clean output dir
    if os.path.exists(output_dir):
        shutil.rmtree(output_dir)
    os.makedirs(output_dir)

    # 2. Load Config
    with open(config_path, "r", encoding="utf-8") as f:
        config = json.load(f)

    project_name = config.get("project_name", "Auto Video")
    intro_dur_sec = config.get("intro_duration_seconds", 5)
    intro_title = config.get("intro_title", "Video Title")
    intro_bg_name = config.get("intro_background", "")
    end_credits_sec = config.get("end_credits_duration_seconds", 10)
    end_credits_text = config.get("end_credits_text", "Credits")
    # FCP XML needs specific newline encoding for text generators
    end_credits_text = end_credits_text.replace("\n", "&#13;")
    segments = config.get("segments", [])

    fps = 30
    current_frame = 0

    video_clips_xml = ""
    audio_clips_xml = ""
    text_clips_xml = ""

    # 3. Intro Title
    if intro_dur_sec > 0:
        intro_dur = intro_dur_sec * fps
        
        # Copy background if provided
        if intro_bg_name:
            src_bg = os.path.join(assets_dir, intro_bg_name)
            dest_bg = os.path.join(output_dir, intro_bg_name)
            if os.path.exists(src_bg):
                shutil.copy(src_bg, dest_bg)
            
            bg_url = f"file://localhost/{dest_bg.replace(os.sep, '/').replace(' ', '%20')}"
            video_clips_xml += f'''
          <clipitem id="title_bg">
            <name>{intro_bg_name}</name>
            <duration>{intro_dur}</duration>
            <rate><timebase>30</timebase><ntsc>FALSE</ntsc></rate>
            <start>0</start>
            <end>{intro_dur}</end>
            <in>0</in>
            <out>{intro_dur}</out>
            <file id="f_title_bg">
              <name>{intro_bg_name}</name>
              <pathurl>{bg_url}</pathurl>
              <rate><timebase>30</timebase><ntsc>FALSE</ntsc></rate>
              <duration>864000</duration>
              <media><video><samplecharacteristics><width>1920</width><height>1080</height></samplecharacteristics></video></media>
            </file>
          </clipitem>'''

        # Track 2 Text generator
        text_clips_xml += f'''
          <generatoritem id="text_intro">
            <name>Intro Title</name>
            <duration>{intro_dur}</duration>
            <rate><timebase>30</timebase><ntsc>FALSE</ntsc></rate>
            <start>0</start>
            <end>{intro_dur}</end>
            <in>0</in>
            <out>{intro_dur}</out>
            <effect>
              <name>Text</name>
              <effectid>Text</effectid>
              <effectcategory>Text</effectcategory>
              <effecttype>generator</effecttype>
              <mediatype>video</mediatype>
              <parameter>
                <parameterid>str</parameterid>
                <name>Text</name>
                <value>{intro_title}</value>
              </parameter>
            </effect>
          </generatoritem>'''
          
        current_frame += intro_dur

    # 4. Segments
    for i, seg in enumerate(segments):
        audio_name = f"seg_{i}.mp3"
        dest_audio = os.path.join(output_dir, audio_name)
        
        print(f"Generating audio for segment {i}...")
        cmd = [
            "python", "-m", "edge_tts",
            "--text", seg["text"],
            "--voice", "en-US-ChristopherNeural",
            "--write-media", dest_audio
        ]
        subprocess.run(cmd, check=True)
        
        audio = MP3(dest_audio)
        dur_frames = int(audio.info.length * fps)
        a_url = f"file://localhost/{dest_audio.replace(os.sep, '/').replace(' ', '%20')}"
        
        audio_clips_xml += f'''
          <clipitem id="audio_{i}">
            <name>{audio_name}</name>
            <duration>{dur_frames}</duration>
            <rate><timebase>30</timebase><ntsc>FALSE</ntsc></rate>
            <start>{current_frame}</start>
            <end>{current_frame + dur_frames}</end>
            <in>0</in>
            <out>{dur_frames}</out>
            <file id="fa_{i}">
              <name>{audio_name}</name>
              <pathurl>{a_url}</pathurl>
              <media><audio><samplecharacteristics><samplerate>48000</samplerate><depth>16</depth></samplecharacteristics><channelcount>1</channelcount></audio></media>
            </file>
          </clipitem>'''
        
        imgs = seg.get("images", [])
        if imgs:
            frames_per = dur_frames // len(imgs)
            for j, img in enumerate(imgs):
                src_img = os.path.join(assets_dir, img)
                dest_img = os.path.join(output_dir, img)
                if os.path.exists(src_img):
                    shutil.copy(src_img, dest_img)
                else:
                    print(f"WARNING: Image {img} not found in assets folder!")
                    
                start_f = current_frame + (j * frames_per)
                end_f = start_f + frames_per
                if j == len(imgs) - 1:
                    end_f = current_frame + dur_frames
                    
                dur_f = end_f - start_f
                v_url = f"file://localhost/{dest_img.replace(os.sep, '/').replace(' ', '%20')}"
                
                video_clips_xml += f'''
          <clipitem id="v_{i}_{j}">
            <name>{img}</name>
            <duration>{dur_f}</duration>
            <rate><timebase>30</timebase><ntsc>FALSE</ntsc></rate>
            <start>{start_f}</start>
            <end>{end_f}</end>
            <in>0</in>
            <out>{dur_f}</out>
            <file id="fv_{i}_{j}">
              <name>{img}</name>
              <pathurl>{v_url}</pathurl>
              <rate><timebase>30</timebase><ntsc>FALSE</ntsc></rate>
              <duration>864000</duration>
              <media><video><samplecharacteristics><width>1920</width><height>1080</height></samplecharacteristics></video></media>
            </file>
          </clipitem>'''
        
        current_frame += dur_frames

    # 5. End Credits
    if end_credits_sec > 0:
        current_frame += 30  # 1 second gap (fade to black)
        end_dur = end_credits_sec * fps
        
        text_clips_xml += f'''
          <generatoritem id="text_end">
            <name>End Credits</name>
            <duration>{end_dur}</duration>
            <rate><timebase>30</timebase><ntsc>FALSE</ntsc></rate>
            <start>{current_frame}</start>
            <end>{current_frame + end_dur}</end>
            <in>0</in>
            <out>{end_dur}</out>
            <effect>
              <name>Text</name>
              <effectid>Text</effectid>
              <effectcategory>Text</effectcategory>
              <effecttype>generator</effecttype>
              <mediatype>video</mediatype>
              <parameter>
                <parameterid>str</parameterid>
                <name>Text</name>
                <value>{end_credits_text}</value>
              </parameter>
            </effect>
          </generatoritem>'''
          
        current_frame += end_dur

    # 6. Generate XML
    xml = f'''<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE xmeml>
<xmeml version="5">
  <project>
    <name>{project_name}</name>
    <children>
      <sequence id="seq1">
        <name>{project_name} Timeline</name>
        <duration>{current_frame}</duration>
        <rate><timebase>30</timebase><ntsc>FALSE</ntsc></rate>
        <media>
          <video>
            <format><samplecharacteristics><rate><timebase>30</timebase><ntsc>FALSE</ntsc></rate><width>3840</width><height>2160</height></samplecharacteristics></format>
            <track>{video_clips_xml}</track>
            <track>{text_clips_xml}</track>
          </video>
          <audio>
            <format><samplecharacteristics><depth>16</depth><samplerate>48000</samplerate></samplecharacteristics></format>
            <track>{audio_clips_xml}</track>
          </audio>
        </media>
      </sequence>
    </children>
  </project>
</xmeml>'''

    xml_path = os.path.join(output_dir, "resolve_timeline.xml")
    with open(xml_path, "w", encoding="utf-8") as f:
        f.write(xml)
        
    print(f"Success! Project packaged in {output_dir}")
    print(f"Import resolve_timeline.xml into DaVinci Resolve to begin editing.")

if __name__ == "__main__":
    build()
