const audio = document.getElementById('backgroundMusic');
const countdown = document.querySelector('.stat .value-container .on-air-countdown');
const live = document.querySelector('.top-left-live');
const middleBar = document.querySelector('.middle-bar');
const middleBarName = document.querySelector('.middle-bar .name');
const middleBarTitle = document.querySelector('.middle-bar .title');
const nextText = document.querySelector('.next-bar .next-text');
const onAirText = document.querySelector('.on-air-bar .on-air-text');
const trending = document.querySelector('.footer-bar .trending-data');
const spotlight = document.querySelector('.footer-bar .spotlight-data');
const news = document.querySelector('.footer-bar .news-data');
const totalStories = document.querySelector('.stats .total-stories');
const queuedStories = document.querySelector('.stats .queued-stories');
const voicedStories = document.querySelector('.stats .voiced-stories');
const pfi = document.querySelector('.stats .pfi');
const totalOnAir = document.querySelector('.stats .total-on-air');
audio.volume = 0.3;
const startingSeconds = 60 * 10;
const updateInterval = 60000 // 1 minute
const BACKEND_ADDRESS = "https://cors-beta-pearl.vercel.app";
const AUDIOS_ADDRESS = "https://pub-69f145390fd84c658e8a0fad0e65e3b5.r2.dev"
// Your playlist — an array of file URLs
const playlist = [
  "audios/background_audio_001.mp3",
  "audios/background_audio_002.mp3",
  "audios/background_audio_003.mp3",
  "audios/background_audio_004.mp3",
  "audios/background_audio_005.mp3",
  "audios/background_audio_006.mp3",
  "audios/background_audio_007.mp3",
  "audios/background_audio_008.mp3",
  "audios/background_audio_009.mp3",
  "audios/background_audio_010.mp3",
  "audios/background_audio_011.mp3",
  "audios/background_audio_012.mp3",
  "audios/background_audio_013.mp3",
  "audios/background_audio_014.mp3",
  "audios/background_audio_015.mp3",
  "audios/background_audio_016.mp3",
  "audios/background_audio_017.mp3",
  "audios/background_audio_018.mp3",
  "audios/background_audio_019.mp3",
];
let currentIndex = 2;


function getTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Pad with zeros so that each part is always two digits
  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  //const ss = String(seconds).padStart(2, "0");

  return `${hh}:${mm}`;
}


async function fetchData(endpoint) {
  try {
    const res = await fetch(`${BACKEND_ADDRESS}/api/${endpoint}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    // Check for network-level issues
    if (!res.ok) {
      throw new Error(`Server returned ${res.status} ${res.statusText}`);
    }

    // Try to parse JSON safely
    const data = await res.json();

    if (Object.hasOwn(data, "error")) {
      throw new Error("Error fetching data!!!");
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch files:", error.message);

    // Optional: user-friendly fallback behavior
    return [];
  }
}

async function init() {
  return await fetchData("init");
}

async function getData() {
  return await fetchData("data");
}

function setStatsData(statsData) {
  totalStories.textContent = statsData.total;
  queuedStories.textContent = statsData.queued;
  voicedStories.textContent = statsData.voiced;
  pfi.textContent = statsData.pfi;
  totalOnAir.textContent = getTime(parseInt(statsData.totalOnAir));
}

function setAudioData(audioData) {
  middleBarName.textContent = audioData.country ? `${audioData.name}, ${audioData.country}` : `${audioData.name}`;
  middleBarTitle.textContent = `${audioData.title}`;
  onAirText.textContent = `${audioData.name}, ${audioData.country} — ${audioData.title}`;
  audio.src = `${AUDIOS_ADDRESS}/${audioData.audio}`;
  audio.loop = false;
  audio.play()
}

function setNextUpData(nextUpData) {
  nextText.textContent = `${nextUpData.name} — ${nextUpData.title}`;
}

function setFooterData(data, htmlElem) {
  if (data[0]) htmlElem.textContent = data[0];
  for (let i = 1; i < data.length; i++) {
    htmlElem.insertAdjacentHTML('beforeend', '<span class="separator"> | </span>');
    htmlElem.insertAdjacentText('beforeend', data[i]);
  }
}

// Function to run the countdown
function startCountdown(seconds = startingSeconds) {
  let timeLeft = seconds;

  const timer = setInterval(async () => {
    timeLeft -= Math.floor(updateInterval / 1000);
    countdown.textContent = getTime(timeLeft);

    if (timeLeft <= 0) {
      clearInterval(timer);
      document.body.classList.remove("off-air");
      document.body.classList.add("on-air");
      live.style.display = "block";
      middleBar.style.display = "flex";
      const data = await getData();
      if (!Object.hasOwn(data, "error")) {
        setNextUpData(data.nextUp)
        setStatsData(data.stats);
        setFooterData(data.footerData.trending, trending)
        setFooterData(data.footerData.spotlight, spotlight)
        setFooterData(data.footerData.news, news)
        setAudioData(data.audioData)

      }
    }
  }, updateInterval);
}


// Start countdown after any user interaction
document.body.addEventListener('click', async function () {
  audio.src = playlist[currentIndex];
  audio.loop = false;
  audio.play()
  const initData = await init();
  if (!Object.hasOwn(initData, "error")) {
    countdown.textContent = getTime(startingSeconds);
    setStatsData(initData.stats);
    setNextUpData(initData.nextUp)
    startCountdown();
  }
}, { once: true }); // Only trigger once

audio.addEventListener('ended', () => {
  // If the ended event was triggered by the end of the person speaking
  // then update the styles and the restart the countdown
  if (!audio.src.includes(playlist[currentIndex])) {
    document.body.classList.remove("on-air");
    document.body.classList.add("off-air");
    live.style.display = "none";
    middleBar.style.display = "none";
    onAirText.textContent = ""
    countdown.textContent = getTime(startingSeconds);
    startCountdown();
  }
  // Play the next background music
  currentIndex = (currentIndex + 1) % playlist.length;  // wrap around
  console.log(`current index: ${currentIndex}`);
  console.log(`audio.src: ${audio.src}`);
  audio.src = playlist[currentIndex];
  audio.play();
});