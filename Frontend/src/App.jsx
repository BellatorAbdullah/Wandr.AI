import { useState, useEffect, useRef } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DateSelector from './DateSelector'; // Make sure this file exists!
import "./x.css"; 

const baseQuestions = [
  { id: "destination",     text: "Where are you dreaming of traveling to?",              emoji: "🌍", type: "text",   placeholder: "e.g., Tokyo, Japan" },
  { id: "dates",           text: "When are you planning to travel?",                     emoji: "🗓", type: "date" },
  { id: "duration",        text: "How long should this adventure last?",                 emoji: "⏳", type: "text",   placeholder: "e.g., 7 days or 2 weeks" },
  { id: "tripPurpose",     text: "What's the main purpose of this trip?",               emoji: "🎯", type: "choice", options: ["Holiday & relaxation", "Adventure & exploration", "Honeymoon / romance", "Business + leisure", "Cultural deep-dive"] },
  { id: "companions",      text: "Who are you traveling with?",                          emoji: "👥", type: "choice", options: ["Solo", "Couple", "Friends", "Family with kids"] },

  { id: "numKids",         text: "How many kids are coming?",                            emoji: "👶", type: "choice", options: ["1", "2", "3", "4+"],                           show: a => a.companions === "Family with kids" },
  { id: "kidsAges",        text: "What are the ages of the kids?",                       emoji: "🎈", type: "text",   placeholder: "e.g., 3, 7 and 11",                         show: a => a.companions === "Family with kids" },
  { id: "familyNeeds",     text: "Any family-specific needs?",                           emoji: "🍼", type: "choice", options: ["Stroller-friendly spots", "Kid-friendly food only", "Educational activities", "Theme parks & fun"], show: a => a.companions === "Family with kids" },

  { id: "numFriends",      text: "How many friends in the group?",                       emoji: "🎉", type: "choice", options: ["2–3", "4–6", "7–10", "10+"],                   show: a => a.companions === "Friends" },
  { id: "friendsVibe",     text: "What's the group vibe like?",                          emoji: "🥂", type: "choice", options: ["Party & nightlife", "Chill & explore", "Mix of everything", "Foodie crew"], show: a => a.companions === "Friends" },

  { id: "romanticLevel",   text: "How romantic do you want it?",                         emoji: "💕", type: "choice", options: ["Very romantic", "Balanced — fun + romance", "Mostly adventures together"], show: a => a.companions === "Couple" },
  { id: "budget",          text: "What is your overall budget level?",                   emoji: "💰", type: "choice", options: ["Budget (under $50/day)", "Mid-range ($50–150/day)", "Comfortable ($150–300/day)", "Luxury ($300+/day)"] },
  { id: "budgetPriority",  text: "Where do you want to spend more?",                     emoji: "💳", type: "choice", options: ["Food & dining", "Accommodation", "Activities & experiences", "Shopping"] },
  { id: "arrival",         text: "What time do you arrive on Day 1?",                   emoji: "🛬", type: "choice", options: ["Early morning (before 9am)", "Morning (9am–12pm)", "Afternoon (12–6pm)", "Evening / Night (after 6pm)"] },
  { id: "departure",       text: "What time is your flight home on the last day?",       emoji: "🛫", type: "choice", options: ["Early morning (before 10am)", "Midday (10am–2pm)", "Afternoon (2–6pm)", "Evening (after 6pm)"] },
  { id: "vibe",            text: "What's your preferred travel pace?",                   emoji: "⚡", type: "choice", options: ["Relaxed — I need downtime", "Balanced — mix of busy & chill", "Packed — I want to see everything"] },
  { id: "morningPerson",   text: "Are you a morning person or night owl?",               emoji: "🌅", type: "choice", options: ["Morning person — up at 7am", "Somewhere in between", "Night owl — sleep in late"] },
  { id: "activities",      text: "What kind of activities excite you most?",             emoji: "🎭", type: "choice", options: ["Culture & history", "Nature & outdoors", "Adventure & thrills", "Shopping & lifestyle"] },
  { id: "mustSeeType",     text: "Hidden gems or famous landmarks?",                     emoji: "💎", type: "choice", options: ["Hidden gems only", "A mix of both", "Famous spots — I want it all"] },
  { id: "indoorOutdoor",   text: "Do you prefer indoor or outdoor activities?",          emoji: "🏕", type: "choice", options: ["Mostly outdoors", "Mix of both", "Mostly indoors"] },
  { id: "physicalLevel",   text: "How physically active do you want to be?",             emoji: "🏃", type: "choice", options: ["Low — easy walks only", "Moderate — some hiking OK", "High — bring on the challenge"] },
  { id: "foodPrefs",       text: "Any dietary preferences?",                             emoji: "🍜", type: "choice", options: ["No restrictions", "Vegetarian", "Vegan", "Halal", "Gluten-free"] },
  { id: "foodAdventure",   text: "How adventurous are you with food?",                   emoji: "🌶", type: "choice", options: ["I'll try anything local!", "Mostly local with safe options", "I prefer familiar cuisines"] },
  { id: "diningStyle",     text: "What's your dining style?",                            emoji: "🍽", type: "choice", options: ["Street food & local spots", "Casual restaurants", "Mix of casual & fine dining", "Fine dining experiences"] },
  { id: "transport",       text: "How do you prefer to get around?",                     emoji: "🚆", type: "choice", options: ["Public transport", "Taxi / Rideshare", "Rent a car", "Walk & explore on foot"] },
  { id: "accommodation",   text: "Where do you prefer to stay?",                         emoji: "🏨", type: "choice", options: ["Hostel / budget stay", "Mid-range hotel", "Boutique / unique stay", "Luxury hotel or resort"] },
  { id: "locationPref",    text: "Where should your accommodation be?",                  emoji: "📍", type: "choice", options: ["City centre / close to everything", "Quiet neighbourhood", "Near nature / beach", "Doesn't matter"] },
  { id: "nightlife",       text: "How much do you enjoy nightlife?",                     emoji: "🌙", type: "choice", options: ["Love it — bars & clubs every night", "Occasional night out", "Dinner & early nights for me"] },
  { id: "shoppingInterest",text: "How important is shopping on this trip?",              emoji: "🛍", type: "choice", options: ["Very important", "A bit of browsing", "Not at all"] },
  { id: "weatherPref",     text: "Any weather preferences?",                             emoji: "☀️", type: "choice", options: ["Hot & sunny", "Mild & comfortable", "Cool or cold is fine", "No preference"] },
  { id: "mustSee",         text: "Any must-see spots or special requests?",              emoji: "📌", type: "text",   placeholder: "e.g., I really want to see the cherry blossoms" },
  { id: "avoid",           text: "Anything you want to avoid?",                          emoji: "🚫", type: "text",   placeholder: "e.g., crowded tourist traps, long bus rides" },
];

