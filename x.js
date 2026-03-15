let step = 0
let answers = []

let questions = [

{question:"🌍 Where are you traveling to?",type:"text"},

{question:"📅 How many days is your trip?",type:"text"},

{
question:"💰 What is your budget level?",
type:"options",
options:[
"💸 Budget",
"💳 Mid-range",
"💎 Luxury"
]
},

{
question:"🎯 What is the main goal of your trip?",
type:"options",
options:[
"🧘 Relaxation",
"🏔 Adventure",
"🏛 Culture",
"🍜 Food",
"🎉 Nightlife"
]
},

{
question:"⚡ How busy do you want your schedule?",
type:"options",
options:[
"🧘 Relaxed",
"🚶 Balanced",
"🚀 Packed"
]
},

{
question:"🌶 Do you like spicy food?",
type:"options",
options:[
"🔥 Love spicy food",
"🙂 Mild spice",
"🚫 No spice",
"🤷 No preference"
]
},

{question:"⚠️ Any food allergies?",type:"text"},

{
question:"🏨 Where are you staying?",
type:"options",
options:[
"🏙 City center",
"🏡 Outside city",
"❓ Not booked yet"
]
},

{
question:"🚗 How will you travel around?",
type:"options",
options:[
"🚶 Walking",
"🚇 Public transport",
"🚗 Rental car",
"🤷 No preference"
]
},

{
question:"⏰ When do you start your day?",
type:"options",
options:[
"🌅 Early",
"☀ Normal",
"😴 Late"
]
},

{
question:"🌧 Are you okay with outdoor activities in bad weather?",
type:"options",
options:[
"🌦 Yes",
"🏛 Prefer indoor"
]
},

{
question:"📸 Want Instagram photo spots?",
type:"options",
options:[
"📷 Yes",
"🙂 Not important"
]
},

{
question:"💳 What do you prefer spending money on?",
type:"options",
options:[
"🍜 Food",
"🎟 Attractions",
"🛍 Shopping",
"🍸 Nightlife"
]
},

{
question:"🗺 Famous spots or hidden gems?",
type:"options",
options:[
"⭐ Famous",
"💎 Hidden",
"⚖ Mix"
]
},

{question:"📍 Any must-see places?",type:"text"},

{
question:"👥 Who are you traveling with?",
type:"options",
options:[
"🧍 Solo",
"❤️ Couple",
"🎉 Friends",
"👨‍👩‍👧 Family"
]
}

]

function loadQuestion(){

let q=questions[step]

document.getElementById("question").innerText=q.question

let area=document.getElementById("inputArea")
area.innerHTML=""

updateProgress()

if(q.type==="text"){

area.innerHTML=`<input id="answerInput" placeholder="Type here">`

if(answers[step]){
document.getElementById("answerInput").value=answers[step]
}

}

if(q.type==="options"){

q.options.forEach(option=>{

let btn=document.createElement("button")

btn.className="optionBtn"
btn.innerText=option

btn.onclick=()=>{

answers[step]=option
handleConditional(option)

next()

}

area.appendChild(btn)

})

}

}

function next(){

let q=questions[step]

if(q.type==="text"){

let val=document.getElementById("answerInput").value

if(val.trim()===""){
alert("Please enter something")
return
}

answers[step]=val

}

step++

if(step<questions.length){
loadQuestion()
}
else{
showSummary()
}

}

function back(){
if(step>0){
step--
loadQuestion()
}
}

function handleConditional(answer){

if(answer.includes("Friends")){

questions.splice(step+1,0,{
question:"👥 How many friends?",
type:"text"
})

}

if(answer.includes("Family")){

questions.splice(step+1,0,{
question:"👨‍👩‍👧 How many family members?",
type:"text"
})

}

}

function updateProgress(){

let progress=(step/questions.length)*100
document.getElementById("progressBar").style.width=progress+"%"

}

function showSummary(){

let app=document.getElementById("app")

app.innerHTML=`<h2>Your Travel Profile 🌍</h2><div id="summaryList"></div><button id="restartBtn">Restart</button>`

let list=document.getElementById("summaryList")

questions.forEach((q,i)=>{

let card=document.createElement("div")

card.className="summaryCard"

card.innerHTML=`
<div class="summaryQuestion">${q.question}</div>
<div class="summaryAnswer">${answers[i]||"No answer"}</div>
`

list.appendChild(card)

})

document.getElementById("restartBtn").onclick=()=>location.reload()

}

loadQuestion()