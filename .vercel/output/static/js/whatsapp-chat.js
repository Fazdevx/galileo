(function() {
'use strict';
function start() {
var T=document.getElementById('wa-toggle-btn');
var C=document.getElementById('wa-close-btn');
var P=document.getElementById('wa-chat-panel');
var O=document.getElementById('wa-overlay');
var M=document.getElementById('wa-messages');
var I=document.getElementById('wa-input');
var S=document.getElementById('wa-send-btn');
var B=document.getElementById('wa-badge');
if(!T||!P||!M||!I||!S){console.warn('[WA] Falta elemento');return;}
var open=false,msgCount=0;
var R={hola:'Hola! Soy el asistente de Colegio Galileo.',inscribir:'Claro que si! Tenemos inscripciones.',curso:'Ofrecemos Educacion Inicial, Primaria, Secundaria y Bachillerato.',donar:'Que bendicion! Puedes donar por transferencia Cuscatlan.',info:'Colegio Galileo, mas de 20 anos formando estudiantes.',default:'Gracias! Contactanos en WhatsApp.'};
function g(t){t=t.toLowerCase().trim();for(var k in R)if(t===k||t.indexOf(k)!==-1)return R[k];return R.default;}
function a(h,isBot){setTimeout(function(){var d=document.createElement('div');if(isBot){d.className='flex gap-2.5 justify-end';d.innerHTML='<div>'+h+'</div>'}else{d.className='flex gap-2.5 justify-start';d.innerHTML='<div>'+h+'</div>'}M.appendChild(d);M.scrollTop=M.scrollHeight;msgCount++;u();},isBot?100:0);}
function u(){if(!B)return;if(msgCount>0){B.textContent=msgCount>9?'9+':msgCount;B.classList.remove('hidden')}else{B.classList.add('hidden')}}
function s(t){t=t||I.value.trim();if(!t)return;a(t.replace(/\n/g,'<br>'),false);I.value='';if(S)S.disabled=true;setTimeout(function(){a(g(t),true,800)},100);}
function o(){if(!P||!O||!I)return;open=true;P.classList.remove('hidden');O.classList.remove('hidden');I.focus();document.body.style.overflow='hidden';if(msgCount===0){a('Hola! Soy el asistente virtual.',true);a('En que puedo ayudarte?',true);setTimeout(function(){var f=document.createDocumentFragment();['Inscribir','Cursos','Donar'].forEach(function(l){var w=document.createElement('div');w.className='flex gap-2 mt-2';var b=document.createElement('button');b.setAttribute('data-wa-quick',l.toLowerCase()=='inscribir'?'Quiero inscribir':'Que cursos ofrecen?');b.className='text-sm rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 hover:bg-emerald-100';b.textContent=l;b.addEventListener('click',function(){I.value=b.getAttribute('data-wa-quick');if(S)S.disabled=false;s()});w.appendChild(b);f.appendChild(w)});M.appendChild(f);M.scrollTop=M.scrollHeight},800);}}
function c(){if(!P||!O||!I)return;open=false;P.classList.add('hidden');O.classList.add('hidden');I.value='';if(S)S.disabled=true;document.body.style.overflow='';I.blur();}
if(T)T.addEventListener('click',function(){open?c():o()});
if(C)C.addEventListener('click',c);
if(O)O.addEventListener('click',c);
if(I){I.addEventListener('input',function(){if(S)S.disabled=!I.value.trim()});I.addEventListener('keydown',function(e){if(e.key=='Enter'&&!e.shiftKey){e.preventDefault();s()}})}
if(S)S.addEventListener('click',function(){s()});
if(M)M.addEventListener('click',function(e){var btn=e.target.closest('[data-wa-quick]');if(btn){I.value=btn.getAttribute('data-wa-quick');if(S)S.disabled=false;s()}});
document.addEventListener('keydown',function(e){if(e.key=='Escape'&&open)c()});
u();
}
if(document.readyState=='loading')document.addEventListener('DOMContentLoaded',start);
else start();
})();
