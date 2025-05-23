// Variables
const langData = {
  fa: {
    chooseAvatarText: "یک آواتار انتخاب کنید:",
    button: "ذخیره",
    localClearBtn: "پاک کردن لوکال",
    sessionClearBtn: "پاک کردن سشن",
    saveAllTabsBtn: "ذخیره برای همه تب‌ها",
    saveThisTabBtn: "ذخیره برای این تب",
  },
  en: {
    chooseAvatarText: "Choose an avatar:",
    button: "Save",
    localClearBtn: "Clear Local Storage",
    sessionClearBtn: "Clear Session Storage",
    saveAllTabsBtn: "Save for all tabs",
    saveThisTabBtn: "Save for this tab only",
  }
};

let seconds = parseInt(sessionStorage.getItem("timeSpent")) || 0;

const colorOptionsLight = [
  "#ffc2f9", "#c2fff9", "#c2f9ff", "#f9ffc2",
  "#f9c2ff", "#d9f9c2", "#c2d9f9", "#f2c2c2",
  "#e0c2f9", "#b8f9c2", "#f9e2c2", "#c2f0f9"
];

const colorOptionsDark = [
  "#803d73", "#3d8079", "#3d6b80", "#80793d",
  "#803d80", "#5a803d", "#3d5a80", "#804c4c",
  "#6b3d80", "#3d805a", "#805a3d", "#3d7480" 
];

let selectedColor = null

// Current storage
let currentLang = localStorage.getItem("lang") || "en";
let currentMode = localStorage.getItem("mode") || "dark";

// Elements
document.getElementById("language").value = currentLang;
document.body.classList.add(currentMode);

const timerElem = document.getElementById("timer");

const container = document.getElementById("color-picker");


// Functions
function selectAvatar(emoji) {
  sessionStorage.setItem("avatar", emoji);
  showWelcome(emoji);
}

function showWelcome(emoji) {
  const names = {
    fa: {
      "🦊": "روباه باهوش",
      "🐱": "گربه ناز",
      "🐼": "پاندای مهربون",
      "🦁": "شیر شجاع",
      default: "دوست عزیز"
    },
    en: {
      "🦊": "Smart Fox",
      "🐱": "Cute Cat",
      "🐼": "Kind Panda",
      "🦁": "Brave Lion",
      default: "Dear Friend"
    }
  };

  const lang = currentLang === "fa" ? "fa" : "en";
  const name = names[lang][emoji] || names[lang].default;

  const welcomeMessage = lang === "fa"
    ? `خوش اومدی، ${name}!`
    : `Welcome, ${name}!`;

  document.getElementById("avatar-selection").style.display = "none";
  document.getElementById("welcome").innerText = welcomeMessage;
}

function applyLanguage() {
  const t = langData[currentLang];
  document.getElementById("choose-avatar-text").innerText = t.chooseAvatarText;
  document.getElementById("local-clear").innerText = t.localClearBtn;
  document.getElementById("session-clear").innerText = t.sessionClearBtn;
  document.querySelector(".colors-save-btns button:nth-child(1)").innerText = t.saveAllTabsBtn;
  document.querySelector(".colors-save-btns button:nth-child(2)").innerText = t.saveThisTabBtn;

  const guideTextEn = document.querySelector(".guide-text-container-en")
  const guideTextFa = document.querySelector(".guide-text-container-fa")

  if (currentLang === "fa" ) {
    guideTextFa.style.display = "block";
    guideTextEn.style.display = "none";
  } else {
    guideTextFa.style.display = "none";
    guideTextEn.style.display = "block";
  }

  const avatar = sessionStorage.getItem("avatar");
  if (avatar) {
    showWelcome(avatar);
  }

  updateTextDirection();
}

function changeLanguage() {
  currentLang = document.getElementById("language").value;
  localStorage.setItem("lang", currentLang);
  applyLanguage();
}

function toggleMode() {
  document.body.classList.toggle("dark");
  document.body.classList.toggle("light");
  const newMode = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("mode", newMode);

  renderColorOptions();
}

function clearLocal() {
  localStorage.clear();
  location.reload();
}

function clearSession() {
  sessionStorage.clear();
  location.reload();
}

function updateTimer() {
  seconds++;
  sessionStorage.setItem("timeSpent", seconds);
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  timerElem.innerText = `${min}:${sec.toString().padStart(2, "0")}`;
}

function renderColorOptions() {
  container.innerHTML = "";

  const isDark = document.body.classList.contains("dark");
  const colors = isDark ? colorOptionsDark : colorOptionsLight;

  colors.forEach(color => {
    const btn = document.createElement("div");
    btn.style.background = color;
    btn.style.width = "24px";
    btn.style.height = "24px";
    btn.style.borderRadius = "50%";
    btn.style.border = "1px solid #000";
    btn.style.cursor = "pointer";
    btn.title = color;
    btn.addEventListener("click", () => {
      document.querySelector(".container").style.background = color;
      selectedColor = color
    });
    container.appendChild(btn);
  });
}

function saveColorForAllTabs() {
  if (selectedColor) {
    localStorage.setItem("bgColor", selectedColor);
    applySavedColor();
  }
}

function saveColorForCurrentTab() {
  if (selectedColor) {
    sessionStorage.setItem("bgColor", selectedColor);
    applySavedColor();
  }
}

function applySavedColor() {
  const sessionColor = sessionStorage.getItem("bgColor");
  const localColor = localStorage.getItem("bgColor");

  const bg = sessionColor || localColor;
  if (bg) {
    document.querySelector(".container").style.background = bg;
  }
}

function updateTextDirection() {
  const textElements = document.querySelectorAll("h2, p, button, select, #welcome, #choose-avatar-text, .guide-text");
  textElements.forEach(el => {
    if (currentLang === "fa") {
      el.classList.add("text-dir-rtl");
      el.classList.remove("text-dir-ltr");
    } else {
      el.classList.add("text-dir-ltr");
      el.classList.remove("text-dir-rtl");
    }
  });
}



setInterval(updateTimer, 1000);
updateTimer();

applySavedColor();    
applyLanguage();
renderColorOptions();