const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Ensure JAVA_HOME is configured if running with Android Studio JBR
if (!process.env.JAVA_HOME) {
  const candidates = [
    'C:\\Program Files\\Android\\Android Studio\\jbr',
    'C:\\Program Files\\Android\\Android Studio\\jre',
  ];
  for (const cand of candidates) {
    if (fs.existsSync(cand)) {
      process.env.JAVA_HOME = cand;
      process.env.PATH = `${path.join(cand, 'bin')};${process.env.PATH}`;
      break;
    }
  }
}

const isWin = process.platform === 'win32';
const npxCmd = isWin ? 'npx.cmd' : 'npx';

const fullCommand = `${npxCmd} firebase-tools emulators:exec --only firestore --project demo-brainpop "${npxCmd} jest src/services/__tests__/firestoreRulesEmulator.test.ts --testPathIgnorePatterns none --runInBand"`;

const child = spawnSync(fullCommand, {
  stdio: 'inherit',
  env: process.env,
  shell: true,
});

process.exit(child.status !== null ? child.status : 1);
