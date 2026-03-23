import { useState, useEffect, useRef } from "react";
import "./x.css";

export default function App() {
  // This unique key forces the whole app to re-render if something is stuck
  const [sessionKey] = useState(Date.now()); 
  const [answers, setAnswers] = useState({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const inputRef = useRef(null);

  const allQuestions = [
    { id: "destination", text: "🌍 Where are you dreaming of traveling to?", type: "text", placeholder: "e.g., Tokyo, Japan" },
    { id: "duration", text: "📅 How many days will your trip be?", type: "text", placeholder: "e.g., 7 days" },
    { id: "arrival", text: "🛬 What time do you arrive on Day 1?", type: "choice", options: ["🌅 Morning", "☀️ Afternoon", "🌙 Evening/Night"] },
    { id: "departure", text: "🛫 What time is your flight home on the last day?", type: "choice", options: ["🌅 Morning", "☀️ Afternoon", "🌙 Evening/Night"] },
    { id: "companions", text: "👥 Who are you traveling with?", type: "choice", options: ["🧍 Solo", "❤️ Couple", "🎉 Friends", "👨‍👩‍👧 Family"] },
    { id: "familyDetails", text: "👶 What are the ages of the family members?", type: "text", placeholder: "e.g., 2 adults, kids 5 and 8", condition: (ans) => ans.companions === "👨‍👩‍👧 Family" },
    { id: "friendsInterests", text: "🎯 What are your group's main interests?", type: "text", placeholder: "e.g., Drinking, hiking, museums", condition: (ans) => ans.companions === "🎉 Friends" },
    { id: "occasion", text: "🎈 Is this for a special occasion?", type: "choice", options: ["🎂 Birthday", "💍 Honeymoon/Anniversary", "💼 Work Trip", "🎒 Just for fun!"] },
    { id: "budget", text: "💰 What is your budget level?", type: "choice", options: ["💸 Budget / Backpacking", "💳 Mid-range / Standard", "💎 Luxury / Premium"] },
    { id: "vibe", text: "⚡ What's your preferred travel pace?", type: "choice", options: ["🧘 Relaxed", "🚶 Balanced", "🚀 Packed"] },
    { id: "activities", text: "🎭 What types of activities do you prefer?", type: "choice", options: ["🏛 Culture & History", "🏔 Nature & Adventure", "🎉 Nightlife", "🛍 Shopping", "🍜 Food Tours"] },
    { id: "diningStyle", text: "🍽 How do you prefer to eat?", type: "choice", options: ["🍢 Street food & Markets", "☕ Casual Cafes", "🍷 Fine Dining / Michelin"] },
    { id: "foodPrefs", text: "🌶 Any food preference?", type: "choice", options: ["🔥 Love spicy", "🙂 Mild food", "🍔 Comfort food", "🥬 Vegetarian/Vegan"] },
    { id: "allergies", text: "⚠️ Any food allergies or restrictions?", type: "text", placeholder: "Leave blank if none" },
    { id: "mustSee", text: "📍 Any specific landmarks you MUST see (or want to avoid)?", type: "text", placeholder: "e.g., See the Louvre, skip Eiffel Tower" },
    { id: "accessibility", text: "♿ Any accessibility needs?", type: "text", placeholder: "Wheelchair access, minimal walking..." },
    { id: "transport", text: "🚆 How do you prefer to get around?", type: "choice", options: ["🚶 Walking", "🚇 Public transport", "🚕 Taxi / Uber", "🚗 Rent a car", "🤷 Fastest option"] },
    { id: "wakeTime", text: "🌅 When do you usually start your day?", type: "choice", options: ["🌄 Early (6-8am)", "☀️ Normal (8-10am)", "😴 Late (10am+)"] },
    { id: "nightPerson", text: "🌙 Do you enjoy nightlife?", type: "choice", options: ["🎉 Yes love nightlife", "🌃 Sometimes", "😴 Not really"] },
    { id: "touristVsHidden", text: "🧭 What type of places do you prefer?", type: "choice", options: ["📸 Famous tourist spots", "🧑‍🤝‍🧑 Mix of both", "🗺 Hidden local gems"] },
    { id: "shopping", text: "🛍 Interested in shopping?", type: "choice", options: ["🛒 Yes", "🙂 Maybe", "🚫 Not really"] },
    { id: "weather", text: "🌦 Preferred weather conditions?", type: "choice", options: ["☀️ Warm", "❄️ Cold", "🌧 Rain is fine", "🤷 Any weather"] },
    { id: "walkingTolerance", text: "👟 How much walking per day?", type: "choice", options: ["🚶 Short walks", "🚶‍♂️ Moderate", "🥾 Lots of walking"] },
    { id: "photography", text: "📷 Are scenic / Instagram spots important?", type: "choice", options: ["📸 Very important", "🙂 Nice to have", "🚫 Not important"] },
    { id: "tripGoal", text: "🎯 Main goal of your trip?", type: "choice", options: ["🧘 Relaxation", "🌍 Culture", "🍜 Food", "🎉 Fun", "🏔 Adventure"] },
    { id: "travelExperience", text: "✈️ Your travel experience?", type: "choice", options: ["🧳 First big trip", "🌍 Some travel experience", "🧭 Very experienced"] },
    { id: "accommodation", text: "🏨 Preferred accommodation?", type: "choice", options: ["🛌 Hostel", "🏨 Hotel", "🏡 Airbnb", "💎 Luxury hotel"] },
    { id: "safetyPreference", text: "🛡 How important is safety when exploring?", type: "choice", options: ["✅ Very important", "🙂 Somewhat important", "🤷 Not worried"] }
  ];

  const currentQuestion = allQuestions[currentIdx];

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [currentIdx]);

  const rootStyle = { 
    display: "flex", justifyContent: "center", alignItems: "center", 
    minHeight: "100vh", width: "100vw", position: "fixed", top: 0, left: 0,
    background: "linear-gradient(-45deg, #a1c4fd, #c2e9fb, #fbc2eb, #fcd3c1)",
    backgroundSize: "400% 400%", zIndex: 9999
  };

  const cardStyle = { 
    background: "white", padding: "40px", borderRadius: "20px", 
    width: "480px", maxWidth: "90%", boxShadow: "0 20px 50px rgba(0,0,0,0.2)", 
    textAlign: "center", color: "#1f2937" 
  };

  const handleNext = (updatedAnswers = answers) => {
    const next = allQuestions.findIndex((q, i) => i > currentIdx && (!q.condition || q.condition(updatedAnswers)));
    if (next !== -1) setCurrentIdx(next);
    else setShowSummary(true);
  };

  const handleBack = () => {
    const prev = allQuestions.findLastIndex((q, i) => i < currentIdx && (!q.condition || q.condition(answers)));
    if (prev !== -1) setCurrentIdx(prev);
  };

  const handleChoice = (option) => {
    const newAnswers = { ...answers, [currentQuestion.id]: option };
    setAnswers(newAnswers);
    setTimeout(() => handleNext(newAnswers), 150);
  };

  if (showSummary) {
    return (
      <div style={rootStyle} key={`summary-${sessionKey}`}>
        <div style={cardStyle}>
          <h2 style={{ color: "#1f2937" }}>Your Full Profile ✈️</h2>
          <div style={{ maxHeight: "400px", overflowY: "auto", textAlign: "left", marginTop: "20px", padding: "10px" }}>
            {allQuestions.map(q => (answers[q.id] && (!q.condition || q.condition(answers))) ? (
              <div key={q.id} style={{ marginBottom: "15px", borderBottom: "1px solid #eee", paddingBottom: "5px" }}>
                <div style={{ fontWeight: "bold", fontSize: "14px", color: "#4338ca" }}>{q.text}</div>
                <div style={{ color: "#065f46" }}>{answers[q.id]}</div>
              </div>
            ) : null)}
          </div>
          <button style={{ marginTop: "20px", width: "100%", padding: "12px", background: "#6366f1", color: "white", border: "none", borderRadius: "10px", cursor: "pointer" }} onClick={() => window.location.reload()}>
            Restart Form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={rootStyle} key={`app-${sessionKey}`}>
      <div id="app" style={cardStyle}>
        <div style={{ height: "8px", background: "#e5e7eb", borderRadius: "4px", marginBottom: "25px", overflow: "hidden" }}>
          <div style={{ height: "100%", background: "#6366f1", width: `${(currentIdx / (allQuestions.length - 1)) * 100}%`, transition: "width 0.3s" }} />
        </div>

        <h2 style={{ color: "#1f2937", marginBottom: "25px", fontSize: "20px" }}>{currentQuestion.text}</h2>

        <div id="inputArea" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {currentQuestion.type === "text" && (
            <input
              ref={inputRef}
              type="text"
              placeholder={currentQuestion.placeholder}
              value={answers[currentQuestion.id] || ""}
              onChange={(e) => setAnswers({ ...answers, [currentQuestion.id]: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleNext(answers)}
              style={{ color: "#1f2937", background: "white", padding: "14px", border: "1px solid #ddd", borderRadius: "10px", fontSize: "16px" }}
            />
          )}

          {currentQuestion.type === "choice" &&
            currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleChoice(option)}
                style={{ 
                  color: "#1f2937", width: "100%", padding: "14px", textAlign: "left", borderRadius: "10px", cursor: "pointer", fontSize: "16px",
                  background: answers[currentQuestion.id] === option ? "#eff6ff" : "white",
                  border: answers[currentQuestion.id] === option ? "2px solid #6366f1" : "1px solid #e5e7eb"
                }}
              >
                {option}
              </button>
            ))}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
          <button onClick={handleBack} style={{ visibility: currentIdx === 0 ? "hidden" : "visible", padding: "10px 20px", borderRadius: "8px", border: "none", background: "#eee", cursor: "pointer" }}>Back</button>
          {currentQuestion.type === "text" && (
            <button onClick={() => handleNext(answers)} style={{ padding: "10px 20px", borderRadius: "8px", border: "none", background: "#6366f1", color: "white", cursor: "pointer" }}>Next</button>
          )}
        </div>
      </div>
    </div>
  );
}