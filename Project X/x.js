let step = 0;
let answers = [];

let questions = [

{ text:"🌍 Where are you traveling to?", type:"text" },

{ text:"📅 How many days is your trip?", type:"text" },

{
text:"💰 What is your budget level?",
type:"options",
options:[
"💸 Budget",
"💳 Mid-range",
"💎 Luxury"
]
},

{
text:"🎯 What is the main goal of your trip?",
type:"options",
options:[
"🧘 Relaxation",
"🏔️ Adventure",
"🏛️ Culture",
"🍜 Food",
"🎉 Nightlife"
]
},

{
text:"⚡ How fast do you want your trip to feel?",
type:"options",
options:[
"🧘 Relaxed",
"🚶 Balanced",
"🚀 Packed"
]
},

{
text:"🌶️ Do you enjoy spicy food?",
type:"options",
options:[
"🔥 Love spicy food",
"🙂 Mild spice only",
"🚫 No spice",
"🤷 No preference"
]
},

{
text:"⚠️ Do you have any food allergies or restrictions?",
type:"text"
},

{
text:"🏨 Where are you staying?",
type:"options",
options:[
"🏙️ City center",
"🏡 Outside the city",
"❓ Not booked yet"
]
},

{
text:"🚗 How will you travel around the city?",
type:"options",
options:[
"🚶 Walking",
"🚇 Public transport",
"🚗 Rental car",
"🤷 No preference"
]
},

{
text:"⏰ When do you usually start your day while traveling?",
type:"options",
options:[
"🌅 Early (7–8am)",
"☀️ Normal (9–10am)",
"😴 Late (11+)"
]
},

{
text:"🌧️ Are you okay with outdoor activities in bad weather?",
type:"options",
options:[
"🌦️ Yes",
"🏛️ Prefer indoor activities"
]
},

{
text:"📸 Do you want Instagram-worthy photo spots?",
type:"options",
options:[
"📷 Yes definitely",
"🙂 Not important"
]
},

{
text:"💳 Where do you prefer to spend your money?",
type:"options",
options:[
"🍜 Food",
"🎟️ Attractions",
"🛍️ Shopping",
"🍸 Nightlife"
]
},

{
text:"🗺️ Do you prefer famous attractions or hidden gems?",
type:"options",
options:[
"⭐ Famous spots",
"💎 Hidden gems",
"⚖️ Mix of both"
]
},

{
text:"📍 Are there any must-see places?",
type:"text"
},

{
text:"👥 Who are you traveling with?",
type:"options",
options:[
"🧍 Solo",
"❤️ Couple",
"🎉 Friends",
"👨‍👩‍👧 Family"
]
}

];

function loadQuestion(){

let q = questions[step];

document.getElementById("question").innerText = q.text;

let inputArea = document.getElementById("inputArea");
inputArea.innerHTML = "";

if(q.type === "text"){

inputArea.innerHTML =
`<input id="answerInput" placeholder="Type your answer">`;

if(answers[step]){
document.getElementById("answerInput").value = answers[step];
}

}

if(q.type === "options"){

q.options.forEach(option => {

let btn = document.createElement("button");

btn.innerText = option;

btn.className = "optionBtn";

btn.onclick = () => {

answers[step] = option;

handleConditional(option);

next();

};

inputArea.appendChild(btn);

});

}

}

function next(){

let q = questions[step];

if(q.type === "text"){

let input = document.getElementById("answerInput").value;

if(input.trim()===""){
alert("Please enter an answer");
return;
}

answers[step] = input;

}

step++;

if(step < questions.length){
loadQuestion();
}else{
showResult();
}

}

function back(){

if(step>0){
step--;
loadQuestion();
}

}

function handleConditional(answer){

if(answer.includes("Friends")){

questions.splice(step+1,0,{
text:"👥 How many friends are traveling?",
type:"text"
});

}

if(answer.includes("Family")){

questions.splice(step+1,0,{
text:"👨‍👩‍👧 How many family members are traveling?",
type:"text"
});

}

}

function showResult(){

let summary = "<h2>✈️ Your Travel Profile</h2>";

questions.forEach((q,i)=>{

summary += `<p><strong>${q.text}</strong><br>${answers[i]}</p>`;

});

summary += "<h3>🤖 Generating AI itinerary...</h3>";

document.getElementById("app").innerHTML = summary;

}

loadQuestion();