import { load, onDataChanged, calculateStandings } from '../lib/olimpiadasClient';
import { DEFAULT_DATA } from '../data/olimpiadasStore';

export function initOlimpiadas() {
    function updateUI(data: any) {
        const heroStats = data.heroStats || { secciones: 0, disciplinas: 0, dias: 0 };
        const seccionesEl = document.querySelector('[data-stat="secciones"]');
        const disciplinasEl = document.querySelector('[data-stat="disciplinas"]');
        const diasEl = document.querySelector('[data-stat="dias"]');
        if (seccionesEl) seccionesEl.textContent = heroStats.secciones || 0;
        if (disciplinasEl) disciplinasEl.textContent = heroStats.disciplinas || 0;
        if (diasEl) diasEl.textContent = heroStats.dias || 0;

        const gamesContainer = document.getElementById('games-container');
        const gamesLoading = document.getElementById('games-loading');
        if (gamesContainer && gamesLoading) {
            gamesLoading.remove();
            if (data.games && data.games.length > 0) {
                gamesContainer.innerHTML = data.games.map(function(game: any) {
                    const isFinished = game.status && game.status.indexOf('Finalizado') !== -1;
                    const statusClass = isFinished ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300';
                    return '<div class="flex items-center justify-between gap-4 p-3 rounded-lg bg-navy-900/50 border border-slate-700 hover:border-slate-500 transition-colors"><div class="flex items-center gap-3"><span class="text-xs font-bold uppercase tracking-wider text-brand-400 w-16">' + (game.sport || '') + '</span><span class="text-sm font-semibold text-navy-100">' + game.local + '</span><span class="text-2xl font-extrabold text-navy-100 mx-2">' + (game.localScore != null ? game.localScore : '-') + ' - ' + (game.visitScore != null ? game.visitScore : '-') + '</span><span class="text-sm font-semibold text-navy-100">' + game.visit + '</span></div><div class="flex items-center gap-3"><span class="text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full ' + statusClass + '">' + (game.status || 'Pendiente') + '</span><span class="text-xs text-slate-400">' + (game.date || '') + '</span></div></div>';
                }).join('');
            } else {
                gamesContainer.innerHTML = '<div class="text-center py-6 text-navy-400"><p class="text-sm">No hay partidos programados</p></div>';
            }
        }

        const standingsBody = document.querySelector('[data-standings-body]');
        const standingsLoading = document.getElementById('standings-loading');
        if (standingsBody && standingsLoading) {
            standingsLoading.remove();
            const standings = calculateStandings(data.games || [], data.sections || []);
            if (standings.length > 0) {
                standingsBody.innerHTML = standings.map(function(s: any, idx: number) {
                    return '<tr class="' + (idx === 0 ? 'bg-brand-500/10' : '') + ' hover:bg-navy-800/50 transition-colors"><td class="px-4 py-3 text-center font-bold ' + (idx === 0 ? 'text-brand-400' : 'text-slate-400') + ' sm:px-6">' + (idx + 1) + '</td><td class="px-4 py-3 sm:px-6"><div class="flex items-center gap-3"><span class="flex h-8 w-8 items-center justify-center rounded-full ' + s.color + ' text-xs font-extrabold text-white sm:h-8 sm:w-8">' + s.initial + '</span><span class="font-semibold text-navy-100">' + s.name + '</span></div></td><td class="px-4 py-3 text-center text-slate-300 sm:px-6">' + s.pj + '</td><td class="px-4 py-3 text-center text-emerald-400 sm:px-6">' + s.g + '</td><td class="px-4 py-3 text-center text-slate-400 sm:px-6">' + s.e + '</td><td class="px-4 py-3 text-center text-red-400 sm:px-6">' + s.p + '</td><td class="px-4 py-3 text-center font-bold text-navy-100 sm:px-6">' + s.pts + '</td></tr>';
                }).join('');
            } else {
                standingsBody.innerHTML = '<tr><td class="px-4 py-3 text-center text-slate-500" colspan="7">No hay datos disponibles</td></tr>';
            }
        }
    }

    load(DEFAULT_DATA).then(function(data: any) {
        updateUI(data);
        console.log('[Olimpiadas] Datos cargados:', data);
    }).catch(function(err: any) {
        console.error('[Olimpiadas] Error cargando datos:', err);
        updateUI(DEFAULT_DATA);
    });

    onDataChanged(function() {
        load(DEFAULT_DATA).then(function(data: any) {
            updateUI(data);
        });
    });
}
