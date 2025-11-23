# Gerador Backend - API

Backend API para gerador de conteúdo com integração Google Flow, autenticação Google OAuth 2.0, automação via Puppeteer/Playwright e geração de conteúdo com Gemini API.

## 🏗️ Arquitetura

```
Frontend (React/Vite) → Backend (Node.js) → Browser Automation (Puppeteer) → Google Flow
                          ↓
                      Gemini API (LLM)
```

## 📋 Funcionalidades

- ✅ **Autenticação Google OAuth 2.0**: Login seguro e persistência de tokens
- ✅ **Automação Browser**: Controle de navegador headless para simular ações do usuário
- ✅ **Integração Gemini API**: Geração de conteúdo com IA
- ✅ **Gerenciamento de Sessões**: Cookies e session state persistidos
- ✅ **API REST**: Endpoints estruturados para frontend consumir
- ✅ **Tratamento de Erros**: Logging e fallbacks implementados

## 🚀 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Browser Automation**: Puppeteer / Playwright
- **IA/LLM**: Google Gemini API
- **Auth**: Passport.js (Google OAuth)
- **Environment**: dotenv
- **Logging**: Winston / Pino

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Google Cloud Console (para credenciais OAuth)
- Gemini API Key

### Setup Local

```bash
# Clonar repositório
git clone https://github.com/pretinhuu1-boop/gerador-backend.git
cd gerador-backend

# Instalar dependências
npm install

# Criar arquivo .env baseado em .env.example
cp .env.example .env

# Editar .env com suas credenciais
nano .env

# Executar localmente
npm run dev
```

## 🔧 Variáveis de Ambiente

Ver `.env.example` para lista completa:

```env
PORT=3000
NODE_ENV=development

# Google OAuth
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
FRONTEND_URL=http://localhost:5173

# Gemini API
GEMINI_API_KEY=sua_api_key

# JWT
JWT_SECRET=sua_secret_key_aleatoria

# Database (opcional)
MONGODB_URI=mongodb://...
```

## 📚 API Endpoints

### Autenticação

- `GET /auth/google` - Inicia login Google
- `GET /auth/google/callback` - Callback do Google
- `GET /auth/logout` - Logout
- `GET /auth/me` - Retorna usuário atual

### Geração de Conteúdo

- `POST /api/flow-generate` - Inicia geração via Google Flow
- `GET /api/flow-generate/:jobId` - Status de um job
- `GET /api/flow-generate/:jobId/result` - Resultado final

### Gemini (IA)

- `POST /api/gemini/generate` - Gera conteúdo com Gemini

## 🔐 Fluxo de Autenticação

1. Frontend redireciona usuário para `/auth/google`
2. Google OAuth retorna para `/auth/google/callback`
3. Backend salva `refresh_token`, cookies, `session_state`
4. JWT criado e retornado para frontend (localStorage/cookies)
5. Requests subsequentes incluem JWT no header `Authorization`

## 🌐 Fluxo de Geração de Conteúdo

1. Frontend faz `POST /api/flow-generate` com:
   - `prompt`: descrição do conteúdo
   - `preset`: configurações (modelo, resolução, etc)
   - `images`: array de imagens (base64)
   - `audio`: arquivo de áudio (opcional)

2. Backend:
   - Valida JWT e recupera sessão do usuário
   - Abre navegador headless e injeta cookies
   - Navega até Google Flow
   - Injeta payload de geração
   - Dispara geração e monitora job
   - Faz polling ou aguarda webhook
   - Retorna URL de download quando pronto

3. Frontend:
   - Recebe URL de download
   - Oferece opção de preview/download

## 🧪 Testando Localmente

```bash
# Iniciar servidor em dev mode
npm run dev

# Em outro terminal, testar endpoint
curl http://localhost:3000/api/health

# Testar login
curl http://localhost:3000/auth/google
```

## 🚢 Deploy

### Railway

```bash
# Conectar repositório ao Railway
# Adicionar variáveis de ambiente no painel do Railway
# Deploy automático via git push
```

### Render

```bash
# Similar ao Railway
# Connect GitHub repo → Render
# Configure env vars
# Deploy
```

## 📁 Estrutura de Pastas

```
gerador-backend/
├── src/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── flow.js
│   │   └── gemini.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── flowController.js
│   │   └── geminiController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── utils/
│   │   ├── puppeteer.js
│   │   ├── gemini.js
│   │   └── logger.js
│   ├── config/
│   │   ├── passport.js
│   │   └── database.js
│   └── app.js
├── .env.example
├── package.json
├── server.js
└── README.md
```

## 🐛 Troubleshooting

### Puppeteer não encontra Chromium
- Instale `@sparticuz/chromium` para serverless
- Ou use `PUPPETEER_EXECUTABLE_PATH` apontando para Chrome/Chromium instalado

### Google OAuth "Invalid redirect_uri"
- Verifique `GOOGLE_CALLBACK_URL` no .env
- Configure a mesma URL no Google Cloud Console

### Gemini API Rate Limit
- Implemente throttling/queue
- Considere usar `bull` para job queue

## 📝 Próximos Passos

- [ ] Implementar endpoints de autenticação
- [ ] Setup Puppeteer/Playwright
- [ ] Integrar Gemini API
- [ ] Criar /flow-generate endpoint
- [ ] Implementar persistência de sessão (DB)
- [ ] Adicionar testes automatizados
- [ ] Documentação Swagger/OpenAPI
- [ ] Rate limiting e segurança

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

MIT

## 👨‍💻 Autor

**pretinhuu1-boop**
