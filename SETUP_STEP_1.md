# STEP 1: Local Setup & SSH Keys

## Goal
Get your local machine ready to deploy infrastructure to Azure.

---

## 1.1: Install Required Tools

### Option A: Windows (Recommended for your team)

**Install Terraform:**
- Download from: https://www.terraform.io/downloads
- Or use Chocolatey: `choco install terraform`
- Verify: Open PowerShell, run `terraform --version`

**Install Azure CLI:**
- Download from: https://learn.microsoft.com/en-us/cli/azure/install-azure-cli-windows
- Or use Chocolatey: `choco install azure-cli`
- Verify: `az --version`

**Install Git:**
- Download from: https://git-scm.com/download/win
- Verify: `git --version`

### Option B: macOS
```bash
# Using Homebrew
brew install terraform azure-cli git

# Verify
terraform --version
az --version
```

### Option C: Linux (Ubuntu/Debian)
```bash
# Terraform
wget https://releases.hashicorp.com/terraform/1.6.0/terraform_1.6.0_linux_amd64.zip
unzip terraform_1.6.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/

# Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Verify
terraform --version
az --version
```

---

## 1.2: Generate SSH Keys

SSH keys let Terraform securely connect to your VMs.

### Windows (PowerShell)
```powershell
# Generate key pair
ssh-keygen -t rsa -b 4096 -f $env:USERPROFILE\.ssh\id_rsa -N ""

# Verify
cat $env:USERPROFILE\.ssh\id_rsa.pub
```

### macOS/Linux
```bash
# Generate key pair
ssh-keygen -t rsa -b 4096 -f ~/.ssh/id_rsa -N ""

# Verify
cat ~/.ssh/id_rsa.pub
```

**What this does:**
- Creates `id_rsa` (private key - NEVER share)
- Creates `id_rsa.pub` (public key - safe to share)

---

## 1.3: Login to Azure

### Using Azure CLI

```bash
# Login interactively
az login

# This opens a browser to authenticate with your student account
# (Souhail.FELLAKl@hightech.edu)
```

### Verify your subscription
```bash
# List subscriptions
az account list --output table

# Set default subscription
az account set --subscription "YOUR_SUBSCRIPTION_ID"

# Get subscription ID for later
az account show --query id -o tsv
```

**Copy the subscription ID** - you'll need it in the next step!

---

## 1.4: Test Terraform Locally

Navigate to the infrastructure folder:

```bash
cd infrastructure

# Validate the Terraform files
terraform validate
```

**Expected output:**
```
Success! The configuration is valid.
```

If you get errors, they're usually about missing SSH keys. Make sure Step 1.2 is complete.

---

## Checklist - When done with STEP 1:

- ✅ Terraform installed (`terraform --version`)
- ✅ Azure CLI installed (`az --version`)
- ✅ SSH keys generated (`~/.ssh/id_rsa.pub` exists)
- ✅ Logged into Azure (`az login` worked)
- ✅ Subscription ID copied
- ✅ `terraform validate` passed

## Next Step
Once all checkboxes are done, move to **STEP 2: Creating terraform.tfvars**
