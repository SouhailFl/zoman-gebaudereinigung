# 📊 Prometheus + Grafana Monitoring Setup Guide

## Overview
This guide will help you deploy Prometheus and Grafana to monitor your Kubernetes cluster.

**Time Required:** 20 minutes  
**Difficulty:** Easy

---

## What You're Installing

### Prometheus
- **Purpose:** Collects metrics from your K8s cluster
- **Collects:** CPU usage, memory usage, pod status, request rates
- **Access:** http://20.250.146.204:30090

### Grafana
- **Purpose:** Visualizes metrics with beautiful dashboards
- **Features:** Real-time graphs, alerts, custom dashboards
- **Access:** http://20.250.146.204:30030
- **Login:** admin / admin123

---

## Deployment Steps

### Step 1: SSH to Your VM

```bash
ssh zoman@20.250.146.204
```

### Step 2: Navigate to Project Directory

```bash
cd ~/zoman-gebaudereinigung
```

### Step 3: Create Monitoring Namespace

```bash
kubectl create namespace monitoring
```

Expected output:
```
namespace/monitoring created
```

### Step 4: Deploy Prometheus

```bash
kubectl apply -f k8s/prometheus-deployment.yaml
```

Expected output:
```
configmap/prometheus-config created
deployment.apps/prometheus created
service/prometheus created
serviceaccount/prometheus created
clusterrole.rbac.authorization.k8s.io/prometheus created
clusterrolebinding.rbac.authorization.k8s.io/prometheus created
```

### Step 5: Deploy Grafana

```bash
kubectl apply -f k8s/grafana-deployment.yaml
```

Expected output:
```
deployment.apps/grafana created
service/grafana created
configmap/grafana-datasources created
```

### Step 6: Wait for Pods to Start

```bash
kubectl get pods -n monitoring -w
```

Wait until both pods show `Running` and `1/1` ready:
```
NAME                          READY   STATUS    RESTARTS   AGE
prometheus-xxxxx              1/1     Running   0          1m
grafana-xxxxx                 1/1     Running   0          1m
```

Press `Ctrl+C` to exit the watch mode.

### Step 7: Verify Services

```bash
kubectl get services -n monitoring
```

Expected output:
```
NAME         TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
prometheus   NodePort   10.43.xxx.xxx   <none>        9090:30090/TCP   2m
grafana      NodePort   10.43.xxx.xxx   <none>        3000:30030/TCP   2m
```

---

## Accessing the Dashboards

### Prometheus

1. Open browser: http://20.250.146.204:30090
2. Try a query: `up` (shows all services)
3. Try another: `container_memory_usage_bytes` (shows memory usage)

**Useful Prometheus Queries:**
- `up` - Check which services are running
- `container_cpu_usage_seconds_total` - CPU usage
- `container_memory_usage_bytes` - Memory usage
- `kube_pod_status_phase` - Pod status

### Grafana

1. Open browser: http://20.250.146.204:30030
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. (Optional) Skip password change for now

---

## Configuring Grafana

### Add Prometheus Data Source (if not auto-configured)

1. Click ⚙️ **Configuration** → **Data Sources**
2. Click **Add data source**
3. Choose **Prometheus**
4. Set URL: `http://prometheus:9090`
5. Click **Save & Test** (should show green checkmark ✅)

### Import Kubernetes Dashboard

1. Click **+** → **Import**
2. Enter Dashboard ID: **315**
3. Click **Load**
4. Select Prometheus data source
5. Click **Import**

**You now have a complete Kubernetes monitoring dashboard!** 🎉

### Other Recommended Dashboards

Import these dashboard IDs for more insights:

- **315** - Kubernetes cluster monitoring (already imported)
- **6417** - Kubernetes Cluster (Prometheus)
- **8588** - Kubernetes Deployment Statefulset Daemonset metrics
- **3662** - Prometheus 2.0 Overview

---

## What Metrics Can You See?

After importing dashboards, you'll see:

### Cluster Overview
- Number of nodes
- Total CPU usage
- Total memory usage
- Number of running pods

### Pod Metrics
- CPU usage per pod
- Memory usage per pod
- Network I/O per pod
- Pod restart count

### Service Metrics
- Request rate
- Error rate
- Response latency
- Service availability

---

## Setting Up Alerts (Optional)

### Create Alert for Pod Down

1. In Grafana, go to **Alerting** → **Alert rules**
2. Click **New alert rule**
3. Set:
   - **Alert name:** Pod Down Alert
   - **Query:** `up == 0`
   - **Condition:** `IS ABOVE 0`
   - **For:** 5 minutes
4. Add notification channel (email, Slack, etc.)
5. Click **Save**

---

## Troubleshooting

### Pods Not Starting

```bash
# Check pod status
kubectl get pods -n monitoring

# Check pod logs
kubectl logs -n monitoring <pod-name>

# Describe pod for events
kubectl describe pod -n monitoring <pod-name>
```

### Can't Access Prometheus

```bash
# Check if service is running
kubectl get services -n monitoring

# Check if port is accessible
curl http://localhost:30090
```

### Can't Access Grafana

```bash
# Check Grafana logs
kubectl logs -n monitoring -l app=grafana

# Restart Grafana
kubectl delete pod -n monitoring -l app=grafana
```

### Grafana Shows "No Data"

