# 🧹 Zoman Gebäudereinigung

> Modern multilingual cleaning company website with AI-powered chat and email microservices

**Languages:** German • English • French

---

## ✨ Features

- 🌐 **Static Website** - Astro + TailwindCSS with perfect SEO scores
- 🗣️ **Multilingual** - Full i18n support (DE/EN/FR)
- 🤖 **AI Chat Widget** - OpenAI-powered customer support
- 📧 **Contact Forms** - Mailtrap email integration
- 🐳 **Containerized** - Docker-ready microservices
- ☁️ **Cloud-Native** - Azure Static Web Apps + Container Apps
- 🚀 **CI/CD** - Automated GitHub Actions pipelines

---

## 📋 Prerequisites

Install these before starting:

```bash
# Node.js 18 or higher
node --version

# Astro CLI (required for website)
npm create astro@latest

# Docker Desktop (for microservices)
docker --version
docker-compose --version
```

---

## 🚀 Quick Start

### 1️⃣ Clone & Install

```bash
git clone https://github.com/SouhailFl/zoman-gebaudereinigung.git
cd zoman-gebaudereinigung

# Install all dependencies
cd website && npm install
cd ../email-service && npm install
cd ../agent-service && npm install
cd ..
```

### 2️⃣ Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit with your credentials
nano .env
```

**Required Variables:**
```env
# Mailtrap (get from https://mailtrap.io)
MAILTRAP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_PORT=2525
MAILTRAP_USER=your_username
MAILTRAP_PASS=your_password

# OpenAI (optional - currently uses mock AI)
# Uncomment OpenAI code in agent-service/src/index.js to enable
OPENAI_API_KEY=sk-your-api-key-here
```

> **Note:** The agent service currently uses **mock AI responses** for testing. To enable real OpenAI integration, uncomment the OpenAI code in `agent-service/src/index.js` and remove the mock response logic.

### 3️⃣ Run Everything

```bash
# Start all services with Docker Compose
docker-compose up --build

# Access:
# 🌐 Website: http://localhost:4321
# 📧 Email API: http://localhost:3001
# 🤖 Chat API: http://localhost:3002
```

**OR run website only:**
```bash
cd website
npm run dev
```

---

## 📁 Project Structure

```
🧹 zoman-gebaudereinigung/
│
├── 🐙 .github/workflows/          # CI/CD Pipelines
│   ├── build-containers.yml
│   ├── deploy-containers.yml
│   └── deploy-website.yml
│
├── 🌐 website/                    # Astro Static Site
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── ChatWidget.astro
│   │   │   ├── ContactForm.astro
│   │   │   ├── Footer.astro
│   │   │   ├── Header.astro
│   │   │   └── ServiceCard.astro
│   │   │
│   │   ├── pages/                # Localized pages
│   │   │   ├── de/              # 🇩🇪 German
│   │   │   ├── en/              # 🇬🇧 English
│   │   │   ├── fr/              # 🇫🇷 French
│   │   │   └── index.astro
│   │   │
│   │   ├── layouts/             # Page layouts
│   │   └── content/             # i18n translations
│   │
│   ├── public/                   # Static assets
│   ├── astro.config.mjs
│   ├── tailwind.config.cjs
│   └── package.json
│
├── 📧 email-service/             # Email Microservice
│   ├── src/index.js
│   ├── Dockerfile
│   └── package.json
│
├── 🤖 agent-service/             # AI Chat Microservice
│   ├── src/index.js
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml            # Local development setup
├── .env                          # Environment variables
└── README.md
```

---

## 🎨 Website Pages

| Route | Description |
|-------|-------------|
| `/` | Auto-redirects to browser language |
| `/de/`, `/en/`, `/fr/` | Localized homepages |
| `/de/services` | Services overview (DE/EN/FR) |
| `/de/contact` | Contact form + map (DE/EN/FR) |

**Each page includes:**
- ✅ SEO-optimized meta tags
- ✅ Open Graph + Twitter Cards
- ✅ JSON-LD structured data
- ✅ Multilingual `hreflang` tags
- ✅ Responsive design (mobile-first)

---

## 🔌 API Endpoints

### 📧 Email Service
**`POST http://localhost:3001/api/contact`**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Cleaning Request",
  "message": "I need help with..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

---

### 🤖 Chat Agent
**`POST http://localhost:3002/api/chat`**

