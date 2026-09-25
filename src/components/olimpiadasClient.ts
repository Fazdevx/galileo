import { load, subscribeToData, calculateStandings } from '../lib/olimpiadasClient';
import { DEFAULT_DATA } from '../data/olimpiadasStore';
import type { OlimpiadasData } from '../data/olimpiadasStore';

const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!),
  );

function updateStats(heroStats: OlimpiadasData['heroStats']) {
  const stats = heroStats || { secciones: 0, disciplinas: 0, dias: 0 };
  const seccionesEl = document.querySelector('[data-stat="secciones"]');
  const disciplinasEl = document.querySelector('[data-stat="disciplinas"]');
  const diasEl = document.querySelector('[data-stat="dias"]');
  if (seccionesEl) seccionesEl.textContent = String(stats.secciones ?? 0);
  if (disciplinasEl) disciplinasEl.textContent = String(stats.disciplinas ?? 0);
  if (diasEl) diasEl.textContent = String(stats.dias ?? 0);
}

function updateGames(games: OlimpiadasData['games']) {
  const gamesContainer = document.getElementById('games-container');
  const gamesLoading = document.getElementById('games-loading');
  if (!gamesContainer) return;
  if (gamesLoading) gamesLoading.remove();
  if (games && games.length > 0) {
    gamesContainer.innerHTML = games
      .map((game) => {
        const isFinished = game.status && game.status.includes('Finalizado');
        const statusClass = isFinished
          ? 'bg-emerald-500/20 text-emerald-300'
          : 'bg-blue-500/20 text-blue-300';
        return `<div class="flex items-center justify-between gap-4 p-3 rounded-lg bg-navy-900/50 border border-slate-700 hover:border-slate-500 transition-colors">
          <div class="flex items-center gap-3">
            <span class="text-xs font-bold uppercase tracking-wider text-brand-400 w-16">${esc(game.sport)}</span>
            <span class="text-sm font-semibold text-navy-100">${esc(game.local)}</span>
            <span class="text-2xl font-extrabold text-navy-100 mx-2">${game.localScore != null ? game.localScore : '-'} - ${game.visitScore != null ? game.visitScore : '-'}</span>
            <span class="text-sm font-semibold text-navy-100">${esc(game.visit)}</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full ${statusClass}">${esc(game.status || 'Pendiente')}</span>
            <span class="text-xs text-slate-400">${esc(game.date)}</span>
          </div>
        </div>`;
      })
      .join('');
  } else {
    gamesContainer.innerHTML = '<div class="text-center py-6 text-navy-400"><p class="text-sm">No hay partidos programados</p></div>';
  }
}

function updateStandings(data: OlimpiadasData) {
  const standingsBody = document.querySelector('[data-standings-body]');
  const standingsLoading = document.getElementById('standings-loading');
  if (!standingsBody) return;
  if (standingsLoading) standingsLoading.remove();
  const standings = calculateStandings(data.games || [], data.sections || []);
  if (standings.length > 0) {
    standingsBody.innerHTML = standings
      .map((s, idx) => {
        const isLeader = idx === 0;
        return `<tr class="${isLeader ? 'bg-brand-500/10' : ''} hover:bg-navy-800/50 transition-colors">
          <td class="px-4 py-3 text-center font-bold ${isLeader ? 'text-brand-400' : 'text-slate-400'} sm:px-6">${idx + 1}</td>
          <td class="px-4 py-3 sm:px-6"><div class="flex items-center gap-3"><span class="flex h-8 w-8 items-center justify-center rounded-full ${esc(s.color)} text-xs font-extrabold text-white">${esc(s.initial)}</span><span class="font-semibold text-navy-100">${esc(s.name)}</span></div></td>
          <td class="px-4 py-3 text-center text-slate-300 sm:px-6">${s.pj}</td>
          <td class="px-4 py-3 text-center text-emerald-400 sm:px-6">${s.g}</td>
          <td class="px-4 py-3 text-center text-slate-400 sm:px-6">${s.e}</td>
          <td class="px-4 py-3 text-center text-red-400 sm:px-6">${s.p}</td>
          <td class="px-4 py-3 text-center font-bold text-navy-100 sm:px-6">${s.pts}</td>
        </tr>`;
      })
      .join('');
  } else {
    standingsBody.innerHTML = '<tr><td class="px-4 py-3 text-center text-slate-500" colspan="7">No hay datos disponibles</td></tr>';
  }
}

function updateUI(data: OlimpiadasData) {
  updateStats(data.heroStats);
  updateGames(data.games);
  updateStandings(data);
}

export function initOlimpiadas() {
  const start = () => {
    load(DEFAULT_DATA).then(updateUI);
    subscribeToData(updateUI);
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
}