1. Check Prometheus data source configuration
2. Verify Prometheus URL: `http://prometheus:9090`
3. Click "Save & Test" in data source settings
4. Check if Prometheus is collecting metrics: http://20.250.146.204:30090/targets

---

## Useful Commands

### Check Monitoring Status

```bash
# View all monitoring resources
kubectl get all -n monitoring

# Check pod logs
kubectl logs -n monitoring -l app=prometheus
kubectl logs -n monitoring -l app=grafana

# Check pod resource usage
kubectl top pods -n monitoring
```

### Restart Services

```bash
# Restart Prometheus
kubectl delete pod -n monitoring -l app=prometheus

# Restart Grafana
kubectl delete pod -n monitoring -l app=grafana
```

### Update Configuration

```bash
# After editing prometheus-deployment.yaml
kubectl apply -f k8s/prometheus-deployment.yaml

# After editing grafana-deployment.yaml
kubectl apply -f k8s/grafana-deployment.yaml
```

### Delete Monitoring Stack

```bash
# Delete all monitoring resources
kubectl delete -f k8s/prometheus-deployment.yaml
kubectl delete -f k8s/grafana-deployment.yaml

# Delete namespace (removes everything)
kubectl delete namespace monitoring
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────┐
│         Your Kubernetes Cluster         │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │     Application Pods            │   │
│  │  (website, email, agent)        │   │
│  │                                 │   │
│  │  Expose /metrics endpoint       │   │
│  └────────────┬────────────────────┘   │
│               │                         │
│               │ Scrapes metrics         │
│               ▼                         │
│  ┌─────────────────────────────────┐   │
│  │       Prometheus                │   │
│  │  - Collects metrics             │   │
│  │  - Stores time-series data      │   │
│  │  - Evaluates alert rules        │   │
│  │                                 │   │
│  │  Port: 30090 (NodePort)         │   │
│  └────────────┬────────────────────┘   │
│               │                         │
│               │ Queries metrics         │
│               ▼                         │
│  ┌─────────────────────────────────┐   │
│  │         Grafana                 │   │
│  │  - Visualizes metrics           │   │
│  │  - Creates dashboards           │   │
│  │  - Sends alerts                 │   │
│  │                                 │   │
│  │  Port: 30030 (NodePort)         │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
                 │
                 │ Access via browser
                 ▼
          ┌──────────────┐
          │    You       │
          └──────────────┘
```

---

## Security Considerations

### Production Hardening (Future)

For production use, consider:

1. **Change default Grafana password:**
   ```bash
   # Login to Grafana
   # Go to Profile → Change Password
   ```

2. **Enable authentication:**
   - Add OAuth (Google, GitHub, Azure AD)
   - Enable LDAP authentication

3. **Secure endpoints:**
   - Use Ingress with TLS
   - Add authentication to Prometheus

4. **Resource limits:**
   - Already configured in YAML files
   - Adjust based on actual usage

5. **Persistent storage:**
   - Current setup uses `emptyDir` (data lost on restart)
   - For production: Use PersistentVolume

---

## Next Steps

### After Successful Deployment

1. **Explore Grafana dashboards** - Spend 10 minutes clicking around
2. **Create custom dashboard** - Add panels for your specific needs
3. **Set up alerts** - Get notified when things go wrong
4. **Document in presentation** - Add screenshots to bootcamp demo
5. **Take screenshots** - For your portfolio/CV

### Advanced Features (Optional)

- Add custom metrics to your applications
- Create custom Prometheus exporters
- Set up alertmanager for notifications
- Add more dashboard panels
- Configure Grafana plugins

---

## Verification Checklist

- [ ] Monitoring namespace created
- [ ] Prometheus pod running
- [ ] Grafana pod running
- [ ] Can access Prometheus UI (port 30090)
- [ ] Can access Grafana UI (port 30030)
- [ ] Can login to Grafana
- [ ] Prometheus data source configured in Grafana
- [ ] Kubernetes dashboard imported
- [ ] Dashboard shows live metrics
- [ ] Took screenshots for presentation

---

## Support

### If Something Goes Wrong

1. Check this guide first
2. View pod logs: `kubectl logs -n monitoring <pod-name>`
3. Check events: `kubectl get events -n monitoring`
4. Restart pods: `kubectl delete pod -n monitoring -l app=<name>`
5. Verify connectivity: `curl http://prometheus:9090` from inside Grafana pod

### Common Issues & Solutions

**Issue:** Grafana shows "No data"  
**Solution:** Check Prometheus URL in data source settings

**Issue:** Prometheus can't scrape metrics  
**Solution:** Check if your pods have `/metrics` endpoint

**Issue:** Pods crash on startup  
**Solution:** Check logs with `kubectl logs -n monitoring <pod-name>`

---

## Congratulations! 🎉

You now have a **professional monitoring stack** running on your Kubernetes cluster!

This is **enterprise-grade infrastructure** that many companies use in production. You can confidently talk about this in your bootcamp presentation and job interviews.

**Time to celebrate:** ☕ Take a break, you've earned it!

---

## Resources

- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Kubernetes Monitoring Guide](https://kubernetes.io/docs/tasks/debug-application-cluster/resource-metrics-pipeline/)
- [Awesome Grafana Dashboards](https://grafana.com/grafana/dashboards/)

**Happy Monitoring!** 📊
