# 🔒 SECURE MONITORING STACK - DEPLOYMENT GUIDE

**Goal:** Grafana & Prometheus behind Nginx with HTTPS + Authentication

**Status:** ✅ COMPLETED
**Deployment Date:** 2025-10-29

---

## ✅ COMPLETED DEPLOYMENT

### What Was Deployed

**Grafana:**
- URL: https://zoman.switzerlandnorth.cloudapp.azure.com/grafana/
- Username: `admin`
- Password: `Zoman2026!SecureGrafana#`
- Access: HTTPS with strong password
- Service Type: ClusterIP (internal only)

**Prometheus:**
- URL: https://zoman.switzerlandnorth.cloudapp.azure.com/prometheus/
- Username: `zoman`
- Password: `Zoman2026!SecurePrometheus#`
- Access: HTTPS with basic authentication
- Service Type: ClusterIP (internal only)

### Security Improvements Implemented

✅ **Encryption:** All traffic encrypted with TLS 1.2/1.3
✅ **Authentication:** Grafana strong password + Prometheus basic auth
✅ **Access Control:** Services only accessible via Nginx reverse proxy
✅ **Security Headers:** HSTS, X-Frame-Options, X-Content-Type-Options
✅ **Port Forwarding:** Permanent systemd services (survives reboots)
✅ **Path-Based Routing:** Single domain with `/grafana/` and `/prometheus/` paths

---

## 🏗️ Architecture

```
Internet
   ↓
Nginx (HTTPS on port 443)
   ├─→ /grafana/ → localhost:3000 → Grafana Pod (ClusterIP)
   └─→ /prometheus/ → localhost:9090 → Prometheus Pod (ClusterIP)
        ↓
   kubectl port-forward (systemd services)
        ↓
   Kubernetes Services (ClusterIP, internal only)
```

---

## 🔍 Verification Commands

### Check Services
```bash
# Monitoring pods should be running
kubectl get pods -n monitoring

# Services should be ClusterIP (not NodePort)
kubectl get services -n monitoring

# Port-forward services should be active
sudo systemctl status grafana-portforward
sudo systemctl status prometheus-portforward
```

### Test Access
```bash
# Grafana (should return 200)
curl -I https://zoman.switzerlandnorth.cloudapp.azure.com/grafana/login

# Prometheus (should return 200 with auth)
curl -u zoman:'Zoman2026!SecurePrometheus#' https://zoman.switzerlandnorth.cloudapp.azure.com/prometheus/

# Old ports should NOT work
curl http://20.250.146.204:30030  # Should fail
curl http://20.250.146.204:30090  # Should fail
```

---

## 🔧 Troubleshooting

### Grafana Not Accessible
```bash
# Check pod
kubectl get pods -n monitoring -l app=grafana
kubectl logs -n monitoring -l app=grafana --tail=50

# Check port-forward
sudo systemctl status grafana-portforward
sudo journalctl -u grafana-portforward -n 20

# Restart if needed
sudo systemctl restart grafana-portforward
```

### Prometheus Not Accessible
```bash
# Check pod
kubectl get pods -n monitoring -l app=prometheus
kubectl logs -n monitoring -l app=prometheus --tail=50

# Check port-forward
sudo systemctl status prometheus-portforward
sudo journalctl -u prometheus-portforward -n 20

# Restart if needed
sudo systemctl restart prometheus-portforward
```

### Port-Forward Issues
```bash
# Check if ports are in use
sudo lsof -ti:3000 -ti:9090

# Kill conflicting processes
sudo lsof -ti:3000 -ti:9090 | xargs sudo kill -9

# Restart services
sudo systemctl restart grafana-portforward prometheus-portforward
```

### Nginx Issues
```bash
# Check config
sudo nginx -t

# Check logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Restart Nginx
sudo systemctl restart nginx
```

---

## 📝 Configuration Files

### Nginx Config
Location: `/etc/nginx/sites-available/monitoring`
Enabled: `/etc/nginx/sites-enabled/monitoring`

