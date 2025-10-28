# 🔧 INFRASTRUCTURE HANDOFF DOCUMENT
**Date:** October 22, 2025  
**From:** Souha (Laptop: Issue with Terraform Apply)  
**To:** Friend (Account Owner - Will complete infrastructure deployment)

---

## 🎯 IMPORTANT CONTEXT

**This is YOUR Azure account** - You're the one who:
- ✅ Gave Souha access to your student subscription
- ✅ Provided your SSH key for the VMs
- ✅ Already successfully used this Terraform config before

**The Issue:**
- Souha's laptop has a weird issue with `terraform apply`
- Same config that worked on YOUR laptop fails on Souha's
- Error: Region availability or VM size problems (only on Souha's laptop)
- Network infrastructure deployed successfully
- Only the VM creation is pending

**The Solution:**
- Use YOUR laptop to complete the deployment
- No config changes needed (already has your SSH key and settings)
- Should work fine since you've done this before

---

## 🎯 CURRENT SITUATION

### What's Working ✅
The following Azure resources are **ALREADY DEPLOYED** in your account:
- Resource Group: `rg-zoman-prod`
- Virtual Network: `vnet-zoman-prod` (10.0.0.0/16)
- Subnet: `subnet-zoman-prod` (10.0.1.0/24)
- Network Security Group: `nsg-zoman-prod` (all rules configured)
- Public IP: `4.185.65.237` (static, allocated)
- Network Interface: `nic-zoman-prod-1` (attached to public IP)
- Key Vault: `kv-zoman-prod`
- Storage Account: `stzomanprod`

### What's Missing ❌
**THE VM ITSELF** is not deployed due to Terraform apply failures on Souha's laptop.

---

## 📋 YOUR TASK

Deploy the missing VM using YOUR laptop (where it worked before).

### Option A: Use Your Own Laptop (Recommended)

**Step 1: Get the Project Files**
```bash
# If you don't have it yet:
git clone <repo-url>
cd zoman-gebaudereinigung/infrastructure

# If you have it, pull latest:
cd zoman-gebaudereinigung
git pull
cd infrastructure
```

**Step 2: Get Current Terraform State**
You need the `terraform.tfstate` file from Souha's laptop. This file contains the state of already-deployed resources.

**Get it from Souha:**
- Location: `C:\Users\souha\zg\zoman-gebaudereinigung\infrastructure\terraform.tfstate`
- Also get: `terraform.tfstate.backup`
- Copy to YOUR laptop's `infrastructure/` folder

**Step 3: Verify Azure Login**
```bash
# Login to your Azure account
az login

# Set your subscription
az account set --subscription 5b976d4c-d66a-43e5-8602-5f7c371b8c19

# Verify
az account show
```

**Step 4: Check Terraform State**
```bash
# Initialize if needed (first time on your laptop)
terraform init

# See what's already deployed
terraform show

# See what will be created
terraform plan
```

**Expected plan output:**
```
Plan: 1 to add, 0 to change, 0 to destroy

Resources to add:
  + azurerm_linux_virtual_machine.zoman[0]
```

**If it shows more than 1 resource to add:** STOP and contact Souha - state file might be out of sync.

**Step 5: Deploy the VM**
```bash
terraform apply
```

**Step 6: Test SSH Access**
```bash
ssh -i ~/.ssh/id_rsa zomanadmin@4.185.65.237

# If successful, run:
sudo apt update
exit
```

**Step 7: Share State Back to Souha**
After successful deployment:
- Copy `terraform.tfstate` back to Souha
- Or commit to Git (if using remote state)

---

### Option B: Remote into Souha's Laptop

If you have remote access to Souha's laptop:
```bash
# Navigate to the project
cd C:\Users\souha\zg\zoman-gebaudereinigung\infrastructure

# Make sure you're logged into YOUR Azure account
az login
az account set --subscription 5b976d4c-d66a-43e5-8602-5f7c371b8c19

# Deploy
terraform apply
```

---

## 🛠️ TROUBLESHOOTING GUIDE

### Problem 1: Still Getting Region Errors

**Error:** `The requested size for resource ... is currently not available in location 'germanywestcentral'`

**Solution:**
```bash
# Edit terraform.tfvars
azure_region = "westeurope"  # or "northeurope"
```

**Note:** Changing region will recreate some resources. Check with Souha first.

### Problem 2: VM Size Not Available

**Error:** `The requested VM size Standard_B2s is not available`

**Solution:**
Try these sizes in order (edit `terraform.tfvars`):
1. `Standard_B1s` (1 vCPU, 1GB RAM - cheapest)
2. `Standard_DS1_v2` (1 vCPU, 3.5GB RAM)
3. `Standard_D2s_v3` (2 vCPU, 8GB RAM)

Check availability:
```bash
az vm list-skus --location westeurope --size Standard_B --output table
```

### Problem 3: State File Conflicts

**Error:** `Error acquiring state lock` or state conflicts

**Solution:**
```bash
# If locked
terraform force-unlock <LOCK_ID>

# If state is corrupted, restore from backup
cp terraform.tfstate.backup terraform.tfstate
```

### Problem 4: Authentication Issues

**Error:** `Error: building account: could not acquire access token`

**Solution:**
```bash
# Re-login to Azure
az login

# Set the correct subscription
az account set --subscription 5b976d4c-d66a-43e5-8602-5f7c371b8c19

# Verify
az account show
```

### Problem 5: "Resource Already Exists"

**Error:** Resource already exists but not in state

**Solution:**
This means the state file is out of sync. Get the latest `terraform.tfstate` from Souha.

---

## 📊 EXPECTED TERRAFORM OUTPUT

After successful deployment, you should see:

```hcl
Apply complete! Resources: 1 added, 0 changed, 0 destroyed.

Outputs:

key_vault_name = "kv-zoman-prod"
key_vault_uri = "https://kv-zoman-prod.vault.azure.net/"
resource_group_name = "rg-zoman-prod"
storage_account_name = "stzomanprod"
vm_public_ips = ["4.185.65.237"]
vm_private_ips = ["10.0.1.4"]
vnet_id = "/subscriptions/.../virtualNetworks/vnet-zoman-prod"
```

---

## 🔄 NEXT STEPS AFTER VM DEPLOYMENT

Once the VM is successfully deployed:

1. **Verify SSH Access:**
   ```bash
   ssh -i ~/.ssh/id_rsa zomanadmin@4.185.65.237
   ```

2. **Update VM (inside SSH):**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

3. **Install Docker (inside SSH):**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   
   # Log out and back in, then verify
   docker --version
   docker-compose --version
   ```

4. **Share Results with Souha:**
   - Send updated `terraform.tfstate` file
   - Document which region/VM size worked
   - Confirm SSH access is working

5. **Update Project Documentation:**
   ```bash
   # Update terraform.tfvars.example with working config
   git add terraform.tfvars.example
   git commit -m "Update infrastructure with working VM configuration"
   git push
   ```

---

## 🔑 CRITICAL FILES

### Files You Need from Souha:
1. `terraform.tfstate` - Current state of deployed resources (CRITICAL)
2. `terraform.tfstate.backup` - Backup of state
3. `terraform.tfvars` - Configuration (already correct)
4. `.terraform/` folder - Terraform provider plugins (optional, can reinit)

### Your Configuration (Already Correct):
```hcl
# terraform.tfvars
subscription_id     = "5b976d4c-d66a-43e5-8602-5f7c371b8c19"  # YOUR account
ssh_public_key_path = "~/.ssh/id_rsa.pub"                     # YOUR key
allowed_ssh_cidrs   = ["196.206.110.120/32"]                  # Souha's IP
azure_region        = "germanywestcentral"                     # Current
vm_size             = "Standard_B2s"                           # Current
vm_count            = 1
environment         = "prod"
project_name        = "zoman"
vm_admin_username   = "zomanadmin"
```

**Note:** These are already configured correctly. Only change `azure_region` or `vm_size` if deployment fails.

---

## ⚠️ IMPORTANT WARNINGS

1. **DO NOT run `terraform destroy`** - We have working resources worth keeping
2. **DO get the latest terraform.tfstate from Souha** before applying
3. **DO verify with `terraform plan` first** - should only show 1 resource to add
4. **DO test SSH immediately** after VM deployment
5. **DO share the updated state file back to Souha** after deployment
6. **DO document what worked** (region, VM size) for future reference

---

## 📁 PROJECT STRUCTURE

```
zoman-gebaudereinigung/
├── infrastructure/
│   ├── main.tf                    # Resource definitions
│   ├── variables.tf               # Variable declarations
│   ├── provider.tf                # Azure provider config
│   ├── outputs.tf                 # Output values
│   ├── terraform.tfvars           # YOUR actual config (correct)
│   ├── terraform.tfstate          # Current state (GET FROM SOUHA)
│   ├── terraform.tfstate.backup   # Backup (GET FROM SOUHA)
│   └── .terraform/                # Terraform plugins
├── website/                       # Astro frontend (done)
├── agent-service/                 # AI service (done)
├── email-service/                 # Email service (done)
├── docker-compose.yml             # Local dev setup
├── INFRASTRUCTURE_HANDOFF.md      # This file
├── QUICK_START.md                 # Quick reference
└── claude_savepoint.txt           # Full project status
```

---

## 🔑 KEY COMMANDS CHEATSHEET

```bash
# Check Azure login
az login
az account show

# Navigate to project
cd zoman-gebaudereinigung/infrastructure

# Initialize Terraform (first time only)
terraform init

# See current state
terraform show

# See what will be created
terraform plan

# Deploy the VM
terraform apply

# SSH to VM
ssh -i ~/.ssh/id_rsa zomanadmin@4.185.65.237

# Check VM sizes in a region
az vm list-skus --location westeurope --size Standard_B --output table
```

---

## ✅ SUCCESS CRITERIA

You're done when:
- [ ] VM is deployed in Azure
- [ ] Public IP `4.185.65.237` is accessible
- [ ] SSH works: `ssh -i ~/.ssh/id_rsa zomanadmin@4.185.65.237`
- [ ] You can run `sudo apt update` inside the VM
- [ ] Terraform state shows all resources healthy
- [ ] State file shared back to Souha

---

## 📞 COMMUNICATION

**Success Message to Souha:**
```
✅ VM deployed successfully!
- Deployed from: [my laptop/your laptop]
- Region: [westeurope/germanywestcentral]
- VM size: [Standard_B2s/other]
- Public IP: 4.185.65.237
- SSH: Verified working
- State file: [attached/pushed to Git]
Ready for Phase 2 (Ansible setup)!
```

**Failure Message:**
```
❌ Deployment failed
- Tried from: [my laptop/your laptop]
- Error: [paste full error message]
- Region tried: [westeurope/germanywestcentral]
- VM size tried: [Standard_B2s/other]
Need help troubleshooting
```

---

## 🎯 WHY THIS SHOULD WORK

**Context:** You successfully used this setup before:
- Same Azure account
- Same SSH key
- Same Terraform configuration
- Worked on your laptop previously

**The Issue:** Only Souha's laptop has problems, not your account or config.

**The Fix:** Using your laptop (where it worked) should succeed immediately.

---

**Expected time: 10-20 minutes**  
**Difficulty: Low (you've done this before)**

Good luck! 🚀
