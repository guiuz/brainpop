/* eslint-env node */
const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '..', 'app');
const files = fs.readdirSync(appDir).filter((f) => f.endsWith('.tsx'));

files.forEach((file) => {
  const filePath = path.join(appDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Corrige style={{ ... } edges={['top']}} para style={{ ... }} edges={['top']}
  const fixed = content.replace(/style=\{\{([^}]+)\}\s*edges=\{(\[[^\]]+\])\}\}/g, 'style={{$1}} edges={$2}');
  if (fixed !== content) {
    console.log(`Corrigido JSX em: app/${file}`);
    fs.writeFileSync(filePath, fixed, 'utf8');
  }
});

console.log('Verificação de sintaxe de SafeAreaView concluída.');