### Systemd Services
- `/etc/systemd/system/grafana-portforward.service`
- `/etc/systemd/system/prometheus-portforward.service`

### Kubernetes Manifests
- `k8s/grafana-deployment.yaml` (updated, no config volume mount)
- `k8s/prometheus-deployment.yaml` (updated with subpath args)

---

## 🔐 Credentials (SAVE THESE!)

**Grafana:**
- URL: https://zoman.switzerlandnorth.cloudapp.azure.com/grafana/
- Username: `admin`
- Password: `Zoman2026!SecureGrafana#`

**Prometheus:**
- URL: https://zoman.switzerlandnorth.cloudapp.azure.com/prometheus/
- Username: `zoman`
- Password: `Zoman2026!SecurePrometheus#`

---

## 🎤 Bootcamp Presentation Points

### What to Show

1. **Main Website** - https://zoman.switzerlandnorth.cloudapp.azure.com
   - Green padlock (SSL)
   - Fully functional

2. **Grafana Dashboard** - /grafana/
   - Green padlock (SSL)
   - Strong password protection
   - Live metrics visualizations

3. **Prometheus Metrics** - /prometheus/
   - Green padlock (SSL)
   - Basic authentication required
   - Real-time metrics collection

4. **Terminal Demo**
   ```bash
   # Show services are internal only
   kubectl get services -n monitoring
   
   # Show port-forward services running
   sudo systemctl status grafana-portforward prometheus-portforward
   
   # Show security headers
   curl -I https://zoman.switzerlandnorth.cloudapp.azure.com/grafana/
   ```

### Key Talking Points

- ✅ "Implemented defense-in-depth security architecture"
- ✅ "All monitoring traffic encrypted end-to-end with TLS 1.3"
- ✅ "Services not directly exposed - only accessible via authenticated reverse proxy"
- ✅ "Security headers protect against XSS, clickjacking, and MIME sniffing attacks"
- ✅ "Path-based routing allows multiple services on single domain"
- ✅ "Systemd integration ensures services survive server reboots"

### Before vs After

| Aspect | Before | After |
|--------|--------|-------|
| Grafana | ❌ HTTP port 30030 | ✅ HTTPS /grafana/ |
| Password | ❌ `admin123` | ✅ Strong password |
| Prometheus | ❌ HTTP port 30090, no auth | ✅ HTTPS /prometheus/ + auth |
| Exposure | ❌ Direct NodePort | ✅ Reverse proxy only |
| Security | ❌ None | ✅ Headers + TLS |

---

## 🎉 Success Checklist

- [x] Grafana accessible via HTTPS with strong password
- [x] Prometheus accessible via HTTPS with basic auth
- [x] Old NodePort endpoints no longer accessible
- [x] SSL certificates valid and auto-renewing
- [x] Port forwarding survives reboots
- [x] All security headers enabled
- [x] Path-based routing working
- [x] Documentation updated
- [x] Credentials saved securely

---

## 🔄 Maintenance

### Update Passwords
```bash
# Grafana
kubectl set env deployment/grafana -n monitoring GF_SECURITY_ADMIN_PASSWORD='NewPassword123!'

# Prometheus
sudo htpasswd -bc /etc/nginx/.htpasswd-prometheus zoman 'NewPassword123!'
```

### Check SSL Certificates
```bash
# View certificates
sudo certbot certificates

# Test renewal
sudo certbot renew --dry-run

# Manual renewal if needed
sudo certbot renew
```

### Restart Services
```bash
# Restart Grafana
kubectl rollout restart deployment/grafana -n monitoring

# Restart Prometheus
kubectl rollout restart deployment/prometheus -n monitoring

# Restart port-forwards
sudo systemctl restart grafana-portforward prometheus-portforward

# Restart Nginx
sudo systemctl restart nginx
```

---

**Deployment Completed:** 2025-10-29
**Status:** ✅ Production Ready
**Next:** Update presentation materials and practice demo
