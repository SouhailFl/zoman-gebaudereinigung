# ✅ MUST FIX - DEPLOYMENT CHECKLIST

**Security Implementation Progress Tracker**

---

## 📋 Pre-Deployment (5 min)

- [ ] Read `SECURE_MONITORING_GUIDE.md` completely
- [ ] Read `ROLLBACK_PLAN.md` (in case of issues)
- [ ] Have 30-60 minutes of uninterrupted time
- [ ] Backup current monitoring config:
  ```bash
  kubectl get all -n monitoring -o yaml > monitoring-backup.yaml
  ```
- [ ] Take screenshots of current setup
- [ ] Save current credentials somewhere safe

---

## 🔧 Part 1: Update Kubernetes (5 min)

- [ ] SSH to VM: `ssh zoman@20.250.146.204`
- [ ] Navigate to project: `cd ~/zoman-gebaudereinigung`
- [ ] Pull latest changes: `git pull origin main`
- [ ] Apply Grafana updates: `kubectl apply -f k8s/grafana-deployment.yaml`
- [ ] Apply Prometheus updates: `kubectl apply -f k8s/prometheus-deployment.yaml`
- [ ] Wait for rollout: 
  ```bash
  kubectl rollout status deployment/grafana -n monitoring
  kubectl rollout status deployment/prometheus -n monitoring
  ```
- [ ] Verify pods running: `kubectl get pods -n monitoring`
- [ ] **✓ Checkpoint:** Old URLs (30030, 30090) should now be inaccessible

---

## 🔐 Part 2: Setup Authentication (5 min)

- [ ] Install htpasswd: `sudo apt-get update && sudo apt-get install -y apache2-utils`
- [ ] Choose Prometheus username (write it here): ________________
- [ ] Choose Prometheus password (write it here): ________________
- [ ] Create auth file:
  ```bash
  sudo htpasswd -bc /etc/nginx/.htpasswd-prometheus <username> <password>
  ```
- [ ] Verify file created: `sudo cat /etc/nginx/.htpasswd-prometheus`
- [ ] **✓ Checkpoint:** Should see hashed password in file

---

## 🌐 Part 3: Configure Nginx (10 min)

- [ ] Copy Nginx config:
  ```bash
  sudo cp ~/zoman-gebaudereinigung/infrastructure/nginx-monitoring.conf /etc/nginx/sites-available/monitoring
  ```
- [ ] Setup Grafana port forwarding:
  ```bash
  nohup kubectl port-forward -n monitoring svc/grafana 3000:3000 --address=127.0.0.1 > /tmp/grafana-pf.log 2>&1 &
  ```
- [ ] Setup Prometheus port forwarding:
  ```bash
  nohup kubectl port-forward -n monitoring svc/prometheus 9090:9090 --address=127.0.0.1 > /tmp/prometheus-pf.log 2>&1 &
  ```
- [ ] Verify port forwarding:
  ```bash
  curl -I http://localhost:3000/api/health  # Should return 200
  curl -I http://localhost:9090/-/healthy   # Should return 200
  ```
- [ ] Test Nginx config: `sudo nginx -t`
- [ ] **✓ Checkpoint:** Should say "syntax is ok" and "test is successful"

---

## 🔒 Part 4: Obtain SSL Certificates (10 min)

### DNS Setup First! (IMPORTANT)
- [ ] **Option A - Azure Portal:**
  - Go to Azure Portal → Your VM → DNS name
  - Add DNS labels for subdomains
  
- [ ] **Option B - Azure CLI:**
  ```bash
  # For Grafana
  az network public-ip update --resource-group zoman-rg --name zoman-vm-ip --dns-name grafana-zoman
  
  # For Prometheus  
  az network public-ip update --resource-group zoman-rg --name zoman-vm-ip --dns-name prometheus-zoman
  ```

- [ ] **Wait 5-10 minutes** for DNS propagation ☕

### Get Certificates
- [ ] Test DNS resolution:
  ```bash
  nslookup grafana.zoman.switzerlandnorth.cloudapp.azure.com
  nslookup prometheus.zoman.switzerlandnorth.cloudapp.azure.com
  ```
  
