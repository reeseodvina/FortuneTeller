const twinkleContainer = document.querySelector('.twinkle-container');
const twinkleCount = 30;

function createTwinkle() {
  const twinkle = document.createElement('div');
  twinkle.classList.add('twinkle'); 

  // Random position
  twinkle.style.top = Math.random() * 100 + 'vh';
  twinkle.style.left = Math.random() * 100 + 'vw';

  // Random animation delay for stagger effect
  twinkle.style.animationDelay = (Math.random() * 5) + 's';

  twinkleContainer.appendChild(twinkle);
}

for(let i = 0; i < twinkleCount; i++) {
  createTwinkle();
}
