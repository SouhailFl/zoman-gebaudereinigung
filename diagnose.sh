#!/bin/bash
echo "🔍 Kubernetes Diagnostics"
echo "========================"
echo ""

echo "📦 Checking Docker images..."
docker images | grep zoman

echo ""
echo "🏗️ Checking namespaces..."
kubectl get namespaces

echo ""
echo "📊 Pod status in zoman namespace..."
kubectl get pods -n zoman -o wide

echo ""
echo "📝 Describe failing pods..."
kubectl get pods -n zoman --field-selector=status.phase!=Running -o name | while read pod; do
    echo "=== Details for $pod ==="
    kubectl describe $pod -n zoman
    echo ""
    echo "=== Logs for $pod ==="
    kubectl logs $pod -n zoman --tail=50 2>&1 || echo "No logs available"
    echo ""
done

echo ""
echo "🔌 Checking services..."
kubectl get svc -n zoman

echo ""
echo "🎯 Node status..."
kubectl get nodes -o wide

echo ""
echo "💾 Checking system resources..."
df -h
free -h

echo ""
echo "🐋 Docker status..."
systemctl status docker --no-pager | head -20
