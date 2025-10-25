// === Configuration ===
const images = [
    'images/trent-regular-day.png',
    'images/trent-meets-crypto.png',
    'images/trent-going-berserk-v2.png',
];

const descriptions = [
    'He’s always one hype coin away from a life-changing flip… except it never happens. He mistakes luck for strategy, memes for research, and optimism for skill. Every loss is met with renewed determination and a new coin to chase.',
    'He’s always one hype coin away from a life-changing flip… except it never happens. He mistakes luck for strategy, memes for research, and optimism for skill. Every loss is met with renewed determination and a new coin to chase.',
    'He’s always one hype coin away from a life-changing flip… except it never happens. He mistakes luck for strategy, memes for research, and optimism for skill. Every loss is met with renewed determination and a new coin to chase.'
]

const changeInterval = 5000; // 5 seconds

isPaused = null;

// === Logic ===
let currentIndex = 0;
const hero = document.querySelector('.hero');
const dots = document.querySelectorAll('.dot');
const desc = document.getElementById('description');
const toggle = document.getElementById('toggle');

// Set initial image
hero.style.backgroundImage = `url(${images[currentIndex]})`;

// Set initial description
desc.textContent = descriptions[currentIndex];


function changeSlide(index) {
  currentIndex = index;
  hero.style.backgroundImage = `url(${images[currentIndex]})`;
  
  // Remove and re-add the animation class to restart the animation
  desc.classList.remove('fade-in');
  void desc.offsetWidth; // This forces a reflow so the animation restarts
  desc.classList.add('fade-in');

  desc.textContent = descriptions[currentIndex];
  

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

