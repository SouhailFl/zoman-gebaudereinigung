# 🔄 ROLLBACK PLAN - If Something Goes Wrong

**If deployment fails, follow these steps to restore previous state**

---

## 🚨 Emergency Rollback (Quick)

If you need to quickly restore access to monitoring:

```bash
# SSH to VM
ssh zoman@20.250.146.204

# Restore old Grafana deployment (NodePort 30030)
kubectl patch service grafana -n monitoring --type='json' -p='[{"op": "replace", "path": "/spec/type", "value":"NodePort"},{"op": "add", "path": "/spec/ports/0/nodePort", "value":30030}]'

# Restore old Prometheus deployment (NodePort 30090)
kubectl patch service prometheus -n monitoring --type='json' -p='[{"op": "replace", "path": "/spec/type", "value":"NodePort"},{"op": "add", "path": "/spec/ports/0/nodePort", "value":30090}]'

# Restart pods to pick up changes
kubectl rollout restart deployment/grafana -n monitoring
kubectl rollout restart deployment/prometheus -n monitoring
```

**Access restored at:**
- Grafana: http://20.250.146.204:30030
- Prometheus: http://20.250.146.204:30090

---

## 📋 Full Rollback (Complete)

### Step 1: Remove Nginx Config
```bash
# Disable monitoring site
sudo rm /etc/nginx/sites-enabled/monitoring

# Reload Nginx
sudo nginx -t && sudo systemctl reload nginx
```

### Step 2: Stop Port Forwarding Services
```bash
# Stop and disable port forwarding
sudo systemctl stop grafana-portforward
sudo systemctl stop prometheus-portforward
sudo systemctl disable grafana-portforward
sudo systemctl disable prometheus-portforward

# Remove service files
sudo rm /etc/systemd/system/grafana-portforward.service
sudo rm /etc/systemd/system/prometheus-portforward.service
sudo systemctl daemon-reload
```

### Step 3: Restore Original K8s Deployments
```bash
cd ~/zoman-gebaudereinigung

# Get previous version from git
git log --oneline k8s/grafana-deployment.yaml
# Note the commit hash before security changes

# Restore previous versions
git checkout <commit-hash> k8s/grafana-deployment.yaml
git checkout <commit-hash> k8s/prometheus-deployment.yaml

# Apply old configs
kubectl apply -f k8s/grafana-deployment.yaml
kubectl apply -f k8s/prometheus-deployment.yaml

# Wait for rollout
kubectl rollout status deployment/grafana -n monitoring
kubectl rollout status deployment/prometheus -n monitoring
```

### Step 4: Verify Rollback
```bash
# Check services are back to NodePort
kubectl get services -n monitoring
# Should show TYPE: NodePort

# Test access
curl -I http://20.250.146.204:30030/api/health
curl -I http://20.250.146.204:30090/-/healthy
```

### Step 5: Clean Up (Optional)
```bash
# Remove basic auth file
sudo rm /etc/nginx/.htpasswd-prometheus

# Remove SSL certificates (optional - they don't hurt anything)
# sudo certbot delete --cert-name grafana.zoman.switzerlandnorth.cloudapp.azure.com
# sudo certbot delete --cert-name prometheus.zoman.switzerlandnorth.cloudapp.azure.com
```

---

## 🔍 Troubleshooting Common Issues

### Issue 1: Can't Access Grafana/Prometheus After Deployment

**Symptoms:** Timeout or connection refused

**Check:**
```bash
# Are pods running?
kubectl get pods -n monitoring

# Are port-forward services running?
sudo systemctl status grafana-portforward
sudo systemctl status prometheus-portforward

# Is Nginx running?
sudo systemctl status nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

**Fix:**
```bash
# Restart port forwarding
sudo systemctl restart grafana-portforward
sudo systemctl restart prometheus-portforward

# Restart Nginx
sudo systemctl restart nginx
```

---

### Issue 2: SSL Certificate Failed

**Symptoms:** 502 Bad Gateway or SSL errors

**Possible Causes:**
- DNS not propagated yet
- Certbot couldn't reach domain
- Wrong domain name in config

**Fix:**
```bash
# Wait 5-10 minutes for DNS propagation, then retry
sudo certbot certonly --nginx -d grafana.zoman.switzerlandnorth.cloudapp.azure.com

# Or temporarily use HTTP only (edit nginx config):
# Comment out ssl_certificate lines
# Change listen 443 ssl to listen 80
```

---

### Issue 3: Wrong Grafana Password

**Symptoms:** Can't login to Grafana

**Fix:**
```bash
# Reset password via environment variable
kubectl set env deployment/grafana -n monitoring GF_SECURITY_ADMIN_PASSWORD="new-password"

