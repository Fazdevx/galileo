(function() {
'use strict';
function start() {
var T=document.getElementById("wa-toggle-btn"),
C=document.getElementById("wa-close-btn"),
P=document.getElementById("wa-chat-panel"),
O=document.getElementById("wa-overlay"),
M=document.getElementById("wa-messages"),
I=document.getElementById("wa-input"),
S=document.getElementById("wa-send-btn"),
B=document.getElementById("wa-badge");
if(!T||!P||!M||!I||!S){console.warn("[WA Chat] Elementos no encontrados");return;}
var open=!1,msgCount=0;
var R={
hola:"Hola! Soy el asistente de Colegio Galileo. En que puedo ayudarte?",
inscribir:"Claro que si! Tenemos inscripciones para el proximo ano. Contactanos para mas info.",
curso:"Ofrecemos Educacion Inicial, Primaria, Secundaria y Bachillerato, con programas extracurriculares de Ingles, Musica, Deportes y Robotica.",
donar:"Que bendicion! Puedes donar por transferencia Cuscatlan cuenta 123-456-789, PSC 000-0000000-000000000000 o Zelle galileoweb@example.com. Gracias!",
info:"Colegio Galileo, mas de 20 anos formando estudiantes con valores en la zona norte.",
default:"Gracias! Nos comunicaremos contigo pronto. Si prefieres, escribe directamente a nuestro WhatsApp."
};
function getBotReply(t){t=t.toLowerCase().trim();for(var k in R)if(t===k||t.indexOf(k)!==-1)return R[k];return R.default;}
function addMessage(html,isBot,delay){
setTimeout(function(){
var d=document.createElement("div");
if(isBot){
d.className="flex gap-2.5 justify-end";
d.innerHTML='<div class="flex flex-col gap-1 items-end"><div class="max-w-[80%] rounded-lg bg-brand-500 px-3 py-2 text-sm text-white shadow-sm self-end">'+html+'</div></div>';
}else{
d.className="flex gap-2.5 justify-start";
d.innerHTML='<div class="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-navy-400 to-navy-600 text-white"><span class="text-[10px] font-bold">BI</span></div><div class="flex flex-col gap-1"><div class="max-w-[80%] rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-800 shadow-sm self-start">'+html+'</div></div>';
}
M.appendChild(d);
M.scrollTop=M.scrollHeight;
msgCount++;
updateBadge();
},delay||0);
}
function updateBadge(){
if(!B)return;
if(msgCount>0){
B.textContent=msgCount>9?"9+":msgCount;
B.classList.remove("hidden");
}else{
B.classList.add("hidden");
}
}
function sendMessage(customText){
var text=customText||I.value.trim();
if(!text)return;
addMessage(text.replace(/\n/g,"<br>"),false);
I.value="";
if(S)S.disabled=true;
setTimeout(function(){
addMessage(getBotReply(text),true,800+Math.random()*1200);
},100);
}
function openChat(){
if(!P||!O||!I)return;
open=true;
P.classList.remove("hidden");
O.classList.remove("hidden");
I.focus();
document.body.style.overflow="hidden";
if(msgCount===0){
addMessage("Hola! Soy el asistente virtual de <strong>Colegio Galileo</strong>.",true,100);
addMessage("En que puedo ayudarte hoy?",true,400);
setTimeout(function(){
var f=document.createDocumentFragment();
["Inscribir","Cursos","Donar"].forEach(function(label){
var w=document.createElement("div");
w.className="flex flex-wrap gap-2 mt-2";
var b=document.createElement("button");
b.setAttribute("data-wa-quick",label.toLowerCase()==="inscribir"?"Quiero inscribir a mi hijo/a":label.toLowerCase()==="cursos"?"Que cursos ofrecen?":"Como puedo donar?");
b.className="text-[11px] rounded-full bg-navy-50 px-3 py-1.5 text-navy-700 hover:bg-navy-100 transition font-medium";
b.textContent=label;
w.appendChild(b);
f.appendChild(w);
});
M.appendChild(f);
M.scrollTop=M.scrollHeight;
},800);
}
}
function closeChat(){
if(!P||!O||!I)return;
open=false;
P.classList.add("hidden");
O.classList.add("hidden");
I.value="";
if(S)S.disabled=true;
document.body.style.overflow="";
I.blur();
}
if(T)T.addEventListener("click",function(){open?closeChat():openChat();});
if(C)C.addEventListener("click",closeChat);
if(O)O.addEventListener("click",closeChat);
if(I){
I.addEventListener("input",function(){if(S)S.disabled=!I.value.trim();});
I.addEventListener("keydown",function(e){if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();}});
}
if(S)S.addEventListener("click",function(){sendMessage();});
if(M)M.addEventListener("click",function(e){
var btn=e.target.closest("[data-wa-quick]");
if(btn){
I.value=btn.getAttribute("data-wa-quick");
if(S)S.disabled=false;
sendMessage();
}
});
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&open)closeChat();});
updateBadge();
}
if(document.readyState==="loading"){
document.addEventListener("DOMContentLoaded",start);
}else{
start();
}
})();