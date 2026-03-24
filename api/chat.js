<script>

let conversations = JSON.parse(localStorage.getItem('vladgpt')||'[]');
let active=null;

/* NEW CHAT */
function newChat(){
const c={id:Date.now(),messages:[]};
conversations.push(c);
active=c.id;
save();
render();
}

function save(){
localStorage.setItem('vladgpt',JSON.stringify(conversations));
}

/* SIDEBAR */
function toggleSidebar(){
document.getElementById('sidebar').classList.toggle('open');
document.getElementById('overlay').classList.toggle('show');
}

function closeSidebar(){
document.getElementById('sidebar').classList.remove('open');
document.getElementById('overlay').classList.remove('show');
}

/* 👉 FORMAT TEXT (BOLD / ITALIC) */
function formatText(text){
  return text
    .replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")   // **bold**
    .replace(/\*(.*?)\*/g, "<i>$1</i>");     // *italic*
}

/* TITLE */
function getTitle(chat){
if(!chat.messages.length) return "New Chat";
return chat.messages[0].text.slice(0,28);
}

/* RENDER */
function render(){
const sidebar=document.getElementById('sidebar');
sidebar.innerHTML='';

conversations.forEach(c=>{
const div=document.createElement('div');
div.className='chatItem';
div.innerText=getTitle(c);
div.onclick=()=>openChat(c.id);
sidebar.appendChild(div);
});

const chat=conversations.find(c=>c.id===active);
const box=document.getElementById('chat');
box.innerHTML='';

if(!chat) return;

chat.messages.forEach(m=>{
const d=document.createElement('div');
d.className='msg '+m.role;

/* 👉 IMPORTANT: HTML render */
d.innerHTML = formatText(m.text);

box.appendChild(d);
});
}

/* OPEN CHAT */
function openChat(id){
active=id;
render();
closeSidebar();
}

/* SEND */
async function sendMessage(){
const text=input.value.trim();
if(!text||!active) return;

const chat=conversations.find(c=>c.id===active);

chat.messages.push({role:'user',text});
input.value='';
render();

const res=await fetch('/api/chat',{
method:'POST',
headers:{'Content-Type':'application/json'},
body:JSON.stringify({message:text})
});

const data=await res.json();
chat.messages.push({role:'ai',text:data.reply});

save();
render();
}

/* ENTER */
input.addEventListener('keypress',e=>{
if(e.key==='Enter') sendMessage();
});

/* INIT */
function init(){
if(conversations.length===0) newChat();
else active=conversations[0].id;
render();
}
init();

</script>
