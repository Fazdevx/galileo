import { readFileSync, writeFileSync } from 'fs';

const filePath = 'src/components/Olimpiadas.astro';
let content = readFileSync(filePath, 'utf8');

// Find the apply function and replace it
const oldApply = `const apply = async () => {
        const result = await load(DEFAULT_DATA_COPY);
        renderStats(result.heroStats);
        renderSections(result.sections);
        renderSports(result.sports);
        renderGames(result.games, result.sections);
        renderStandings(result.games, result.sections);
        renderLiveCount(result.games);
    };`;

const newApply = `const apply = async () => {
        // Try to load from Firebase first
        let result = DEFAULT_DATA_COPY;
        try {
            const { fetchData } = await import('../data/api');
            const firebaseData = await fetchData();
            if (firebaseData && firebaseData.sections && firebaseData.sports && firebaseData.games) {
                result = firebaseData;
                console.log('[Olimpiadas] Using Firebase data');
            }
        } catch (e) {
            console.warn('[Olimpiadas] Firebase error:', e);
        }
        
        // Fallback to localStorage if needed
        if (result === DEFAULT_DATA_COPY) {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (parsed.sections && parsed.sports && parsed.games) {
                        result = {
                            sections: parsed.sections || [],
                            sports: parsed.sports || [],
                            games: parsed.games || [],
                            heroStats: parsed.heroStats || { secciones: 0, disciplinas: 0, dias: 0 },
                        };
                        console.log('[Olimpiadas] Using local data');
                    }
                }
            } catch {}
        }
        
        renderStats(result.heroStats);
        renderSections(result.sections);
        renderSports(result.sports);
        renderGames(result.games, result.sections);
        renderStandings(result.games, result.sections);
        renderLiveCount(result.games);
    };`;

if (content.includes(oldApply)) {
    content = content.replace(oldApply, newApply);
    writeFileSync(filePath, content, 'utf8');
    console.log('File updated successfully');
} else {
    console.log('Could not find the apply function to replace');
    console.log('Searching for similar content...');
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('const apply')) {
            console.log(`Found at line ${i + 1}: ${lines[i]}`);
        }
    }
}