// Data Object to store all responses (Perfect for AI context)
let answers = {};
let currentIdx = 0;

// Master List of Questions (Includes IDs and conditional rendering)
const allQuestions = [
  { id: "destination", text: "🌍 Where are you dreaming of traveling to?", type: "text", placeholder: "e.g., Tokyo, Japan" },
  { id: "duration", text: "📅 How many days will your trip be?", type: "text", placeholder: "e.g., 7 days" },

  { 
    id: "companions", 
    text: "👥 Who are you traveling with?", 
    type: "choice", 
    options: ["🧍 Solo", "❤️ Couple", "🎉 Friends", "👨‍👩‍👧 Family"] 
  },

  // CONDITIONAL QUESTIONS
  { 
    id: "familyDetails", 
    text: "👶 What are the ages of the family members?", 
    type: "text", 
    placeholder: "e.g., 2 adults, kids 5 and 8",
    condition: (ans) => ans.companions === "👨‍👩‍👧 Family"
  },

  { 
    id: "friendsInterests", 
    text: "🎯 What are your group's main interests?", 
    type: "text", 
    placeholder: "e.g., Drinking, hiking, museums",
    condition: (ans) => ans.companions === "🎉 Friends"
  },

  { 
    id: "budget", 
    text: "💰 What is your budget level?", 
    type: "choice", 
    options: ["💸 Budget / Backpacking", "💳 Mid-range / Standard", "💎 Luxury / Premium"] 
  },

  { 
    id: "vibe", 
    text: "⚡ What's your preferred travel pace?", 
    type: "choice", 
    options: ["🧘 Relaxed", "🚶 Balanced", "🚀 Packed"] 
  },

  { 
    id: "activities", 
    text: "🎭 What types of activities do you prefer?", 
    type: "choice", 
    options: ["🏛 Culture & History", "🏔 Nature & Adventure", "🎉 Nightlife", "🛍 Shopping", "🍜 Food Tours"] 
  },

  { 
    id: "foodPrefs", 
    text: "🌶 Any food preference?", 
    type: "choice", 
    options: ["🔥 Love spicy", "🙂 Mild food", "🍔 Comfort food", "🥬 Vegetarian/Vegan"] 
  },

  { 
    id: "allergies", 
    text: "⚠️ Any food allergies or restrictions?", 
    type: "text", 
    placeholder: "Leave blank if none" 
  },

  { 
    id: "accessibility", 
    text: "♿ Any accessibility needs?", 
    type: "text", 
    placeholder: "Wheelchair access, minimal walking..." 
  },

  // ----------- NEW QUESTIONS START HERE -----------

  {
    id: "transport",
    text: "🚆 How do you prefer to get around?",
    type: "choice",
    options: [
      "🚶 Walking",
      "🚇 Public transport",
      "🚕 Taxi / Uber",
      "🚗 Rent a car",
      "🤷 Fastest option"
    ]
  },

  {
    id: "wakeTime",
    text: "🌅 When do you usually start your day?",
    type: "choice",
    options: [
      "🌄 Early (6-8am)",
      "☀️ Normal (8-10am)",
      "😴 Late (10am+)"
    ]
  },

  {
    id: "nightPerson",
    text: "🌙 Do you enjoy nightlife?",
    type: "choice",
    options: [
      "🎉 Yes love nightlife",
      "🌃 Sometimes",
      "😴 Not really"
    ]
  },

  {
    id: "touristVsHidden",
    text: "🧭 What type of places do you prefer?",
    type: "choice",
    options: [
      "📸 Famous tourist spots",
      "🧑‍🤝‍🧑 Mix of both",
      "🗺 Hidden local gems"
    ]
  },

  {
    id: "shopping",
    text: "🛍 Interested in shopping?",
    type: "choice",
    options: [
      "🛒 Yes",
      "🙂 Maybe",
      "🚫 Not really"
    ]
  },

  {
    id: "weather",
    text: "🌦 Preferred weather conditions?",
    type: "choice",
    options: [
      "☀️ Warm",
      "❄️ Cold",
      "🌧 Rain is fine",
      "🤷 Any weather"
    ]
  },

  {
    id: "walkingTolerance",
    text: "👟 How much walking per day?",
    type: "choice",
    options: [
      "🚶 Short walks",
      "🚶‍♂️ Moderate",
      "🥾 Lots of walking"
    ]
  },

  {
    id: "photography",
    text: "📷 Are scenic / Instagram spots important?",
    type: "choice",
    options: [
      "📸 Very important",
      "🙂 Nice to have",
      "🚫 Not important"
    ]
  },

  {
    id: "tripGoal",
    text: "🎯 Main goal of your trip?",
    type: "choice",
    options: [
      "🧘 Relaxation",
      "🌍 Culture",
      "🍜 Food",
      "🎉 Fun",
      "🏔 Adventure"
    ]
  },

  {
    id: "travelExperience",
    text: "✈️ Your travel experience?",
    type: "choice",
    options: [
      "🧳 First big trip",
      "🌍 Some travel experience",
      "🧭 Very experienced"
    ]
  },

  {
    id: "accommodation",
    text: "🏨 Preferred accommodation?",
    type: "choice",
    options: [
      "🛌 Hostel",
      "🏨 Hotel",
      "🏡 Airbnb",
      "💎 Luxury hotel"
    ]
  },

  {
    id: "safetyPreference",
    text: "🛡 How important is safety when exploring?",
    type: "choice",
    options: [
      "✅ Very important",
      "🙂 Somewhat important",
      "🤷 Not worried"
    ]
  }

];

