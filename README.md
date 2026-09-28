# BrainPOP

> Status: **em desenvolvimento**.

Aplicativo de quiz educacional multiplataforma, com experiência para mobile e web.

## Tecnologias verificadas

- Expo e Expo Router
- React Native, React Native Web e TypeScript
- Firebase
- Cloud Functions for Firebase
- Jest

## Como executar

Pré-requisito: Node.js e npm.

```bash
cp .env.example .env
npm install
npx expo start
```

## Configuração local

Preencha o arquivo `.env` com as configurações de cliente necessárias para Firebase, Google Sign-In e AdMob. O modelo completo está em [`.env.example`](.env.example).

Para builds Android com Firebase, mantenha o arquivo `google-services.json` somente na sua máquina e defina `GOOGLE_SERVICES_FILE=./google-services.json` no `.env`. Arquivos de ambiente, credenciais de serviço e configurações reais são ignorados pelo Git e não fazem parte deste repositório.

Comandos disponíveis:

```bash
npm test
npm run typecheck
npm run lint
```
