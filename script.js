// === Configuration ===
const images = [
    'images/trent-regular-day.png',
    'images/trent-meets-crypto.png',
    'images/trent-going-berserk-v2.png',
];


const normie = [
`The Normie Years`,
`Before the charts and Discord pings, TRENT was just another guy mistaking “content” for “comfortable.” His days ran on autopilot: alarm, cereal, Teams, repeat. The office coffee machine changing flavor pods counted as excitement.

Then one morning, he overheard coworkers whispering about Bitcoin. They weren’t experts, just lucky and loud. Still, something flickered inside him. The way they talked about freedom and getting in early felt like a language he wanted to learn. For the first time in years, TRENT felt awake.`
]

const investor = [
`The Fundamental Awakening`,
`Bitcoin. Ethereum. Decentralization. The words washed over TRENT like holy water. 
He read whitepapers like scripture, watched Vitalik interviews before bed, and tweeted HODL with zeal. For a while, it worked, his portfolio glowed, his confidence soared. TRENT wasn’t just investing, he was living the future.

But the charts stopped moving, and so did his pulse. Bitcoin crawled, Ethereum fees stung, and the thrill faded. He missed the chaos, the rush, the unknown. Then one day, his normie friend leaned in and whispered, “Bro, you ever heard of the Solana trenches?”`
]

const degen = [
`The Trenches of Delusion`,
`Gone were the whitepapers; now it was frog-faced meme coins, all-caps group chats, and liquidity pools that vanished faster than his self-control. Fundamentals were out, vibes were in. He spoke in tongues: “Wen Lambo?” “Did you ape?” “Bro, check this presale.” Sleep was for those who didn’t believe in generational wealth.

Days blurred into caffeine, charts, and the collective delusion of “this one’s gonna 100x.” His portfolio looked like a digital graveyard, but his faith never wavered. Each morning he swore, “This is the one,” and each night, broke but hopeful, he’d whisper to his screen, “Tomorrow we print.”`
]



const descriptions = [normie, investor, degen]

const changeInterval = 5000; // 5 seconds

isPaused = null;

// === Logic ===
let currentIndex = 0;
const hero = document.querySelector('.hero');
const dots = document.querySelectorAll('.dot');
const title = document.getElementById('title');
const desc = document.getElementById('description');
const toggle = document.getElementById('toggle');

// Set initial image
hero.style.backgroundImage = `url(${images[currentIndex]})`;

// Set initial description
title.textContent = descriptions[currentIndex][0];
desc.textContent = descriptions[currentIndex][1];



function changeSlide(index) {
  currentIndex = index;
  hero.style.backgroundImage = `url(${images[currentIndex]})`;
  
  // Remove and re-add the animation class to restart the animation
  title.classList.remove('fade-in');
  desc.classList.remove('fade-in');
  void desc.offsetWidth; // This forces a reflow so the animation restarts
  title.classList.add('fade-in');
  desc.classList.add('fade-in');
  
  title.textContent = descriptions[currentIndex][0];
  desc.textContent = descriptions[currentIndex][1];
  
  

  // Update dots
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentIndex);
  });
}

// Allow clicking on dots
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => changeSlide(index));
});


// Set up toggle
toggle.addEventListener('click', () => {
    isPaused = !isPaused
    if (isPaused) {
        toggle.classList.remove('fa-circle-pause');
        toggle.classList.add('fa-circle-play');
    } else {
        toggle.classList.add('fa-circle-pause');
        toggle.classList.remove('fa-circle-play');
    }
});

// Auto change
setInterval(() => {
    if (!isPaused) {
        currentIndex = (currentIndex + 1) % images.length;
        changeSlide(currentIndex);
    }
}, changeInterval);

