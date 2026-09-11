import fs from 'fs';
const path = 'src/components/Olimpiadas.astro';
let content = fs.readFileSync(path, 'utf8')
    .replace(/<script><\/script>/g, '');
fs.writeFileSync(path, content, 'utf8');
console.log('Removed empty script');