# Or rollback to old password
kubectl set env deployment/grafana -n monitoring GF_SECURITY_ADMIN_PASSWORD="admin123"
```

---

### Issue 4: Prometheus Basic Auth Not Working

**Symptoms:** 401 Unauthorized

**Fix:**
```bash
# Recreate htpasswd file
sudo htpasswd -bc /etc/nginx/.htpasswd-prometheus admin your-password

# Test auth manually
curl -u admin:your-password http://localhost:9090/-/healthy

# Reload Nginx
sudo systemctl reload nginx
```

---

### Issue 5: Port Forwarding Stops Working

**Symptoms:** 502 Bad Gateway intermittently

**Fix:**
```bash
# Check if kubectl port-forward is running
ps aux | grep "port-forward"

# Restart services
sudo systemctl restart grafana-portforward
sudo systemctl restart prometheus-portforward

# Check logs
sudo journalctl -u grafana-portforward -f
sudo journalctl -u prometheus-portforward -f
```

---

## ⚠️ Prevention - Before You Deploy

**Checklist before making changes:**

1. ✅ **Backup current state:**
   ```bash
   kubectl get all -n monitoring -o yaml > monitoring-backup.yaml
   ```

2. ✅ **Take screenshots:**
   - Current Grafana dashboard
   - Current Prometheus UI
   - Current `kubectl get services -n monitoring`

3. ✅ **Save credentials:**
   - Current Grafana password
   - Document somewhere safe

4. ✅ **Test in non-production first** (if you have another VM)

5. ✅ **Have rollback plan ready** (this document!)

6. ✅ **Schedule maintenance window:**
   - Don't do this right before presentation
   - Allow 1-2 hours for troubleshooting if needed

---

## 🆘 Emergency Contacts

If totally stuck:

1. **Check Documentation:**
   - `SECURE_MONITORING_GUIDE.md`
   - `SECURITY_IMPLEMENTATION_SUMMARY.md`
   - This file (`ROLLBACK_PLAN.md`)

2. **Check Logs:**
   ```bash
   # Kubernetes
   kubectl logs -n monitoring -l app=grafana --tail=50
   kubectl logs -n monitoring -l app=prometheus --tail=50
   
   # Nginx
   sudo tail -50 /var/log/nginx/error.log
   
   # Systemd services
   sudo journalctl -u grafana-portforward --since "10 minutes ago"
   sudo journalctl -u prometheus-portforward --since "10 minutes ago"
   ```

3. **Quick Health Check:**
   ```bash
   # All in one command
   echo "=== Pods ===" && \
   kubectl get pods -n monitoring && \
   echo "=== Services ===" && \
   kubectl get services -n monitoring && \
   echo "=== Port Forwards ===" && \
   sudo systemctl status grafana-portforward --no-pager && \
   sudo systemctl status prometheus-portforward --no-pager && \
   echo "=== Nginx ===" && \
   sudo systemctl status nginx --no-pager
   ```

---

## 📞 Last Resort - Complete Reset

If everything is broken and you need monitoring back NOW:

```bash
# Delete everything monitoring-related
kubectl delete namespace monitoring

# Recreate namespace
kubectl create namespace monitoring

# Deploy original simple versions
kubectl apply -f <original-prometheus-deployment.yaml>
kubectl apply -f <original-grafana-deployment.yaml>

# Should be back up in 2-3 minutes
kubectl get pods -n monitoring -w
```

Then access at:
- http://20.250.146.204:30090 (Prometheus)
- http://20.250.146.204:30030 (Grafana, admin/admin123)

---

## ✅ Post-Rollback Checklist

After successful rollback:

- [ ] Monitoring accessible again
- [ ] Grafana dashboards still configured
- [ ] Prometheus targets still being scraped
- [ ] Main website still working
- [ ] Document what went wrong
- [ ] Plan fix for next attempt

---

## 📝 Learning from Failures

If rollback was needed, document:

1. **What went wrong?**
   - Exact error message
   - Which step failed
   - What you were doing when it failed

2. **Root cause?**
   - Configuration error?
   - DNS issue?
   - Kubernetes problem?
   - Nginx misconfiguration?

3. **What would prevent this next time?**
   - Better testing?
   - Clearer instructions?
   - Different approach?

**Remember:** Rollbacks are normal in DevOps! Having a plan shows maturity.

---

## 🎯 When to Rollback vs. Fix Forward

**Rollback if:**
- ⏰ You need monitoring NOW (presentation in 1 hour)
- 🤷 You don't understand the error
- 🔥 Main website is affected
- 😰 You're not confident in the fix

**Fix forward if:**
- ⏱️ You have time (presentation in 2+ days)
- 🧐 Error message is clear
- 🎯 You know exactly what to fix
- 📚 Good learning opportunity

---

**Keep this file handy during deployment!** 🛟

---

**Pro Tip:** If presenting soon and deployment fails, rollback immediately. You can always secure it properly after bootcamp. Working insecure monitoring is better than broken secure monitoring for a demo! 😉