> **Current Version:** Uses mock AI responses. See [Enabling OpenAI](#-enabling-real-openai) below.

```json
{
  "message": "What are your prices?",
  "history": []
}
```

**Response:**
```json
{
  "reply": "Our cleaning services start at €20/hour...",
  "needs_contact": false,
  "confidence": 0.9
}
```

**When `needs_contact: true`:**
Agent will suggest using the contact form for specific scheduling.

---

## 🔄 Enabling Real OpenAI

The repository includes mock AI responses for testing without API costs. To enable real OpenAI:

1. **Get OpenAI API Key** from https://platform.openai.com
2. **Add to `.env`:**
   ```env
   OPENAI_API_KEY=sk-your-api-key-here
   ```
3. **Edit `agent-service/src/index.js`:**
   - Uncomment the OpenAI integration code
   - Remove or comment out the mock response logic
4. **Restart services:**
   ```bash
   docker-compose down
   docker-compose up --build
   ```

---

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up

# Build and start (force rebuild)
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down

# Remove volumes too
docker-compose down -v
```

---

## ☁️ Azure Deployment

### Static Website (Azure Static Web Apps)

```bash
# Create static web app
az staticwebapp create \
  --name zoman-website \
  --resource-group zoman-rg \
  --location westeurope \
  --source https://github.com/SouhailFl/zoman-gebaudereinigung \
  --branch main \
  --app-location "/website" \
  --output-location "dist"

# Get deployment token
az staticwebapp secrets list \
  --name zoman-website \
  --query "properties.apiKey" -o tsv
```

Add the token to GitHub Secrets as `AZURE_STATIC_WEB_APPS_API_TOKEN`

---

### Microservices (Azure Container Apps)

```bash
# 1. Create environment
az containerapp env create \
  --name zoman-env \
  --resource-group zoman-rg \
  --location westeurope

# 2. Deploy email service
az containerapp create \
  --name zoman-email \
  --resource-group zoman-rg \
  --environment zoman-env \
  --image ghcr.io/souhailfl/zoman-email-service:latest \
  --target-port 3001 \
  --ingress external \
  --secrets \
    mailtrap-user="your-user" \
    mailtrap-pass="your-pass" \
  --env-vars \
    MAILTRAP_HOST=sandbox.smtp.mailtrap.io \
    MAILTRAP_PORT=2525 \
    MAILTRAP_USER=secretref:mailtrap-user \
    MAILTRAP_PASS=secretref:mailtrap-pass

# 3. Deploy agent service
az containerapp create \
  --name zoman-agent \
  --resource-group zoman-rg \
  --environment zoman-env \
  --image ghcr.io/souhailfl/zoman-agent-service:latest \
  --target-port 3002 \
  --ingress external \
  --secrets openai-key="sk-your-key" \
  --env-vars OPENAI_API_KEY=secretref:openai-key
```

---

## 🧪 Testing & Verification

### ✅ Test Website Locally

```bash
cd website
npm run dev
```

**Check these:**
- [ ] Homepage loads at `http://localhost:4321`
- [ ] Language switcher works (DE/EN/FR)
- [ ] Services page displays all cards
- [ ] Contact form renders with map
- [ ] Chat widget appears (if services running)

---

### ✅ Test Email Service

```bash
# Start services
docker-compose up

# Send test email
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Subject",
    "message": "Test message"
  }'
```

**Expected:** Email appears in your Mailtrap inbox

---

### ✅ Test Chat Agent

> **Note:** Currently returns mock responses. See [Enabling OpenAI](#-enabling-real-openai) to test with real AI.

```bash
curl -X POST http://localhost:3002/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are your cleaning services?",
    "history": []
  }'
```

**Expected:** JSON response with mock agent reply

---

### ✅ SEO Audit

```bash
cd website
npm run build
npm run preview

# Run Lighthouse
npx lighthouse http://localhost:4321 \
  --only-categories=seo \
  --view
```

**Target:** SEO score of 100

---

## 🎯 GitHub Actions

Push to `main` branch triggers automatic deployments:

**Workflows:**
1. `deploy-website.yml` → Deploys Astro site to Azure Static Web Apps
2. `build-containers.yml` → Builds Docker images
3. `deploy-containers.yml` → Deploys to Azure Container Apps

**Required GitHub Secrets:**
- `AZURE_STATIC_WEB_APPS_API_TOKEN`
- `AZURE_CREDENTIALS` (service principal JSON)
- `MAILTRAP_USER`, `MAILTRAP_PASS`
- `OPENAI_API_KEY`

---

## 🎨 Brand Colors

```css
/* Tailwind Config */
colors: {
  'zoman-cyan': '#00B5FF',
  'zoman-navy': '#0B2545',
}
```

Use these in components:
```html
<button class="bg-zoman-cyan hover:bg-zoman-navy">
  Contact Us
</button>
```

---

## 🐛 Troubleshooting

### Website won't build?
```bash
cd website
rm -rf node_modules .astro dist
npm install
npm run build
```

### Docker services won't start?
```bash
# Check logs
docker-compose logs email-service
docker-compose logs agent-service

# Common fixes:
# - Copy .env.example to .env
# - Check ports 3001/3002 aren't in use
# - Verify Docker Desktop is running
```

### Email not sending?
1. Verify Mailtrap credentials in `.env`
2. Check Mailtrap inbox settings
3. Test endpoint directly with curl (see Testing section)

### Chat agent errors?
```bash
# Mock AI (default): Should work without API key
# Real OpenAI: Check API key is valid
echo $OPENAI_API_KEY

# Test endpoint
curl http://localhost:3002/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test","history":[]}'
```

**Switching from Mock to Real AI:**
- Edit `agent-service/src/index.js`
- Uncomment OpenAI code
- Remove mock response logic
- Add valid `OPENAI_API_KEY` to `.env`

---

## 💡 Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| **No Database** | Simplifies deployment, reduces costs |
| **Stateless Services** | Easy horizontal scaling |
| **Static Site Generation** | Maximum SEO performance (100 score) |
| **Client-Side Language Detection** | Works with static hosting |
| **Docker Compose** | Simple local development setup |

---

## 📚 Tech Stack

**Static Website:**
- [Astro](https://astro.build) - Static site generator (pre-rendered HTML)
- [TailwindCSS](https://tailwindcss.com) - Utility-first CSS
- Vanilla JS - Client-side only (no backend database)

**Microservices (Stateless APIs):**
- [Node.js](https://nodejs.org) + [Express](https://expressjs.com) - Lightweight API servers
- [Nodemailer](https://nodemailer.com) - Email sending via SMTP
- [OpenAI API](https://platform.openai.com) - AI chat (optional, uses mock by default)

**Infrastructure:**
- [Docker](https://docker.com) - Containerization
- [Azure Static Web Apps](https://azure.microsoft.com/services/app-service/static/) - Static file hosting
- [Azure Container Apps](https://azure.microsoft.com/services/container-apps/) - API hosting
- [GitHub Actions](https://github.com/features/actions) - CI/CD

**Storage:**
- ❌ No database - Fully stateless architecture
- Client-side: `sessionStorage` for temporary chat history
- Emails: Sent via Mailtrap (not stored locally)

---

## 📝 Environment Variables Reference

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `MAILTRAP_HOST` | Mailtrap SMTP server | `sandbox.smtp.mailtrap.io` | ✅ Yes |
| `MAILTRAP_PORT` | SMTP port | `2525` | ✅ Yes |
| `MAILTRAP_USER` | Mailtrap username | `abc123def456` | ✅ Yes |
| `MAILTRAP_PASS` | Mailtrap password | `xyz789uvw012` | ✅ Yes |
| `OPENAI_API_KEY` | OpenAI API key | `sk-proj-...` | ⚠️ Optional (mock AI by default) |

---

## 🚦 Next Steps

After setup, you can:

1. **Customize Content** - Edit pages in `website/src/pages/`
2. **Add Services** - Create new service cards in components
3. **Modify Translations** - Update `website/src/content/translations.js`
4. **Configure Chat** - Adjust agent prompts in `agent-service/src/index.js`
5. **Deploy** - Push to GitHub and let CI/CD handle deployment

---

## 📄 License

MIT License - Feel free to use for your own projects

---

## 🤝 Contributing

Issues and pull requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📞 Support

Need help? 

- 📖 Check the [troubleshooting section](#-troubleshooting)
- 🐛 Open an [issue](https://github.com/SouhailFl/zoman-gebaudereinigung/issues)
- 💬 Start a [discussion](https://github.com/SouhailFl/zoman-gebaudereinigung/discussions)

---

**Built with ❤️ using Astro, Docker, and Azure**