- [ ] Get Grafana certificate:
  ```bash
  sudo certbot certonly --nginx \
    -d grafana.zoman.switzerlandnorth.cloudapp.azure.com \
    --non-interactive --agree-tos \
    --email your-email@example.com
  ```
  
- [ ] Get Prometheus certificate:
  ```bash
  sudo certbot certonly --nginx \
    -d prometheus.zoman.switzerlandnorth.cloudapp.azure.com \
    --non-interactive --agree-tos \
    --email your-email@example.com
  ```
  
- [ ] Verify certificates: `sudo certbot certificates`
- [ ] **✓ Checkpoint:** Should see two certificates listed, valid for 90 days

---

## 🚀 Part 5: Enable & Reload Nginx (2 min)

- [ ] Enable site: `sudo ln -sf /etc/nginx/sites-available/monitoring /etc/nginx/sites-enabled/`
- [ ] Test config: `sudo nginx -t`
- [ ] Reload Nginx: `sudo systemctl reload nginx`
- [ ] Check Nginx status: `sudo systemctl status nginx`
- [ ] **✓ Checkpoint:** Nginx should be "active (running)"

---

## 🔁 Part 6: Make Port Forwarding Permanent (5 min)

- [ ] Create Grafana service file:
  ```bash
  sudo nano /etc/systemd/system/grafana-portforward.service
  ```
  Paste content from guide, save with `Ctrl+X`, `Y`, `Enter`
  
- [ ] Create Prometheus service file:
  ```bash
  sudo nano /etc/systemd/system/prometheus-portforward.service
  ```
  Paste content from guide, save with `Ctrl+X`, `Y`, `Enter`
  
- [ ] Reload systemd: `sudo systemctl daemon-reload`
- [ ] Enable Grafana: `sudo systemctl enable grafana-portforward.service`
- [ ] Enable Prometheus: `sudo systemctl enable prometheus-portforward.service`
- [ ] Start Grafana: `sudo systemctl start grafana-portforward.service`
- [ ] Start Prometheus: `sudo systemctl start prometheus-portforward.service`
- [ ] Verify services:
  ```bash
  sudo systemctl status grafana-portforward
  sudo systemctl status prometheus-portforward
  ```
- [ ] **✓ Checkpoint:** Both services should be "active (running)"

---

## ✅ Part 7: Final Verification (3 min)

### Test via Command Line
- [ ] Test Grafana HTTPS:
  ```bash
  curl -I https://grafana.zoman.switzerlandnorth.cloudapp.azure.com
  # Should return: HTTP/2 200
  ```
  
- [ ] Test Prometheus HTTPS:
  ```bash
  curl -u <username>:<password> -I https://prometheus.zoman.switzerlandnorth.cloudapp.azure.com
  # Should return: HTTP/2 200
  ```
  
- [ ] Verify old ports closed:
  ```bash
  curl -I http://20.250.146.204:30030  # Should timeout/fail
  curl -I http://20.250.146.204:30090  # Should timeout/fail
  ```

### Test via Browser
- [ ] Open: `https://grafana.zoman.switzerlandnorth.cloudapp.azure.com`
  - [ ] Green padlock visible (valid SSL)
  - [ ] Login page appears
  - [ ] Login with: admin / Zoman2024!SecureGrafana#
  - [ ] Dashboards load correctly
  
- [ ] Open: `https://prometheus.zoman.switzerlandnorth.cloudapp.azure.com`
  - [ ] Green padlock visible (valid SSL)
  - [ ] Basic auth prompt appears
  - [ ] Login with your credentials
  - [ ] Prometheus UI loads
  - [ ] Status → Targets shows services being scraped

### Security Headers Check
- [ ] Open browser DevTools → Network tab
- [ ] Refresh Grafana page
- [ ] Check response headers, should see:
  - [ ] `Strict-Transport-Security`
  - [ ] `X-Frame-Options: SAMEORIGIN`
  - [ ] `X-Content-Type-Options: nosniff`
  - [ ] `X-XSS-Protection`

