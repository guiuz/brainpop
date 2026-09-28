module.exports = {
  extends: ['expo'],
  ignorePatterns: [
    'dist/*',
    'node_modules/*',
    'backend/*',
    'todas telas/*',
    '*.config.js'
  ],
  rules: {
    // Previne erros bloqueadores desnecessários na fase inicial de transição
  },
};
