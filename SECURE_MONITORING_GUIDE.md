# 🔒 SECURE MONITORING STACK - MANUAL GUIDE

**Goal:** Put Grafana & Prometheus behind Nginx with HTTPS + Basic Auth

**Time:** ~30 minutes

---

## Prerequisites Check

SSH to your VM:
```bash
ssh zoman@20.250.146.204
```

Verify monitoring is running:
```bash
kubectl get pods -n monitoring
# Should show grafana and prometheus pods running
```

---

## PART 1: Update Kubernetes Deployments (5 min)

### 1. Pull latest code
```bash
cd ~/zoman-gebaudereinigung
git pull origin main
```

### 2. Apply updated deployments
```bash
# This changes services from NodePort to ClusterIP (internal only)
# Also updates Docker image versions and Grafana password
kubectl apply -f k8s/grafana-deployment.yaml
kubectl apply -f k8s/prometheus-deployment.yaml
```

### 3. Wait for pods to restart
```bash
kubectl rollout status deployment/grafana -n monitoring
kubectl rollout status deployment/prometheus -n monitoring
```

**✓ Checkpoint:** Pods should be running but NO LONGER accessible on ports 30030/30090

---

## PART 2: Setup Basic Auth for Prometheus (5 min)

### 1. Install htpasswd tool
```bash
sudo apt-get update
sudo apt-get install -y apache2-utils
```

### 2. Create password file for Prometheus
```bash
# Replace 'admin' and 'your-strong-password' with your choices
sudo htpasswd -bc /etc/nginx/.htpasswd-prometheus admin your-strong-password
```

**💾 Save these credentials:** You'll need them to access Prometheus!

---

## PART 3: Configure Nginx Reverse Proxy (10 min)

### 1. Copy Nginx config
```bash
sudo cp ~/zoman-gebaudereinigung/infrastructure/nginx-monitoring.conf /etc/nginx/sites-available/monitoring
```

### 2. Setup port forwarding to access services locally

Grafana:
```bash
# Run in background
nohup kubectl port-forward -n monitoring svc/grafana 3000:3000 --address=127.0.0.1 > /tmp/grafana-pf.log 2>&1 &
```

Prometheus:
```bash
# Run in background  
nohup kubectl port-forward -n monitoring svc/prometheus 9090:9090 --address=127.0.0.1 > /tmp/prometheus-pf.log 2>&1 &
```

Verify:
```bash
curl -I http://localhost:3000/api/health  # Should return 200
curl -I http://localhost:9090/-/healthy   # Should return 200
```

### 3. Test Nginx config
```bash
sudo nginx -t
# Should say "syntax is ok" and "test is successful"
```

---

## PART 4: Obtain SSL Certificates (10 min)

### Important: DNS Setup First!

Before running certbot, you need to add DNS records:

**Go to Azure Portal:**
1. Navigate to your VM: `zoman-vm`
2. Click on **DNS name** section
3. Add these DNS labels:
   - `grafana.zoman` 
   - `prometheus.zoman`

OR use Azure CLI:
```bash
# For Grafana subdomain
az network public-ip update \
  --resource-group zoman-rg \
  --name zoman-vm-ip \
  --dns-name grafana-zoman

# For Prometheus subdomain  
az network public-ip update \
  --resource-group zoman-rg \
  --name zoman-vm-ip \
  --dns-name prometheus-zoman
```

Wait 2-3 minutes for DNS to propagate.

### Get Certificates

For Grafana:
```bash
sudo certbot certonly --nginx \
  -d grafana.zoman.switzerlandnorth.cloudapp.azure.com \
  --non-interactive \
  --agree-tos \
  --email souhail.fliou@gmail.com
```

For Prometheus:
```bash
sudo certbot certonly --nginx \
  -d prometheus.zoman.switzerlandnorth.cloudapp.azure.com \
  --non-interactive \
  --agree-tos \
  --email souhail.fliou@gmail.com
```

**If certificate fails:** DNS might not be propagated yet. Wait 5 minutes and try again.

---

## PART 5: Enable Nginx Config & Reload (2 min)

```bash
# Enable the site
sudo ln -sf /etc/nginx/sites-available/monitoring /etc/nginx/sites-enabled/

# Test config again
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## PART 6: Make Port Forwarding Permanent (5 min)

Create systemd services so port forwarding survives reboots.

### Grafana service:
```bash
sudo nano /etc/systemd/system/grafana-portforward.service
```

Paste:
```ini
[Unit]
Description=Port forward for Grafana
After=k3s.service
Requires=k3s.service

