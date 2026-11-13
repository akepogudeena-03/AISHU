// Engagement invitation details: date/time is Hyderabad local time (Asia/Kolkata, UTC+05:30).
const engagementDate = new Date("2026-11-26T10:40:00+05:30");

const $ = (id) => document.getElementById(id);

$("openInvitation").addEventListener("click", () => {
  toggleMusic(true);
  $("cover").classList.add("hidden");
  $("invitation").classList.remove("hidden");
  requestAnimationFrame(paintScratchLayer);
  window.scrollTo({ top: 0, behavior: "smooth" });
});

$("backToTop").addEventListener("click", () => {
  $("invitation").classList.add("hidden");
  $("cover").classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Live countdown to 26 November 2026, 10:40 AM IST.
function updateCountdown() {
  let remaining = engagementDate.getTime() - Date.now();
  if (remaining <= 0) {
    ["days", "hours", "minutes", "seconds"].forEach(id => $(id).textContent = "00");
    return;
  }
  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  $("days").textContent = String(days).padStart(2, "0");
  $("hours").textContent = String(hours).padStart(2, "0");
  $("minutes").textContent = String(minutes).padStart(2, "0");
  $("seconds").textContent = String(seconds).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Scratch-off date reveal. Pointer events support both mouse and touch.
const canvas = $("scratchCanvas");
const ctx = canvas.getContext("2d");
let isScratching = false;

function paintScratchLayer() {
  const rect = canvas.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
  gradient.addColorStop(0, "#d6c9c5");
  gradient.addColorStop(.48, "#f5eeea");
  gradient.addColorStop(1, "#c9b9b5");
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, rect.width, rect.height);
  ctx.fillStyle = "#806b69";
  ctx.textAlign = "center";
  ctx.font = "600 13px Georgia";
  ctx.fillText("✧  SCRATCH HERE  ✧", rect.width / 2, rect.height / 2 + 5);
}
function eraseAt(event) {
  const rect = canvas.getBoundingClientRect();
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(event.clientX - rect.left, event.clientY - rect.top, 20, 0, Math.PI * 2);
  ctx.fill();
}
canvas.addEventListener("pointerdown", event => {
  isScratching = true;
  canvas.setPointerCapture(event.pointerId);
  eraseAt(event);
});
canvas.addEventListener("pointermove", event => {
  if (isScratching) eraseAt(event);
});
["pointerup", "pointercancel", "lostpointercapture"].forEach(type => {
  canvas.addEventListener(type, () => { isScratching = false; });
});
window.addEventListener("resize", () => {
  if (!$("invitation").classList.contains("hidden")) paintScratchLayer();
});

// English/Telugu text switch. All elements with data-en/data-te are translated.
let teluguMode = false;
$("languageToggle").addEventListener("click", () => {
  teluguMode = !teluguMode;
  document.documentElement.lang = teluguMode ? "te" : "en";
  document.querySelectorAll("[data-en][data-te]").forEach(element => {
    element.textContent = teluguMode ? element.dataset.te : element.dataset.en;
  });
  $("languageToggle").textContent = teluguMode ? "English" : "తెలుగు";
});

// Music player shared by both "Open Invitation" and the top music toggle button.
let audio;

async function toggleMusic(forcePlay = false) {
  if (!audio) {
    audio = new Audio("music.mp3");
    audio.loop = true;
  }
  try {
    if (forcePlay || audio.paused) {
      await audio.play();
      $("musicToggle").textContent = "♫ Music: On";
    } else {
      audio.pause();
      $("musicToggle").textContent = "♫ Music: Off";
    }
  } catch (error) {
    $("musicToggle").textContent = "Add music.mp3";
  }
}

$("musicToggle").addEventListener("click", () => toggleMusic(false));