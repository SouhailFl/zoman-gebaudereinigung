#!/bin/bash
set -e

echo "🚀 Starting Zoman Gebäudereinigung Deployment..."

# 1. Build Docker images
echo "📦 Building Docker images..."
cd ~/zoman-gebaudereinigung

docker build -t zoman-website:latest ./website
docker build -t zoman-email:latest ./email-service
docker build -t zoman-agent:latest ./agent-service

# 2. Create namespaces
echo "📁 Creating namespaces..."
kubectl create namespace zoman --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace monitoring --dry-run=client -o yaml | kubectl apply -f -

# 3. Deploy main application
echo "🌐 Deploying application..."
kubectl apply -f k8s/website-deployment.yaml
kubectl apply -f k8s/email-deployment.yaml
kubectl apply -f k8s/agent-deployment.yaml

# 4. Deploy monitoring
echo "📊 Deploying monitoring..."
kubectl apply -f k8s/prometheus-deployment.yaml
kubectl apply -f k8s/grafana-deployment.yaml

# 5. Wait for pods
echo "⏳ Waiting for pods to be ready..."
kubectl wait --for=condition=ready pod -l app=website -n zoman --timeout=120s
kubectl wait --for=condition=ready pod -l app=email-service -n zoman --timeout=120s
kubectl wait --for=condition=ready pod -l app=agent-service -n zoman --timeout=120s

echo "✅ Deployment complete!"
echo "Next: Configure Nginx and SSL"1~#!/bin/bash
set -e

echo "🚀 Starting Zoman Gebäudereinigung Deployment..."

# 1. Build Docker images
echo "📦 Building Docker images..."
cd ~/zoman-gebaudereinigung

docker build -t zoman-website:latest ./website
docker build -t zoman-email:latest ./email-service
docker build -t zoman-agent:latest ./agent-service

# 2. Create namespaces
echo "📁 Creating namespaces..."
kubectl create namespace zoman --dry-run=client -o yaml | kubectl apply -f -
kubectl create namespace monitoring --dry-run=client -o yaml | kubectl apply -f -

# 3. Deploy main application
echo "🌐 Deploying application..."
kubectl apply -f k8s/website-deployment.yaml
kubectl apply -f k8s/email-deployment.yaml
kubectl apply -f k8s/agent-deployment.yaml

# 4. Deploy monitoring
echo "📊 Deploying monitoring..."
kubectl apply -f k8s/prometheus-deployment.yaml
kubectl apply -f k8s/grafana-deployment.yaml

# 5. Wait for pods
echo "⏳ Waiting for pods to be ready..."
kubectl wait --for=condition=ready pod -l app=website -n zoman --timeout=120s
kubectl wait --for=condition=ready pod -l app=email-service -n zoman --timeout=120s
kubectl wait --for=condition=ready pod -l app=agent-service -n zoman --timeout=120s

echo "✅ Deployment complete!"
echo "Next: Configure Nginx and SSL"