[Service]
Type=simple
User=root
ExecStart=/usr/local/bin/kubectl port-forward -n monitoring svc/grafana 3000:3000 --address=127.0.0.1
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### Prometheus service:
```bash
sudo nano /etc/systemd/system/prometheus-portforward.service
```

Paste:
```ini
[Unit]
Description=Port forward for Prometheus
After=k3s.service
Requires=k3s.service

[Service]
Type=simple
User=root
ExecStart=/usr/local/bin/kubectl port-forward -n monitoring svc/prometheus 9090:9090 --address=127.0.0.1
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### Enable services:
```bash
sudo systemctl daemon-reload
sudo systemctl enable grafana-portforward.service
sudo systemctl enable prometheus-portforward.service
sudo systemctl start grafana-portforward.service
sudo systemctl start prometheus-portforward.service
```

### Verify:
```bash
sudo systemctl status grafana-portforward
sudo systemctl status prometheus-portforward
```

---

## ✅ VERIFICATION

### Test Grafana:
```bash
curl -I https://grafana.zoman.switzerlandnorth.cloudapp.azure.com
# Should return: HTTP/2 200
```

Open in browser: https://grafana.zoman.switzerlandnorth.cloudapp.azure.com
- Login: `admin`
- Password: `Zoman2024!SecureGrafana#`
- Should see Grafana dashboard

### Test Prometheus:
```bash
curl -u admin:your-password -I https://prometheus.zoman.switzerlandnorth.cloudapp.azure.com
# Should return: HTTP/2 200
```

Open in browser: https://prometheus.zoman.switzerlandnorth.cloudapp.azure.com
- Will prompt for basic auth
- Username: `admin` (or what you set)
- Password: [your password]
- Should see Prometheus UI

### Verify old ports are closed:
```bash
curl -I http://20.250.146.204:30030
# Should FAIL or timeout (port closed)

curl -I http://20.250.146.204:30090
# Should FAIL or timeout (port closed)
```

---

## 🎉 SUCCESS CHECKLIST

- [x] Grafana accessible via HTTPS with new strong password
- [x] Prometheus accessible via HTTPS with basic auth
- [x] Old NodePort endpoints (30030, 30090) no longer accessible
- [x] SSL certificates auto-renewing
- [x] Port forwarding survives reboots
- [x] All security headers enabled

---

## 🔑 IMPORTANT - SAVE THESE CREDENTIALS

**Grafana:**
- URL: https://grafana.zoman.switzerlandnorth.cloudapp.azure.com
- Username: admin
- Password: Zoman2024!SecureGrafana#

**Prometheus:**
- URL: https://prometheus.zoman.switzerlandnorth.cloudapp.azure.com  
- Username: admin
- Password: [your chosen password]

---

## 🚨 TROUBLESHOOTING

### Grafana not accessible:
```bash
# Check port forwarding
sudo systemctl status grafana-portforward

# Check pod
kubectl get pods -n monitoring -l app=grafana

# Check logs
kubectl logs -n monitoring -l app=grafana
```

### Prometheus not accessible:
```bash
# Check port forwarding
sudo systemctl status prometheus-portforward

# Check pod
kubectl get pods -n monitoring -l app=prometheus

# Check logs
kubectl logs -n monitoring -l app=prometheus
```

### SSL certificate issues:
```bash
# Check certificates
sudo certbot certificates

# Renew if needed
sudo certbot renew --dry-run
```

### Nginx errors:
```bash
# Check config
sudo nginx -t

# Check logs
sudo tail -f /var/log/nginx/error.log
```

---

## 📊 What Changed?

**Before:**
- ❌ http://20.250.146.204:30030 → Grafana (unencrypted, weak password)
- ❌ http://20.250.146.204:30090 → Prometheus (unencrypted, no auth)

**After:**
- ✅ https://grafana.zoman.switzerlandnorth.cloudapp.azure.com → Grafana (encrypted, strong password)
- ✅ https://prometheus.zoman.switzerlandnorth.cloudapp.azure.com → Prometheus (encrypted, basic auth)
- ✅ Old ports closed to internet
- ✅ All traffic encrypted
- ✅ Security headers enabled
- ✅ Pinned Docker image versions

---

**Next:** Update your bootcamp presentation with the new secure URLs! 🎤