---

## 📝 Part 8: Save Credentials (2 min)

Document these somewhere SAFE (password manager):

**Grafana:**
- URL: `https://grafana.zoman.switzerlandnorth.cloudapp.azure.com`
- Username: `admin`
- Password: `Zoman2024!SecureGrafana#`

**Prometheus:**
- URL: `https://prometheus.zoman.switzerlandnorth.cloudapp.azure.com`
- Username: ________________ (you chose this)
- Password: ________________ (you chose this)

---

## 🎬 Part 9: Update Documentation (5 min)

- [ ] Update `TODO_NEXT_STEPS.md`:
  - Mark monitoring security as ✅ COMPLETED
  
- [ ] Update `claude_savepoint.txt`:
  - Add new Grafana/Prometheus URLs
  - Update credentials
  - Add note about ClusterIP services
  
- [ ] Update `README.md`:
  - Add section about monitoring security
  - Update URLs
  
- [ ] Take screenshots for presentation:
  - [ ] Grafana dashboard with HTTPS
  - [ ] Prometheus with basic auth
  - [ ] `kubectl get services -n monitoring` (showing ClusterIP)
  - [ ] Browser showing green padlock

---

## 🎤 Part 10: Prepare Presentation (5 min)

- [ ] Review `PRESENTATION_SECURITY_CARD.md`
- [ ] Practice explaining the security fixes
- [ ] Prepare to demo:
  1. Main website (HTTPS)
  2. Grafana (HTTPS + strong password)
  3. Prometheus (HTTPS + basic auth)
  4. Show `kubectl get services` (ClusterIP)
  5. Explain security improvements
- [ ] Add talking points to your presentation slides

---

## 🎉 SUCCESS CRITERIA

You're done when ALL of these are true:

- ✅ Grafana accessible via HTTPS subdomain
- ✅ Grafana requires strong password
- ✅ Grafana shows green padlock in browser
- ✅ Prometheus accessible via HTTPS subdomain
- ✅ Prometheus requires basic authentication
- ✅ Prometheus shows green padlock in browser
- ✅ Old ports (30030, 30090) are NOT accessible
- ✅ Security headers present in responses
- ✅ Port forwarding survives reboot
- ✅ Documentation updated
- ✅ Credentials saved securely
- ✅ Screenshots taken for presentation

---

## ⏱️ Estimated Time Per Section

| Section | Time | Cumulative |
|---------|------|------------|
| Pre-deployment | 5 min | 5 min |
| Update K8s | 5 min | 10 min |
| Setup Auth | 5 min | 15 min |
| Configure Nginx | 10 min | 25 min |
| SSL Certificates | 10 min | 35 min |
| Enable Nginx | 2 min | 37 min |
| Port Forwarding | 5 min | 42 min |
| Verification | 3 min | 45 min |
| Save Credentials | 2 min | 47 min |
| Documentation | 5 min | 52 min |
| Presentation Prep | 5 min | 57 min |
| **TOTAL** | | **~1 hour** |

---

## 🚨 If Something Goes Wrong

**STOP** and refer to `ROLLBACK_PLAN.md`

Quick rollback:
```bash
kubectl patch service grafana -n monitoring --type='json' -p='[{"op": "replace", "path": "/spec/type", "value":"NodePort"},{"op": "add", "path": "/spec/ports/0/nodePort", "value":30030}]'

kubectl patch service prometheus -n monitoring --type='json' -p='[{"op": "replace", "path": "/spec/type", "value":"NodePort"},{"op": "add", "path": "/spec/ports/0/nodePort", "value":30090}]'
```

---

## 📞 Getting Help

If stuck, check:
1. Logs: `kubectl logs -n monitoring -l app=<service>`
2. Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Service status: `sudo systemctl status <service>`
4. This checklist
5. `SECURE_MONITORING_GUIDE.md`
6. `ROLLBACK_PLAN.md`

---

**Ready? Let's go! You got this! 💪**

**Current Status:** ⏸️ Ready to Deploy

**After Completion:** ✅ Production-Grade Security Implemented
