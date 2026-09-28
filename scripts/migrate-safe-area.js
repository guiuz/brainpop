/* eslint-env node */
const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '..', 'app');
const files = fs.readdirSync(appDir).filter((f) => f.endsWith('.tsx'));

let migratedCount = 0;

files.forEach((file) => {
  const filePath = path.join(appDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Verifica se o arquivo importa SafeAreaView de 'react-native'
  const rnImportRegex = /import\s*\{([^}]+)\}\s*from\s*['"]react-native['"];?/;
  const match = content.match(rnImportRegex);

  if (match && match[1].includes('SafeAreaView')) {
    console.log(`Migrando SafeAreaView em: app/${file}`);

    // Remove SafeAreaView do import do react-native
    const cleanedRnImports = match[1]
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s && s !== 'SafeAreaView')
      .join(',\n  ');

    let newRnImport = cleanedRnImports.length > 0 
      ? `import {\n  ${cleanedRnImports}\n} from 'react-native';`
      : `// react-native imports migrated`;

    content = content.replace(match[0], newRnImport);

    // Se já não tiver import de react-native-safe-area-context, adiciona
    if (!content.includes("from 'react-native-safe-area-context'")) {
      content = `import { SafeAreaView } from 'react-native-safe-area-context';\n` + content;
    } else {
      // Se já tiver, garante que SafeAreaView está incluído
      content = content.replace(
        /import\s*\{([^}]+)\}\s*from\s*['"]react-native-safe-area-context['"];?/,
        (m, imports) => {
          if (!imports.includes('SafeAreaView')) {
            return `import { SafeAreaView, ${imports.trim()} } from 'react-native-safe-area-context';`;
          }
          return m;
        }
      );
    }

    // Adiciona edges={['top']} se for a SafeAreaView principal
    // (substitui <SafeAreaView style={...}> por <SafeAreaView style={...} edges={['top']}> se não tiver edges ainda)
    content = content.replace(/<SafeAreaView(\s+style=\{[^}]+\})(?! edges)/g, `<SafeAreaView$1 edges={['top']}`);

    fs.writeFileSync(filePath, content, 'utf8');
    migratedCount++;
  }
});

console.log(`Migração concluída com sucesso em ${migratedCount} arquivos.`);
