// Create the fixed script for Olimpiadas.astro
// Step 1: Remove existing script tags
const fs = require('fs');
const path = 'src/components/Olimpiadas.astro';

let content = fs.readFileSync(path, 'utf8');
const scriptStart = content.indexOf('<script>');
const scriptEnd = content.lastIndexOf('</script>') + '</script>'.length;

if (scriptStart >= 0 && scriptEnd > scriptStart) {
    // Remove existing script
    content = content.substring(0, scriptStart) + content.substring(scriptEnd);
    fs.writeFileSync(path, content, 'utf8');
    console.log('Existing script removed');
} else {
    console.log('No existing script found, adding new one');
}

const newScript = '<script>';
const functions = [
    'const STORAGE_KEY = "galileo-olimpiadas-data";',
    'const DEFAULT_DATA_COPY = JSON.parse(JSON.stringify({ sections: [], sports: [], games: [], heroStats: { secciones: 4, disciplinas: 2, dias: 3 } }));',
    'const load = async (fallbackData) => {',
    '  let data = fallbackData;',
    '  const storedRaw = localStorage.getItem(STORAGE_KEY);',
    '  if (storedRaw) {',
    '    try { const parsed = JSON.parse(storedRaw); if (parsed.sections && parsed.sports && parsed.games) data = parsed; } catch {} ',
    '  }',
    '  try {',
    '    const { fetchData } = await import(\'../data/api\');',
    '    const firebaseData = await fetchData();',
    '    if (firebaseData && firebaseData.sections && firebaseData.sports && firebaseData.games) {',
    '      data = firebaseData;',
    '      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(firebaseData)); } catch {}',
    '    }',
    '  } catch {}',
    '  return data;',
    '};',
    '',
    'const onDataChanged = (callback) => {',
    '  window.addEventListener("storage", (e) => { if (e.key === STORAGE_KEY) callback(); });',
    '  setInterval(() => {',
    '    const xhr = new XMLHttpRequest();',
    '    xhr.open("GET", "/api/data?t=" + Date.now(), true);',
    '    xhr.onload = () => {',
    '      try {',
    '        const resp = JSON.parse(xhr.responseText);',
    '        if (resp && resp.sections && resp.sports && resp.games) {',
    '          localStorage.setItem(STORAGE_KEY, JSON.stringify(resp));',
    '          callback();',
    '        }',
    '      } catch {}',
    '    };',
    '    xhr.send();',
    '  }, 10000);',
    '};',
];

functions.forEach(f => { newScript += '\n  ' + f; });

fs.appendFileSync(path, newScript);
console.log('Functions added, continuing...');