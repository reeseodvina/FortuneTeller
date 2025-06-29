const askBtn = document.getElementById("askBtn");
const userQuestion = document.getElementById("userQuestion");
const crystalResponse = document.getElementById("crystalResponse");
const backBtn = document.getElementById("backBtn");
const crystalBall = document.getElementById("crystalBall");
const twinkleContainer = document.getElementById("twinkleContainer");
const shareBtn = document.getElementById("shareBtn");

// Gemini API key
const API_KEY = 'YOUR_API_KEY';

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

// Call once on page load
createSparkles();

function flashBackground() {
  document.body.classList.remove('flash-bg');   
  void document.body.offsetWidth;               
  document.body.classList.add('flash-bg');      
}

async function getCrystalResponse() {
  const question = userQuestion.value.trim();
  if (!question) {
    crystalResponse.textContent = "Please ask a question first!";
    shareBtn.style.display = "none"; // Hide share button if no question
    return;
  }

  // Trigger crystal ball pulse animation
  crystalBall.classList.remove("pulse");
  void crystalBall.offsetWidth;
  crystalBall.classList.add("pulse");

  // Trigger background flash animation
  flashBackground();

  crystalResponse.textContent = "Peering into the mists...";

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Answer this question like a wise but kind fortune teller: "${question}". Be fun and whimsical, but simple to understand. Only 3 sentences max.`
                }
              ]
            }
          ]
        }),
      }
    );

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    console.log("Answer received:", text);  // DEBUG LOG

    crystalResponse.textContent = text
      ? text.trim().replace(/\n/g, " ")
      : "The mists are unclear... try again.";

    if (text) {
      console.log("Showing share button");  // DEBUG LOG
      shareBtn.style.display = "inline-block";
    } else {
      console.log("Hiding share button");  // DEBUG LOG
      shareBtn.style.display = "none";
    }
  } catch (error) {
    console.error("Gemini error:", error);
    crystalResponse.textContent = "The spirits are not responding...";
    shareBtn.style.display = "none";
  }
}

askBtn.addEventListener("click", getCrystalResponse);

userQuestion.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    getCrystalResponse();
  }
});

backBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});

shareBtn.addEventListener("click", () => {
  const shareData = {
    title: "Magic Crystal Ball",
    text: crystalResponse.textContent,
    url: window.location.href,
  };

  if (navigator.share) {
    navigator.share(shareData).catch((err) => console.error("Share failed:", err));
  } else {
    navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`)
      .then(() => alert("Response copied to clipboard!"))
      .catch(() => alert("Share not supported and copy failed."));
  }
});
