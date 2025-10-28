# 🚀 Quick Start: Deploy Monitoring in 5 Minutes

## Prerequisites
- SSH access to VM: `ssh zoman@20.250.146.204`
- Files ready in `k8s/` directory

---

## 5-Step Deployment

### 1. Create Namespace (10 seconds)
```bash
kubectl create namespace monitoring
```

### 2. Deploy Prometheus (20 seconds)
```bash
kubectl apply -f k8s/prometheus-deployment.yaml
```

### 3. Deploy Grafana (20 seconds)
```bash
kubectl apply -f k8s/grafana-deployment.yaml
```

### 4. Wait for Pods (1-2 minutes)
```bash
kubectl get pods -n monitoring -w
# Wait for: prometheus-xxx 1/1 Running
# Wait for: grafana-xxx    1/1 Running
# Press Ctrl+C when both ready
```

### 5. Access Dashboards (30 seconds)
```bash
# Open in browser:
# Prometheus: http://20.250.146.204:30090
# Grafana:    http://20.250.146.204:30030
# Login:      admin / admin123
```

---

## Quick Setup in Grafana (2 minutes)

1. Login: `admin` / `admin123`
2. Skip password change (for now)
3. Click **+** → **Import**
4. Enter: `315`
5. Click **Load** → Select Prometheus → **Import**

**Done!** 🎉 You now have live Kubernetes metrics!

---

## Useful Prometheus Queries

Try these in Prometheus (http://20.250.146.204:30090):

```promql
# Check service status
up

# CPU usage
rate(container_cpu_usage_seconds_total[5m])

# Memory usage
container_memory_usage_bytes

# Pod count
count(kube_pod_info)

# Pod restarts
kube_pod_container_status_restarts_total
```

---

## Quick Troubleshooting

```bash
# Check status
kubectl get pods -n monitoring

# View logs
kubectl logs -n monitoring -l app=prometheus
kubectl logs -n monitoring -l app=grafana

# Restart if needed
kubectl delete pod -n monitoring -l app=prometheus
kubectl delete pod -n monitoring -l app=grafana

# Delete everything
kubectl delete namespace monitoring
```

---

## What You Get

✅ Real-time cluster metrics  
✅ CPU/Memory usage graphs  
✅ Pod status monitoring  
✅ Beautiful Grafana dashboards  
✅ Professional DevOps setup  

**Perfect for bootcamp presentation!** 💪

---

For detailed guide, see: [MONITORING_SETUP.md](MONITORING_SETUP.md)
