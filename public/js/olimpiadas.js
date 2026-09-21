// Olimpiadas Client - Carga datos de Firebase y actualiza la UI
(function() {
    var firebaseConfig = {
        apiKey: "AIzaSyAgjrkE_Ah-mKOm8naH-aFEB7UrschO40o",
        authDomain: "galiweb-4cc7d.firebaseapp.com",
        projectId: "galiweb-4cc7d",
        storageBucket: "galiweb-4cc7d.firebasestorage.app",
        messagingSenderId: "192323726068",
        appId: "1:192323726068:web:9cebbbd6d9e20c12ce0ca1"
    };

    const DEFAULT_DATA = {
        heroStats: { secciones: 4, disciplinas: 2, dias: 3 },
        games: [],
        sections: [
            { id: 'a', name: 'Seccion A', color: 'bg-blue-500', initial: 'A' },
            { id: 'b', name: 'Seccion B', color: 'bg-red-500', initial: 'B' },
            { id: 'c', name: 'Seccion C', color: 'bg-green-500', initial: 'C' },
            { id: 'd', name: 'Seccion D', color: 'bg-yellow-500', initial: 'D' }
        ]
    };

    let db;
    let firebaseApp;

    async function initFirebase() {
        if (firebaseApp) return firebaseApp;
        const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
        const { getFirestore, doc, getDoc, onSnapshot } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        firebaseApp = initializeApp(firebaseConfig);
        db = getFirestore(firebaseApp);
        return { doc, getDoc, onSnapshot };
    }

    function updateStats(heroStats) {
        var seccionesEl = document.querySelector('[data-stat="secciones"]');
        var disciplinasEl = document.querySelector('[data-stat="disciplinas"]');
        var diasEl = document.querySelector('[data-stat="dias"]');
        if (seccionesEl) seccionesEl.textContent = heroStats.secciones || 0;
        if (disciplinasEl) disciplinasEl.textContent = heroStats.disciplinas || 0;
        if (diasEl) diasEl.textContent = heroStats.dias || 0;
    }

    function updateGames(games) {
        var gamesContainer = document.getElementById('games-container');
        var gamesLoading = document.getElementById('games-loading');
        if (!gamesContainer || !gamesLoading) return;
        gamesLoading.remove();
        if (games && games.length > 0) {
            gamesContainer.innerHTML = games.map(function(game) {
                var isFinished = game.status && game.status.indexOf('Finalizado') !== -1;
                var statusClass = isFinished ? 'bg-emerald-500/20 text-emerald-300' : 'bg-blue-500/20 text-blue-300';
                return '<div class="flex items-center justify-between gap-4 p-3 rounded-lg bg-navy-900/50 border border-slate-700 hover:border-slate-500 transition-colors"><div class="flex items-center gap-3"><span class="text-xs font-bold uppercase tracking-wider text-brand-400 w-16">' + (game.sport || '') + '</span><span class="text-sm font-semibold text-navy-100">' + game.local + '</span><span class="text-2xl font-extrabold text-navy-100 mx-2">' + (game.localScore != null ? game.localScore : '-') + ' - ' + (game.visitScore != null ? game.visitScore : '-') + '</span><span class="text-sm font-semibold text-navy-100">' + game.visit + '</span></div><div class="flex items-center gap-3"><span class="text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded-full ' + statusClass + '">' + (game.status || 'Pendiente') + '</span><span class="text-xs text-slate-400">' + (game.date || '') + '</span></div></div>';
            }).join('');
        } else {
            gamesContainer.innerHTML = '<div class="text-center py-6 text-navy-400"><p class="text-sm">No hay partidos programados</p></div>';
        }
    }
    function calculateStandings(games, sections) {
        console.log('[Olimpiadas] Calculando standings con', games.length, 'partidos y', sections.length, 'secciones');
        var stats = {};
        sections.forEach(function(s) {
            stats[s.id] = { id: s.id, name: s.name, color: s.color, initial: s.initial, pj: 0, g: 0, e: 0, p: 0, pts: 0 };
        });

        // Crear mapa de nombres a IDs
        var nameToId = {};
        sections.forEach(function(s) {
            nameToId[s.name.toLowerCase()] = s.id;
            nameToId[s.name] = s.id;
        });
        console.log('[Olimpiadas] Mapa de nombres a IDs:', nameToId);

        games.forEach(function(game) {
            console.log('[Olimpiadas] Procesando partido:', game);
            var localScore = game.localScore;
            var visitScore = game.visitScore;
            var localName = game.local;
            var visitName = game.visit;

            if (!localName || !visitName || localScore == null || visitScore == null) {
                console.log('[Olimpiadas] Partido ignorado - faltan datos. localName:', localName, 'visitName:', visitName, 'localScore:', localScore, 'visitScore:', visitScore);
                return;
            }

            var localId = nameToId[localName.toLowerCase()] || nameToId[localName];
            var visitId = nameToId[visitName.toLowerCase()] || nameToId[visitName];

            if (!localId || !visitId) {
                console.log('[Olimpiadas] No se pudo mapear nombre a ID. localName:', localName, 'visitName:', visitName, 'localId:', localId, 'visitId:', visitId);
                return;
            }

            var local = stats[localId];
            var visit = stats[visitId];
            if (!local || !visit) {
                console.log('[Olimpiadas] Sección no encontrada:', localId, visitId);
                return;
            }

            local.pj++;
            visit.pj++;
            if (localScore > visitScore) { local.g++; local.pts += 3; visit.p++; }
            else if (localScore < visitScore) { visit.g++; visit.pts += 3; local.p++; }
            else { local.e++; visit.e++; local.pts++; visit.pts++; }
            console.log('[Olimpiadas] Partido procesado. local:', local.name, 'visit:', visit.name, 'score:', localScore, '-', visitScore, 'pts local:', local.pts, 'pts visit:', visit.pts);
        });
        var result = Object.values(stats).sort(function(a, b) {
            if (b.pts !== a.pts) return b.pts - a.pts;
            if (b.g !== a.g) return b.g - a.g;
            return a.p - b.p;
        });
        console.log('[Olimpiadas] Standings calculados:', result);
        return result;
    }

    function updateStandings(data) {
        console.log('[Olimpiadas] Actualizando standings con datos:', data);
        var standingsBody = document.querySelector('[data-standings-body]');
        var standingsLoading = document.getElementById('standings-loading');
        if (!standingsBody) {
            console.log('[Olimpiadas] No se encontró standings-body');
            return;
        }
        // Solo remover loading si existe (en actualizaciones posteriores ya no estará)
        if (standingsLoading) {
            standingsLoading.remove();
        }
        var standings = calculateStandings(data.games || [], data.sections || []);
        if (standings.length > 0) {
            standingsBody.innerHTML = standings.map(function(s, idx) {
                return '<tr class="' + (idx === 0 ? 'bg-brand-500/10' : '') + ' hover:bg-navy-800/50 transition-colors"><td class="px-2 py-2 text-center font-bold ' + (idx === 0 ? 'text-brand-400' : 'text-slate-400') + ' sm:px-4 sm:py-3">' + (idx + 1) + '</td><td class="px-2 py-2 sm:px-4 sm:py-3"><div class="flex items-center gap-2 sm:gap-3"><span class="flex h-6 w-6 items-center justify-center rounded-full ' + s.color + ' text-[10px] font-extrabold text-white sm:h-8 sm:w-8 sm:text-xs">' + s.initial + '</span><span class="font-semibold text-navy-100 text-xs sm:text-sm">' + s.name + '</span></div></td><td class="px-2 py-2 text-center text-slate-300 sm:px-4 sm:py-3">' + s.pj + '</td><td class="px-2 py-2 text-center text-emerald-400 sm:px-4 sm:py-3">' + s.g + '</td><td class="px-2 py-2 text-center text-slate-400 sm:px-4 sm:py-3">' + s.e + '</td><td class="px-2 py-2 text-center text-red-400 sm:px-4 sm:py-3">' + s.p + '</td><td class="px-2 py-2 text-center font-bold text-navy-100 sm:px-4 sm:py-3">' + s.pts + '</td></tr>';
            }).join('');
            console.log('[Olimpiadas] Tabla actualizada con', standings.length, 'filas');
        } else {
            standingsBody.innerHTML = '<tr><td class="px-2 py-2 text-center text-slate-500 sm:px-4 sm:py-3" colspan="7">No hay datos disponibles</td></tr>';
            console.log('[Olimpiadas] No hay standings para mostrar');
        }
    }

    function updateUI(data) {
        updateStats(data.heroStats || { secciones: 0, disciplinas: 0, dias: 0 });
        updateGames(data.games);
        updateStandings(data);
    }

    async function loadData() {
        try {
            var _a = await initFirebase(), doc = _a.doc, getDoc = _a.getDoc, onSnapshot = _a.onSnapshot;
            var docRef = doc(db, 'olimpiadas', 'olimpiadas-data');
            var snapshot = await getDoc(docRef);
            if (snapshot.exists()) {
                updateUI(snapshot.data());
                console.log('[Olimpiadas] Datos cargados de Firebase');
            } else {
                updateUI(DEFAULT_DATA);
                console.log('[Olimpiadas] Usando datos por defecto');
            }
            onSnapshot(docRef, function(doc) {
                if (doc.exists()) {
                    updateUI(doc.data());
                    console.log('[Olimpiadas] Datos actualizados');
                }
            });
        } catch (err) {
            console.error('[Olimpiadas] Error:', err);
            updateUI(DEFAULT_DATA);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadData);
    } else {
        loadData();
    }
})();
