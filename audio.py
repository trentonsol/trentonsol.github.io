import pygame
import time
import threading
import tempfile
import os
from gtts import gTTS
import numpy as np

class SimpleRumbleAnnouncer:
    def __init__(self):
        pygame.mixer.init()
        
    def generate_simple_crowd(self, duration=5):
        """Generate a simple crowd noise using pygame"""
        sample_rate = 44100
        samples = int(duration * sample_rate)
        
        # Create brown noise (sounds more natural than white noise)
        brown_noise = np.zeros(samples)
        for i in range(1, samples):
            brown_noise[i] = brown_noise[i-1] + np.random.normal(0, 1)
        
        # Normalize
        brown_noise = brown_noise / np.max(np.abs(brown_noise))
        
        # Convert to 16-bit audio
        audio_data = (brown_noise * 32767).astype(np.int16)
        
        # Create stereo sound
        stereo_data = np.column_stack((audio_data, audio_data))
        
        return pygame.sndarray.make_sound(stereo_data)
    
    def generate_dramatic_tts(self):
        """Generate TTS with the characteristic drawn-out style"""
        # Break into segments for proper pacing - Michael Buffer style
        segments = [
            ("Ladies", True, 1.5),      # Slow and dramatic
            ("and gentlemen", True, 1.5), # Slow and dramatic  
            ("LET'S GET READY", False, 1.0), # Faster build-up
            ("TO RUMBLE!", False, 3.0)  # Extra long pause after "RUMBLE"
        ]
        
        audio_files = []
        
        for text, slow, pause_after in segments:
            print(f"Generating: '{text}' (slow: {slow}, pause: {pause_after}s)")
            
            # Generate TTS for each segment
            tts = gTTS(text=text, lang='en', slow=slow)
            
            # Save to temporary file
            with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as f:
                tts.save(f.name)
                audio_files.append((f.name, pause_after))
        
        return audio_files
    
    def play_announcement(self):
        """Play the full announcement sequence"""
        print("Starting rumble announcement...")
        
        # Load or generate crowd sound
        try:
            # Try to load actual crowd sound file
            crowd = pygame.mixer.Sound("crowd.wav")
            print("Loaded crowd.wav file")
        except FileNotFoundError:
            # Generate simple crowd noise
            print("Generating synthetic crowd noise...")
            crowd = self.generate_simple_crowd(duration=20)  # Longer duration
            print("Synthetic crowd noise generated")
        
        # Start crowd background
        crowd.play(loops=-1)  # Loop indefinitely
        crowd.set_volume(0.2)  # Start quiet
        
        print("Crowd sound started...")
        time.sleep(1)
        
        # Generate and play dramatic speech
        print("Generating dramatic speech segments...")
        audio_segments = self.generate_dramatic_tts()
        
        print("Playing announcement sequence...")
        
        # First segment - quiet crowd
        audio_file, pause_after = audio_segments[0]
        sound = pygame.mixer.Sound(audio_file)
        sound.play()
        print("▶ 'Ladies'")
        
        while pygame.mixer.get_busy():
            time.sleep(0.1)
        time.sleep(pause_after)
        os.unlink(audio_file)
        
        # Second segment - slightly louder crowd
        audio_file, pause_after = audio_segments[1]
        crowd.set_volume(0.3)
        sound = pygame.mixer.Sound(audio_file)
        sound.play()
        print("▶ 'and gentlemen'")
        
        while pygame.mixer.get_busy():
            time.sleep(0.1)
        time.sleep(pause_after)
        os.unlink(audio_file)
        
        # Third segment - building excitement
        audio_file, pause_after = audio_segments[2]
        crowd.set_volume(0.5)
        sound = pygame.mixer.Sound(audio_file)
        sound.play()
        print("▶ 'LET'S GET READY'")
        
        while pygame.mixer.get_busy():
            time.sleep(0.1)
        time.sleep(pause_after)
        os.unlink(audio_file)
        
        # Final segment - peak excitement
        audio_file, pause_after = audio_segments[3]
        crowd.set_volume(0.8)  # Loud crowd for "RUMBLE"
        sound = pygame.mixer.Sound(audio_file)
        sound.play()
        print("▶ 'TO RUMBLE!'")
        
        while pygame.mixer.get_busy():
            time.sleep(0.1)
        os.unlink(audio_file)
        
        # Hold the peak for a moment
        time.sleep(1)
        
        print("Fading out...")
        # Gradual fade out
        for vol in [0.6, 0.4, 0.2, 0.1, 0.05, 0]:
            crowd.set_volume(vol)
            time.sleep(0.3)
        
        crowd.stop()
        print("Announcement complete!")

# Alternative: Download a real crowd sound
def download_crowd_sound():
    """Optional: Use this function to download a real crowd sound"""
    try:
        import requests
        # Download a sample crowd sound (you can replace this URL with any crowd sound)
        url = "https://assets.mixkit.co/sfx/preview/mixkit-cheering-crowd-in-stadium-579.mp3"
        response = requests.get(url)
        with open("crowd.wav", "wb") as f:
            f.write(response.content)
        print("Downloaded crowd sound!")
    except ImportError:
        print("Install requests to download crowd sound: pip install requests")
    except Exception as e:
        print(f"Could not download crowd sound: {e}")

if __name__ == "__main__":
    # Uncomment the line below to try downloading a real crowd sound
    # download_crowd_sound()
    
    announcer = SimpleRumbleAnnouncer()
    announcer.play_announcement()