function getVisibleQuestions(answers) {
  return baseQuestions.filter(q => !q.show || q.show(answers));
}

export default function App() {
  const [answers,     setAnswers]     = useState({});
  const [currentIdx,  setCurrentIdx]  = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [itinerary,   setItinerary]   = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);
  const [animKey,     setAnimKey]     = useState(0);
  const inputRef = useRef(null);

  const questions = getVisibleQuestions(answers);
  const q         = questions[currentIdx];
  const progress  = (currentIdx / questions.length) * 100;
  const total     = questions.length;

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [currentIdx]);

  const goTo = (idx) => {
    setAnimKey(k => k + 1);
    setCurrentIdx(idx);
    setShowSummary(false);
  };

  const advance = () => {
    const nextIdx = currentIdx + 1;
    if (nextIdx < questions.length) {
      setAnimKey(k => k + 1);
      setCurrentIdx(nextIdx);
    } else {
      setShowSummary(true);
    }
  };

  const handleChoice = (option) => {
    const newAnswers = { ...answers, [q.id]: option };
    setAnswers(newAnswers);
    const newQuestions = getVisibleQuestions(newAnswers);
    const nextIdx = currentIdx + 1;
    setTimeout(() => {
      if (nextIdx < newQuestions.length) {
        setAnimKey(k => k + 1);
        setCurrentIdx(nextIdx);
      } else {
        setShowSummary(true);
      }
    }, 260);
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setItinerary(null);
    try {
      const res = await fetch("https://wandr-ai-bk1k.onrender.com/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: answers }),
      });
      if (!res.ok) throw new Error("Could not connect to the backend server.");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setItinerary(data.itinerary);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading || itinerary || error) {
    return (
      <div className="app-shell">
        <div className="brand"><span className="brand-dot" />wandr.ai</div>
        {loading && (
          <div className="main-card" style={{ maxWidth: 460 }}>
            <div className="loading-card">
              <div className="loading-spinner" />
              <div className="loading-text">Crafting your perfect itinerary…</div>
            </div>
          </div>
        )}
        {!loading && error && (
          <div className="main-card" style={{ maxWidth: 520 }}>
            <div className="q-label">Something went wrong</div>
            <div className="error-box">{error}</div>
            <button className="back-link" onClick={() => { setError(null); setShowSummary(true); }}>← Back to summary</button>
          </div>
        )}
        {!loading && itinerary && (
          <div className="itinerary-wrap">
            <div className="itinerary-header">
              <div className="q-label">Your itinerary ✈️</div>
              <div className="itinerary-dest">{answers.destination}</div>
            </div>
            <div className="itinerary-body">
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      // AFTER
img({ src, alt }) {
  // The dead Unsplash URLs already have great keywords in the query string
  // e.g. https://source.unsplash.com/800x400/?Tokyo,shinjuku,night
  // Extract those and feed them to loremflickr which is free + alive
  let keywords = "travel";
  try {
    const query = new URL(src).search.replace("?", "").trim();
    if (query) keywords = query;
  } catch {}

  return (
    <img
      src={`https://loremflickr.com/800/400/${keywords}`}
      alt={alt}
      style={{ width: "100%", maxHeight: 450, objectFit: "cover", borderRadius: 15, margin: "25px 0", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }}
    />
  );
}
    }}
  >{itinerary}</ReactMarkdown>
</div>
            <button className="back-link" onClick={() => { setItinerary(null); setShowSummary(true); }}>← Back to summary</button>
          </div>
        )}
      </div>
    );
  }

  if (showSummary) {
    return (
      <div className="app-shell">
        <div className="brand"><span className="brand-dot" />wandr.ai</div>
        <div className="main-card wide">
          <div className="q-label">Almost there ✈️</div>
          <div className="summary-title">Your trip at a glance</div>
          <div className="summary-sub">Hover any card to edit that answer</div>
          <div className="summary-grid">
            {questions.map((question, i) =>
              answers[question.id] ? (
                <div key={question.id} className="summary-bubble" onClick={() => goTo(i)}>
                  <span className="edit-hint">edit ✎</span>
                  <div className="b-q">{question.text}</div>
                  <div className="b-a">{answers[question.id]}</div>
                </div>
              ) : null
            )}
          </div>
          <button className="generate-btn-final" onClick={handleGenerate}>
            ✨ Generate my itinerary
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="brand"><span className="brand-dot" />wandr.ai</div>
      <div className="step-counter"><strong>{currentIdx + 1}</strong> / {total}</div>
      <div className="main-card">
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <div key={animKey} className="slide-in">
          <div className="q-label">{q.emoji} Question {currentIdx + 1}</div>
          <div className="q-text">{q.text}</div>
          <div className="input-area">
            {q.type === "text" ? (
              <input
                ref={inputRef}
                className="text-bubble"
                type="text"
                placeholder={q.placeholder}
                value={answers[q.id] || ""}
                onChange={e => setAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                onKeyDown={e => { if (e.key === "Enter" && answers[q.id]?.trim()) advance(); }}
              />
            ) : q.type === "date" ? (
              <DateSelector 
                value={answers[q.id]} 
                onSelect={(date) => {
                  setAnswers(prev => ({ ...prev, [q.id]: date }));
                  setTimeout(advance, 300);
                }} 
              />
            ) : (
              q.options.map(opt => (
                <button
                  key={opt}
                  className={`choice-bubble${answers[q.id] === opt ? " selected" : ""}`}
                  onClick={() => handleChoice(opt)}
                >
                  {opt}
                  <span className="choice-check" />
                </button>
              ))
            )}
          </div>
        </div>
        <div className="nav-footer">
          <button
            className="back-btn"
            onClick={() => goTo(Math.max(0, currentIdx - 1))}
            style={{ visibility: currentIdx === 0 ? "hidden" : "visible" }}
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back
          </button>
          {q.type === "text" && (
            <button
              className="next-btn"
              onClick={advance}
              disabled={!answers[q.id]?.trim()}
              style={{ opacity: answers[q.id]?.trim() ? 1 : 0.35 }}
            >
              Continue →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}