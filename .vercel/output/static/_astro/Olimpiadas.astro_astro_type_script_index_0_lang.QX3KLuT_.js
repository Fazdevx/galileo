var e={sections:[],sports:[],games:[],heroStats:{secciones:0,disciplinas:0,dias:0},prizes:[{id:`p1`,name:`5% Descuento`,description:`5% de descuento en tu próxima mensualidad`,type:`descuento_mensualidad`,value:5,color:`bg-emerald-500`,icon:`money`},{id:`p2`,name:`10% Descuento`,description:`10% de descuento en tu próxima mensualidad`,type:`descuento_mensualidad`,value:10,color:`bg-brand-500`,icon:`gift`},{id:`p3`,name:`15% Descuento`,description:`15% de descuento en tu próxima mensualidad`,type:`descuento_mensualidad`,value:15,color:`bg-purple-500`,icon:`star`},{id:`p4`,name:`20% Matrícula`,description:`20% de descuento en matrícula de tu hijo`,type:`descuento_matricula`,value:20,color:`bg-rose-500`,icon:`graduation`},{id:`p5`,name:`1 Libro`,description:`1 libro de regalo para tu hijo`,type:`libro`,value:1,color:`bg-sky-500`,icon:`book`},{id:`p6`,name:`2 Cuadernos`,description:`2 cuadernos de regalo`,type:`cuaderno`,value:2,color:`bg-amber-500`,icon:`notebook`},{id:`p7`,name:`5% Descuento`,description:`5% de descuento en tu próxima mensualidad`,type:`descuento_mensualidad`,value:5,color:`bg-emerald-500`,icon:`money`},{id:`p8`,name:`10% Descuento`,description:`10% de descuento en tu próxima mensualidad`,type:`descuento_mensualidad`,value:10,color:`bg-brand-500`,icon:`gift`},{id:`p9`,name:`15% Descuento`,description:`15% de descuento en tu próxima mensualidad`,type:`descuento_mensualidad`,value:15,color:`bg-purple-500`,icon:`star`},{id:`p10`,name:`20% Matrícula`,description:`20% de descuento en matrícula de tu hijo`,type:`descuento_matricula`,value:20,color:`bg-rose-500`,icon:`graduation`},{id:`p11`,name:`1 Libro`,description:`1 libro de regalo para tu hijo`,type:`libro`,value:1,color:`bg-sky-500`,icon:`book`},{id:`p12`,name:`2 Cuadernos`,description:`2 cuadernos de regalo`,type:`cuaderno`,value:2,color:`bg-amber-500`,icon:`notebook`},{id:`p13`,name:`5% Descuento`,description:`5% de descuento en tu próxima mensualidad`,type:`descuento_mensualidad`,value:5,color:`bg-emerald-500`,icon:`money`},{id:`p14`,name:`10% Descuento`,description:`10% de descuento en tu próxima mensualidad`,type:`descuento_mensualidad`,value:10,color:`bg-brand-500`,icon:`gift`},{id:`p15`,name:`15% Descuento`,description:`15% de descuento en tu próxima mensualidad`,type:`descuento_mensualidad`,value:15,color:`bg-purple-500`,icon:`star`},{id:`p16`,name:`20% Matrícula`,description:`20% de descuento en matrícula de tu hijo`,type:`descuento_matricula`,value:20,color:`bg-rose-500`,icon:`graduation`}]};(async()=>{let t=`galileo-olimpiadas-v2`,n=async e=>{try{let n=localStorage.getItem(t);if(!n)return e;let r=JSON.parse(n);return{sections:Array.isArray(r.sections)?r.sections:e.sections,sports:Array.isArray(r.sports)?r.sports:e.sports,games:Array.isArray(r.games)?r.games:e.games,heroStats:r.heroStats||e.heroStats}}catch{return e}},r=e=>{let n=()=>e();window.addEventListener(`galileo-data-changed`,n),window.addEventListener(`storage`,e=>{e.key===t&&n()})},i=(e,t)=>{let n=t.map(e=>({id:e.id,name:e.name,initial:e.initial,color:e.color,pj:0,g:0,e:0,p:0,pts:0}));return e.forEach(e=>{if(!e.status.includes(`Finalizado`))return;let t=n.find(t=>t.name===e.local),r=n.find(t=>t.name===e.visit);t&&r&&(t.pj++,r.pj++,e.localScore>e.visitScore?(t.g++,t.pts+=3,r.p++):e.localScore<e.visitScore?(r.g++,r.pts+=3,t.p++):(t.e++,r.e++,t.pts+=1,r.pts+=1))}),n.sort((e,t)=>t.pts-e.pts||t.g-e.g),n},a=JSON.parse(JSON.stringify(e)),o=e=>{let t=document.querySelector(`[data-sections-list]`);t&&(t.innerHTML=e.map(e=>`
      <span class="inline-flex items-center gap-2 rounded-full ${e.color} px-3 py-1.5 text-xs font-bold text-white">
        <span class="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[10px]">${e.initial||`?`}</span>
        ${e.name}
      </span>
    `).join(``))},s=e=>{let t=document.querySelector(`[data-sports-list]`);t&&(t.innerHTML=e.map(e=>`
      <div class="flex items-center gap-2 rounded-xl bg-slate-50 p-2.5 transition hover:bg-brand-50 sm:gap-3 sm:p-3">
        <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600 sm:h-9 sm:w-9">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="3"/></svg>
        </div>
        <span class="text-xs font-semibold text-navy-700 sm:text-sm">${e}</span>
      </div>
    `).join(``))},c=(e,t)=>{let n=document.querySelector(`[data-games-list]`);if(!n)return;let r=e=>t.find(t=>t.name===e);n.innerHTML=e.map(e=>{let t=r(e.local),n=r(e.visit),i=(e.status||``).includes(`En vivo`);return`
        <article data-game-id="${e.id}" class="overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-lg sm:p-6 ${i?`ring-2 ring-brand-400`:``}">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase text-slate-600">${e.sport||``}</span>
            <span class="rounded-full px-3 py-1 text-xs font-bold ${i?`bg-brand-500 text-white`:`bg-slate-100 text-slate-600`}">${e.status||``}</span>
          </div>
          <div class="mt-4 grid grid-cols-3 items-center gap-2 sm:gap-3">
            <div class="text-center">
              <div class="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full ${t?.color||`bg-slate-500`} text-lg font-extrabold text-white sm:h-14 sm:w-14 sm:text-xl">${t?.initial??(e.local||`?`)[8]??`?`}</div>
              <p class="text-xs font-bold text-navy-700 sm:text-sm">${e.local||``}</p>
            </div>
            <div class="text-center">
              <p class="text-3xl font-black text-navy-700 tabular-nums sm:text-5xl">${e.localScore} <span class="text-xl text-slate-400 sm:text-2xl">-</span> ${e.visitScore}</p>
              <p class="mt-1 text-[10px] text-slate-500 sm:text-xs">${e.date||``}</p>
            </div>
            <div class="text-center">
              <div class="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full ${n?.color||`bg-slate-500`} text-lg font-extrabold text-white sm:h-14 sm:w-14 sm:text-xl">${n?.initial??(e.visit||`?`)[8]??`?`}</div>
              <p class="text-xs font-bold text-navy-700 sm:text-sm">${e.visit||``}</p>
            </div>
          </div>
        </article>
      `}).join(``)||`<p class="col-span-full text-center text-sm text-slate-500">No hay partidos registrados.</p>`},l=(e,t)=>{let n=document.querySelector(`[data-standings-body]`);n&&(n.innerHTML=i(e,t).map((e,t)=>`
      <tr data-standings-row="${e.id}" class="${t===0?`bg-brand-50`:``}">
        <td class="px-4 py-3 font-bold text-navy-700 sm:px-6">${t+1}</td>
        <td class="px-4 py-3 sm:px-6">
          <div class="flex items-center gap-2 sm:gap-3">
            <span class="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full ${e.color} text-xs font-extrabold text-white sm:h-8 sm:w-8">${e.initial}</span>
            <span class="${t===0?`font-extrabold text-brand-600`:`font-semibold text-slate-700`}">${e.name}</span>
          </div>
        </td>
        <td class="px-4 py-3 text-center tabular-nums sm:px-6">${e.pj}</td>
        <td class="px-4 py-3 text-center tabular-nums sm:px-6">${e.g}</td>
        <td class="px-4 py-3 text-center tabular-nums sm:px-6">${e.e}</td>
        <td class="px-4 py-3 text-center tabular-nums sm:px-6">${e.p}</td>
        <td class="px-4 py-3 text-center font-bold tabular-nums sm:px-6 ${t===0?`text-brand-600`:`text-navy-700`}">${e.pts}</td>
      </tr>
    `).join(``))},u=e=>{document.querySelectorAll(`[data-stat]`).forEach(t=>{let n=t.getAttribute(`data-stat`);e&&e[n]!=null&&(t.textContent=e[n])})},d=e=>{let t=document.querySelector(`[data-live-count]`);if(!t)return;let n=e.filter(e=>(e.status||``).includes(`En vivo`)).length;t.textContent=`${n} partido${n===1?``:`s`} en vivo`},f=async()=>{let e=await n(a);u(e.heroStats),o(e.sections),s(e.sports),c(e.games,e.sections),l(e.games,e.sections),d(e.games)};f(),r(f)})();