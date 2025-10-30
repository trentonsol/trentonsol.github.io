const audio = document.getElementById('backgroundMusic');
const countdown = document.querySelector('.stat .value-container .on-air-countdown');
const live = document.querySelector('.top-left-live');
const middleBar = document.querySelector('.middle-bar');
audio.volume = 0.3;
let startingSeconds = 5;
const BACKEND_ADDRESS = "https://cors-beta-pearl.vercel.app";


async function fetchFiles() {
  try {
    const res = await fetch(`${BACKEND_ADDRESS}/api/audio`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    // Check for network-level issues
    if (!res.ok) {
      throw new Error(`Server returned ${res.status} ${res.statusText}`);
    }

    // Try to parse JSON safely
    const data = await res.json();

    if (!data.files || !Array.isArray(data.files)) {
      throw new Error("Invalid response format — expected { files: [] }");
    }

    //console.log("Fetched files:", data.files);
    return data.files;
  } catch (error) {
    console.error("Failed to fetch files:", error.message);

    // Optional: user-friendly fallback behavior
    return [];
  }
}


// Function to run the countdown
function startCountdown(seconds = startingSeconds) {
    let timeLeft = seconds;
    let audioAddress = "";

    const timer = setInterval(async () => {
        const paddedTimeLeft = timeLeft.toString().padStart(2, '0');
        countdown.textContent = `0:${paddedTimeLeft}`;
        timeLeft--;

        if (timeLeft < 0) {
            clearInterval(timer);
            document.body.classList.remove("off-air");
            document.body.classList.add("on-air");
            live.style.display = "block";
            middleBar.style.display = "flex";
            const files = await fetchFiles();
            if (files == []) audioAddress = "";
            else audioAddress = `${BACKEND_ADDRESS}/${files[0]}`;
            console.log(audioAddress);
            audio.src = audioAddress;
            audio.loop = false;
            audio.play()
        }
    }, 1000);
}


// Start countdown after any user interaction
document.body.addEventListener('click', function () {
    startCountdown();
}, { once: true }); // Only trigger once

audio.addEventListener('ended', () => {
    document.body.classList.remove("on-air");
    document.body.classList.add("off-air");
    live.style.display = "none";
    middleBar.style.display = "none";
    startCountdown();
});