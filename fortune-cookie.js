const cookie = document.getElementById("cookie");
const adviceText = document.getElementById("adviceText");
const newFortuneBtn = document.getElementById("newFortuneBtn");
const shareBtn = document.getElementById("shareBtn");
const twinkleContainer = document.querySelector('.twinkle-container');

// Gemini API:
const API_KEY = 'AIzaSyCQWYD8bvmHk6RFFl5YZ9d_Ru6P836KUkQ';

// Flag to prevent auto-cracking
let isCrackReady = true;

// Create twinkles for background
function createSparkles(count = 40) {
  for (let i = 0; i < count; i++) {
    const sparkle = document.createElement('div');
    sparkle.classList.add('twinkle');
    sparkle.style.top = `${Math.random() * 100}%`;
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.animationDelay = `${Math.random() * 5}s`;
    sparkle.style.animationDuration = `${3 + Math.random() * 5}s`;
    twinkleContainer.appendChild(sparkle);
  }
}

createSparkles();

async function getAdvice() {
  adviceText.textContent = "Cracking... ";

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Give me a short, fun piece of advice, like you would find in a fortune cookie. Do not use emojis."
                }
              ]
            }
          ]
        }),
      }
    );

    const data = await res.json();
    console.log("Gemini 2.0 Flash response:", data);

    if (data && data.candidates && data.candidates.length > 0) {
      const candidate = data.candidates[0];
      if (candidate.content?.parts?.[0]?.text) {
        let advice = candidate.content.parts[0].text;
        return advice.trim().replace(/\n/g, " ");
      } else {
        return "⚠️ API responded, but didn't include advice.";
      }
    } else {
      return "⚠️ API responded, but no candidates found.";
    }
  } catch (error) {
    console.error("Error talking to Gemini 2.0 Flash:", error);
    return "❌ Could not connect to Gemini API.";
  }
}

async function showFortune() {
  if (!isCrackReady) return;
  isCrackReady = false;

  cookie.classList.add("crack");

  setTimeout(async () => {
    cookie.src = "images/broken-cookie.png";
    const advice = await getAdvice();
    adviceText.textContent = advice;

    // Reveal and animate the "Get Another Fortune" button
    newFortuneBtn.style.display = "inline-block";
    newFortuneBtn.classList.add("wiggle");
    setTimeout(() => {
      newFortuneBtn.classList.remove("wiggle");
    }, 500);

    // Show share button
    shareBtn.style.display = "inline-block";
  }, 500);
}

cookie.addEventListener("click", showFortune);

newFortuneBtn.addEventListener("click", async () => {
  // Reset everything visually
  cookie.classList.remove("crack");
  cookie.src = "images/whole-cookie.png";
  adviceText.textContent = "Click the cookie to reveal your advice!";
  newFortuneBtn.style.display = "none";
  shareBtn.style.display = "none";

  // Allow user to click again
  isCrackReady = true;
});

shareBtn.addEventListener("click", async () => {
  const fortune = adviceText.textContent;
  try {
    await navigator.share({
      title: "My Fortune Cookie 🥠",
      text: `Here's what my fortune cookie said: \"${fortune}\"`,
      url: window.location.href
    });
  } catch (err) {
    alert("Sharing failed or was cancelled.");
    console.error("Share error:", err);
  }
});

backBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});
