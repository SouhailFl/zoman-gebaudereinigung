# 🧹 Zoman Gebäudereinigung

> Modern multilingual cleaning company website with AI-powered chat and email microservices

**Languages:** German • English • French

**Status:** 🚀 Production Deployment on Azure K3s | 🔄 CI/CD Troubleshooting in Progress

---

## ✨ Features

- 🧹 **Static Website** - Astro + TailwindCSS with perfect SEO scores
- 🗣️ **Multilingual** - Full i18n support (DE/EN/FR)
- 🤖 **AI Chat Widget** - OpenAI-powered customer support
- 📧 **Contact Forms** - Mailtrap email integration
- 🐳 **Containerized** - Docker-ready microservices
- ☁️ **Cloud-Native** - Azure VM with K3s Kubernetes
- 🔄 **CI/CD** - GitHub Actions (troubleshooting in progress)
- 💾 **Backup** - TrueNAS Scale with RAID mirroring
- 📊 **Monitoring** - Prometheus + Grafana (in progress)
- 🔒 **SSL/TLS** - Let's Encrypt (in progress)

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

## 🚀 CI/CD Pipeline Status

### ⚠️ Current Issue: Workflow Mismatch

The existing GitHub Actions workflows in `.github/workflows/` are configured for **Azure Container Apps and Azure Static Web Apps**, but the actual deployment uses **Azure VM with K3s**. These are incompatible deployment targets.

