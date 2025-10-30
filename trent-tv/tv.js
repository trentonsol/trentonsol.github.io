const audio = document.getElementById('backgroundMusic');
const countdown = document.querySelector('.stat .value-container .on-air-countdown');
const live = document.querySelector('.top-left-live');
const middleBar = document.querySelector('.middle-bar');
const middleBarName = document.querySelector('.middle-bar .name');
const middleBarTitle = document.querySelector('.middle-bar .title');
const nextText = document.querySelector('.next-bar .next-text');
const trending = document.querySelector('.footer-bar .trending-data');
const spotlight = document.querySelector('.footer-bar .spotlight-data');
const news = document.querySelector('.footer-bar .news-data');
const totalStories = document.querySelector('.stats .total-stories');
const queuedStories = document.querySelector('.stats .queued-stories');
const voicedStories = document.querySelector('.stats .voiced-stories');
const pfi = document.querySelector('.stats .pfi');
const totalOnAir = document.querySelector('.stats .total-on-air');

audio.volume = 0.3;
let startingSeconds = 5;
const BACKEND_ADDRESS = "https://cors-beta-pearl.vercel.app";

/*######################## DUMMY DATA #################*/
const audioData = {
    "id": 1,
    "audio": "voice_001.mp3",
    "name": "Alice Johnson",
    "age": 28,
    "country": "United States",
    "title": "The Silent Algorithm"
  };
const nextUp = {
    name: "Filipe Daniel",
    title: "How I lost 120k"
};
const footerData = {
    "trending": ["The Clockmaker’s Secret", "Frozen Echoes", "The Lantern Keeper"],
    "spotlight": ["The River That Remembered", "The Painter of Shadows", "The Sandstorm Prophecy"],
    "news": [
      "‘The Clockmaker’s Secret’ Reaches One Million Streams",
      "‘Frozen Echoes’ Wins Northern Writers Award",
      "New Exhibit Explores Time and Memory in Storytelling"
    ]
  };
const stats = {
    "total": "100",
    "queued": "50",
    "voiced": "50",
    "pfi": "28",
    "totalOnAir": "500:00",
  };
/*####################################################*/


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

function addFooterData (data, htmlElem) {
  if (data[0]) htmlElem.textContent = data[0];
  for (let i = 1; i < data.length; i++) {
    htmlElem.insertAdjacentHTML('beforeend', '<span class="separator"> | </span>');
    htmlElem.insertAdjacentText('beforeend', data[i]);
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
            middleBarName.textContent = `${audioData.name}, ${audioData.age}, ${audioData.country}`;
            middleBarTitle.textContent = `${audioData.title}`;
            nextText.textContent = `${nextUp.name} — ${nextUp.title}`;
            totalStories.textContent = stats.total;           
            queuedStories.textContent = stats.queued;
            voicedStories.textContent = stats.voiced;
            pfi.textContent = stats.pfi;
            totalOnAir.textContent = stats.totalOnAir;
            addFooterData(footerData.trending, trending)
            addFooterData(footerData.spotlight, spotlight)
            addFooterData(footerData.news, news)
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