// Render Question
function renderQuestion() {
  const q = allQuestions[currentIdx];
  const qText = document.getElementById("questionText");
  const inputArea = document.getElementById("inputArea");
  const nextBtn = document.getElementById("nextBtn");
  const backBtn = document.getElementById("backBtn");

  qText.innerText = q.text;
  inputArea.innerHTML = "";

  backBtn.style.visibility = currentIdx === 0 ? "hidden" : "visible";

  updateProgress();

  if (q.type === "text") {

    nextBtn.style.display = "block";

    const input = document.createElement("input");
    input.id = "answerInput";
    input.type = "text";
    input.placeholder = q.placeholder || "Type here...";

    if (answers[q.id]) input.value = answers[q.id];

    input.addEventListener("keypress", function(e) {
      if (e.key === "Enter") goNext();
    });

    inputArea.appendChild(input);

    setTimeout(() => input.focus(), 50);
  }

  if (q.type === "choice") {

    nextBtn.style.display = "none";

    q.options.forEach(option => {

      const btn = document.createElement("button");
      btn.className = "optionBtn";
      btn.innerText = option;

      if (answers[q.id] === option) {
        btn.style.borderColor = "#6366f1";
        btn.style.borderWidth = "2px";
      }

      btn.onclick = () => {
        answers[q.id] = option;
        goNext(true);
      };

      inputArea.appendChild(btn);

    });
  }
}

function getNextIndex(startIdx) {
  for (let i = startIdx + 1; i < allQuestions.length; i++) {
    if (!allQuestions[i].condition || allQuestions[i].condition(answers)) {
      return i;
    }
  }
  return -1;
}

function getPrevIndex(startIdx) {
  for (let i = startIdx - 1; i >= 0; i--) {
    if (!allQuestions[i].condition || allQuestions[i].condition(answers)) {
      return i;
    }
  }
  return 0;
}

function goNext() {

  const q = allQuestions[currentIdx];

  if (q.type === "text") {

    const val = document.getElementById("answerInput").value.trim();

    if (val === "" && (q.id === "destination" || q.id === "duration")) {
      alert("Please fill this out to continue!");
      return;
    }

    answers[q.id] = val;
  }

  const nextIdx = getNextIndex(currentIdx);

  if (nextIdx !== -1) {
    currentIdx = nextIdx;
    renderQuestion();
  } else {
    showSummary();
  }
}

function goBack() {
  currentIdx = getPrevIndex(currentIdx);
  renderQuestion();
}

function updateProgress() {

  const progress = (currentIdx / allQuestions.length) * 100;

  document.getElementById("progressBar").style.width = progress + "%";
}

function showSummary() {

  const app = document.getElementById("app");

  console.log("Final AI Payload Data:", answers);

  app.innerHTML = `
    <h2>Your Travel Profile ✈️</h2>
    <p style="color:#6b7280;font-size:14px;margin-bottom:20px;">
    Ready to generate your AI itinerary!
    </p>
    <div id="summaryList"></div>
    <button id="restartBtn">Generate Itinerary</button>
  `;

  const list = document.getElementById("summaryList");

  allQuestions.forEach(q => {

    if (answers[q.id] && (!q.condition || q.condition(answers))) {

      const card = document.createElement("div");

      card.className = "summaryCard";

      card.innerHTML = `
        <div class="summaryQuestion">${q.text}</div>
        <div class="summaryAnswer">${answers[q.id]}</div>
      `;

      list.appendChild(card);
    }

  });

  document.getElementById("restartBtn").onclick = () => location.reload();
}

// Initialize App
renderQuestion();