**Existing Workflows (Not Working):**
1. `build-containers.yml` - Builds and pushes to GitHub Container Registry ✅
2. `deploy-containers.yml` - Tries to deploy to Azure Container Apps ❌ (we don't use Container Apps)
3. `deploy-website.yml` - Tries to deploy to Azure Static Web Apps ❌ (we don't use Static Web Apps)

### 🔧 Solution Options

#### Option 1: Disable Current Workflows (Quick Fix)
```bash
# Rename workflows to disable them
mv .github/workflows/deploy-containers.yml .github/workflows/deploy-containers.yml.disabled
mv .github/workflows/deploy-website.yml .github/workflows/deploy-website.yml.disabled

# Keep build-containers.yml for reference
```

**Pros:** Quick, stops failed workflow runs  
**Cons:** No automated deployment

---

#### Option 2: Create SSH-Based Deployment Workflow (Recommended)

Create a new workflow that SSH into the VM and deploys:

**Create `.github/workflows/deploy-to-k3s.yml`:**
```yaml
name: Deploy to K3s on Azure VM

on:
  push:
    branches:
      - main
    paths:
      - 'website/**'
      - 'email-service/**'
      - 'agent-service/**'
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.VM_HOST }}  # 20.250.146.204
          username: ${{ secrets.VM_USERNAME }}  # zoman
          password: ${{ secrets.VM_PASSWORD }}
          script: |
            cd ~/zoman-gebaudereinigung
            git pull origin main
            
            # Rebuild images
            docker build --no-cache \
              --build-arg PUBLIC_HCAPTCHA_SITE_KEY=${{ secrets.PUBLIC_HCAPTCHA_SITE_KEY }} \
              --build-arg PUBLIC_EMAIL_SERVICE_URL="" \
              -t zoman-website ./website
            
            docker build -t zoman-email ./email-service
            docker build -t zoman-agent ./agent-service
            
            # Import to K3s
            docker save zoman-website -o /tmp/website.tar
            docker save zoman-email -o /tmp/email.tar
            docker save zoman-agent -o /tmp/agent.tar
            
            sudo k3s ctr images import /tmp/website.tar
            sudo k3s ctr images import /tmp/email.tar
            sudo k3s ctr images import /tmp/agent.tar
            
            # Restart pods
            kubectl delete pod -l app=website
            kubectl delete pod -l app=email-service
            kubectl delete pod -l app=agent-service
            
            # Verify deployment
            kubectl get pods
            
            echo "Deployment completed!"
```

**Required GitHub Secrets:**
- `VM_HOST`: `20.250.146.204`
- `VM_USERNAME`: `zoman`
- `VM_PASSWORD`: Your VM password
- `PUBLIC_HCAPTCHA_SITE_KEY`: `d83c3c7c-ff72-481c-91b2-3c243e728afc`

**To Add Secrets:**
1. Go to GitHub repo → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add each secret

**Pros:**
- Automated deployment on push to main
- Uses existing VM setup
- Simple and reliable

**Cons:**
- Uses password auth (consider SSH keys for better security)
- VM must be running

---

#### Option 3: Manual Deployment (Current Method)

Continue with manual deployment via SSH:

```bash
# On local machine
git add .
git commit -m "update"
git push origin main

# SSH to VM
ssh zoman@20.250.146.204

# On VM
cd ~/zoman-gebaudereinigung
git pull

# Rebuild and deploy (see QUICK_START.md for full commands)
./deploy.sh  # Or run manual commands
```

**Pros:**
- Full control
- No CI/CD complexity
- Works immediately

**Cons:**
- Manual process
- Requires SSH access
- Slower iteration

---

### 🛠️ Recommended Action Plan

1. **Short-term (Now):**
   - Disable incompatible workflows (Option 1)
   - Continue manual deployment (Option 3)
   - Update documentation to reflect this

2. **Medium-term (Next Sprint):**
   - Implement SSH-based deployment (Option 2)
   - Test workflow on feature branch first
   - Add deployment status badge to README

3. **Long-term (Future):**
   - Create Ansible playbook for deployment
   - Set up self-hosted GitHub Actions runner on VM
   - Implement blue-green deployments

### 📝 Workflow Status Summary

| Workflow | Status | Action Needed |
|----------|--------|---------------|
| `build-containers.yml` | 🟡 Partial | Works but unused (pushes to GHCR) |
| `deploy-containers.yml` | 🔴 Broken | Disable (wrong deployment target) |
| `deploy-website.yml` | 🔴 Broken | Disable (wrong deployment target) |
| `deploy-to-k3s.yml` | ⚪ Not Created | Create this (Option 2) |

---

## 🌐 Production Deployment

### Current Setup (Azure VM with K3s + Nginx)

The application is deployed on an Azure VM with:
- **Kubernetes (K3s)** for container orchestration
- **Nginx reverse proxy** handling external traffic on port 80 (HTTPS pending)
- **Service routing** to internal Kubernetes services
- **TrueNAS Scale** for automated backups with RAID mirroring
- **Prometheus + Grafana** for monitoring (in progress)

**Production URL:** http://zoman.switzerlandnorth.cloudapp.azure.com  
**Direct IP:** http://20.250.146.204

**Architecture:**
```
Internet (port 80)
    ↓
Nginx Reverse Proxy (VM host)
    ↓
Kubernetes Services (NodePort 30080)
    ↓
Microservices Pods
  ├── website (Astro + Nginx)
  ├── email-service (Express)
  └── agent-service (Express)
    ↓
TrueNAS Scale (Backups)
```

**Key Configuration:**
- Nginx listens on port 80 (standard HTTP)
- Routes traffic to K3s services internally
- No port numbers needed in URLs
- Accessible via Azure DNS: `zoman.switzerlandnorth.cloudapp.azure.com`
- SSL/HTTPS with Let's Encrypt (in progress)
- Daily automated backups to TrueNAS Scale
- Monitoring dashboards via Prometheus + Grafana (in progress)

**Deployment Details:**
- VM: Ubuntu 24.04 LTS (Standard B2as v2 - 2 vCPUs, 8GB RAM)
- Region: Switzerland North
- K3s: v1.33.5+k3s1 (single-node cluster)
- Images: Built locally and imported to K3s containerd
- Secrets: Managed via Kubernetes Secrets
- Cost: ~$70/month (stop VM when not in use to save costs)

---

## 💾 Backup & Disaster Recovery

### TrueNAS Scale Configuration

**Setup:**
- **Location:** On-premises server (local network)
- **Storage:** RAID configuration with mirroring for redundancy
- **Connection:** VPN tunnel to Azure VM (WireGuard/OpenVPN)
- **Access:** Secure remote access via VPN only

**Automated Backup Strategy:**
- **Schedule:** Daily at 2 AM UTC
- **Retention:** 7 daily, 4 weekly, 12 monthly snapshots
- **Compression:** Enabled (saves storage space)
- **Encryption:** AES-256 (data at rest)

**What Gets Backed Up:**
```bash
/backups/zoman/
├── k8s-manifests/        # All Kubernetes YAML files
├── docker-images/        # Image tar archives
├── configs/              # Nginx, .env files (encrypted)
├── logs/                 # Application logs
└── metadata/             # Checksums and backup info
```

**Disaster Recovery:**
- **Recovery Time Objective (RTO):** < 30 minutes
- **Monthly disaster recovery drills**
- **Automated integrity checks (checksums)**
- **Documented recovery procedures in `claude_savepoint.txt`**

**Verify Backups:**
```bash
# Check backup logs
tail -f /var/log/truenas-backup.log

# List snapshots
ls -lh /mnt/truenas/zoman/backups/

# Verify checksums
cd /mnt/truenas/zoman/backups/latest
sha256sum -c checksums.txt
```

---

## 📊 Monitoring Stack (In Progress)

### Prometheus + Grafana Setup

**Planned Deployment:**
- **Prometheus:** Metrics collection from K3s cluster
- **Grafana:** Visualization dashboards
- **Namespace:** `monitoring`
- **Access:**
  - Prometheus: http://20.250.146.204:30090
  - Grafana: http://20.250.146.204:30030

**Metrics to Monitor:**
- Pod CPU/Memory usage
- Request latency
- Error rates
- Container restart counts
- Node resource utilization

**Alert Rules:**
- Pod down for > 5 minutes
- High memory usage (> 7GB)
- Container restarts
- Failed deployments

**Deployment Status:** 🔄 Configuration in progress (see `claude_savepoint.txt` for manifests)

---

## 🔒 SSL/TLS Configuration (In Progress)

### Let's Encrypt Setup

**Planned Configuration:**
- **Certificate Authority:** Let's Encrypt
- **Tool:** Certbot with Nginx plugin
- **Domain:** zoman.switzerlandnorth.cloudapp.azure.com
- **Auto-Renewal:** Systemd timer (twice daily checks)

**What Will Change:**
- HTTP (port 80) → Redirects to HTTPS
- HTTPS (port 443) → Main access point
- **New URL:** https://zoman.switzerlandnorth.cloudapp.azure.com

**Setup Commands:**
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx -y

# Generate certificates
sudo certbot --nginx -d zoman.switzerlandnorth.cloudapp.azure.com

# Test auto-renewal
sudo certbot renew --dry-run
```

**Deployment Status:** 🔄 Pending setup (instructions in `claude_savepoint.txt`)

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