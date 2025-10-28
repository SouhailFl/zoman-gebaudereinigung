# 🚀 QUICK START GUIDE FOR FRIEND
**Goal:** Deploy the missing VM to complete infrastructure

## ⚡ TL;DR - 2 Minute Version

```bash
# 1. Navigate to project (use Souha's laptop or yours)
cd C:\Users\souha\zg\zoman-gebaudereinigung\infrastructure

# 2. NO CHANGES NEEDED to terraform.tfvars
# (Already has YOUR SSH key and Souha's IP)

# 3. Deploy
terraform apply

# 4. Test
ssh -i ~/.ssh/id_rsa zomanadmin@4.185.65.237

# 5. Done! Tell Souha ✅
```

---

## 📝 Important Context

**Your Azure Account Setup:**
- ✅ SSH key: Already configured (YOUR key)
- ✅ IP address: Already whitelisted (Souha's IP: 196.206.110.120/32)
- ✅ Subscription: YOUR student account
- ✅ terraform.tfvars: Already configured correctly

**The Problem:**
- Souha's laptop has issues with `terraform apply`
- Same config worked fine on your laptop before
- Network infrastructure already deployed (90% done)
- Only the VM creation is pending

**Your Task:**
- Use YOUR laptop (not Souha's)
- Run terraform apply in YOUR environment
- Should work since it worked before for you

---

## 🎯 What Should Happen

```bash
terraform apply
```

**Expected output:**
```
Plan: 1 to add, 0 to change, 0 to destroy

# It should ONLY create:
+ azurerm_linux_virtual_machine.zoman[0]
```

**If it wants to create more than 1 resource:** 
Stop and check - might need to pull latest state from Souha.

---

## 📂 Two Options for Deployment

### Option A: Use Your Laptop (Recommended)
```bash
# 1. Clone/pull the repo
git clone <repo-url>
cd zoman-gebaudereinigung/infrastructure

# 2. Copy terraform.tfstate from Souha
# (This has the existing infrastructure state)
# Get it from: C:\Users\souha\zg\zoman-gebaudereinigung\infrastructure\

# 3. Deploy
terraform init  # If first time on your laptop
terraform apply

# 4. Test
ssh -i ~/.ssh/id_rsa zomanadmin@4.185.65.237
```

### Option B: Use Souha's Laptop Remotely
```bash
# Remote into Souha's laptop, then:
cd C:\Users\souha\zg\zoman-gebaudereinigung\infrastructure
terraform apply
```

---

## ⚠️ If It Still Fails

### Error: "VM size not available"
```hcl
# Edit terraform.tfvars
vm_size = "Standard_B1s"  # Try this instead of B2s
```

### Error: "Region not available"  
```hcl
# Edit terraform.tfvars
azure_region = "westeurope"  # Try this instead of germanywestcentral
```

### Error: "Authentication failed"
```bash
# Login to your Azure account
az login
az account set --subscription 5b976d4c-d66a-43e5-8602-5f7c371b8c19
```

---

## ✅ How to Know It Worked

1. **Terraform says:**
   ```
   Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
   ```

2. **SSH works:**
   ```bash
   ssh -i ~/.ssh/id_rsa zomanadmin@4.185.65.237
   # You should see Ubuntu login prompt
   ```

3. **You can run:**
   ```bash
   sudo apt update
   # Should work without errors
   ```

---

## 📞 Tell Souha

✅ **Success message template:**
```
VM deployed! ✅
- Region: [westeurope/germanywestcentral]
- VM size: [Standard_B2s/other]
- Public IP: 4.185.65.237
- SSH: Working ✓
- Deployed from: [my laptop/your laptop]
Ready for next phase!
```

❌ **If it fails:**
```
Still failing:
Error: [paste error here]
Tried from: [my laptop/your laptop]
Region: [westeurope/germanywestcentral]
VM size: [Standard_B2s/other]
```

---

## 🔑 Key Files Needed

From Souha's laptop:
- `infrastructure/terraform.tfstate` (CRITICAL - has existing resources)
- `infrastructure/terraform.tfvars` (already configured correctly)
- `infrastructure/.terraform/` folder (provider plugins)

---

## ⏱️ Expected Time
- Setup: 5 minutes (if cloning fresh)
- Running terraform: 5-10 minutes
- Testing SSH: 2 minutes
- **Total: ~10-15 minutes**

---

**Questions? Read INFRASTRUCTURE_HANDOFF.md for details.**
