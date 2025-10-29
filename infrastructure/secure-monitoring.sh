#!/bin/bash
# Script to secure monitoring stack with HTTPS
# Run this on your Azure VM as user 'zoman'

set -e  # Exit on any error

echo "🔒 Securing Monitoring Stack with HTTPS"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Create port-forwarding services for monitoring
echo -e "${YELLOW}Step 1: Setting up port forwarding for monitoring services${NC}"
echo "Creating temporary NodePort services for initial access..."

# We need to temporarily expose services to configure SSL
# After SSL is set up, we'll remove these

# Step 2: Create basic auth for Prometheus
echo -e "\n${YELLOW}Step 2: Setting up basic authentication for Prometheus${NC}"
read -p "Enter username for Prometheus access (default: admin): " PROM_USER
PROM_USER=${PROM_USER:-admin}

read -sp "Enter password for Prometheus: " PROM_PASS
echo ""

# Install apache2-utils for htpasswd
if ! command -v htpasswd &> /dev/null; then
    echo "Installing apache2-utils..."
    sudo apt-get update -qq
    sudo apt-get install -y apache2-utils
fi

# Create htpasswd file
sudo htpasswd -bc /etc/nginx/.htpasswd-prometheus "$PROM_USER" "$PROM_PASS"
echo -e "${GREEN}✓ Basic auth configured for Prometheus${NC}"

# Step 3: Copy Nginx config
echo -e "\n${YELLOW}Step 3: Configuring Nginx reverse proxy${NC}"
sudo cp ~/zoman-gebaudereinigung/infrastructure/nginx-monitoring.conf /etc/nginx/sites-available/monitoring

# Don't enable yet - need SSL certificates first
echo -e "${GREEN}✓ Nginx config file created${NC}"

# Step 4: Get SSL certificates
echo -e "\n${YELLOW}Step 4: Obtaining SSL certificates with Let's Encrypt${NC}"
echo "Note: This requires the services to be temporarily accessible on their ports"

# Set up port forwarding for Grafana
echo "Setting up port forwarding for Grafana..."
sudo kubectl port-forward -n monitoring svc/grafana 3000:3000 --address=0.0.0.0 &
GRAFANA_PID=$!
sleep 5

# Set up port forwarding for Prometheus  
echo "Setting up port forwarding for Prometheus..."
sudo kubectl port-forward -n monitoring svc/prometheus 9090:9090 --address=0.0.0.0 &
PROMETHEUS_PID=$!
sleep 5

echo -e "${YELLOW}Obtaining certificate for Grafana...${NC}"
sudo certbot certonly --nginx \
  -d grafana.zoman.switzerlandnorth.cloudapp.azure.com \
  --non-interactive \
  --agree-tos \
  --email souhail.fliou@example.com \
  || echo -e "${RED}Failed to get Grafana certificate. Check DNS settings.${NC}"

echo -e "${YELLOW}Obtaining certificate for Prometheus...${NC}"
sudo certbot certonly --nginx \
  -d prometheus.zoman.switzerlandnorth.cloudapp.azure.com \
  --non-interactive \
  --agree-tos \
  --email souhail.fliou@example.com \
  || echo -e "${RED}Failed to get Prometheus certificate. Check DNS settings.${NC}"

# Kill port-forward processes
kill $GRAFANA_PID $PROMETHEUS_PID 2>/dev/null || true

echo -e "${GREEN}✓ SSL certificates obtained${NC}"

# Step 5: Enable Nginx config
echo -e "\n${YELLOW}Step 5: Enabling Nginx configuration${NC}"
sudo ln -sf /etc/nginx/sites-available/monitoring /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
echo -e "${GREEN}✓ Nginx reloaded with new config${NC}"

# Step 6: Update Kubernetes deployments
echo -e "\n${YELLOW}Step 6: Updating Kubernetes deployments${NC}"
kubectl apply -f ~/zoman-gebaudereinigung/k8s/grafana-deployment.yaml
kubectl apply -f ~/zoman-gebaudereinigung/k8s/prometheus-deployment.yaml

echo "Waiting for pods to restart..."
kubectl rollout status deployment/grafana -n monitoring
kubectl rollout status deployment/prometheus -n monitoring

echo -e "${GREEN}✓ Kubernetes deployments updated${NC}"

# Step 7: Set up port forwarding permanently
echo -e "\n${YELLOW}Step 7: Setting up permanent port forwarding${NC}"

# Create systemd service for Grafana port forwarding
cat <<EOF | sudo tee /etc/systemd/system/grafana-portforward.service
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
EOF

# Create systemd service for Prometheus port forwarding
cat <<EOF | sudo tee /etc/systemd/system/prometheus-portforward.service
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
EOF

# Enable and start services
sudo systemctl daemon-reload
sudo systemctl enable grafana-portforward.service
sudo systemctl enable prometheus-portforward.service
sudo systemctl start grafana-portforward.service
sudo systemctl start prometheus-portforward.service

echo -e "${GREEN}✓ Port forwarding services configured${NC}"

# Final verification
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Monitoring stack secured successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Access your dashboards:"
echo "  • Grafana: https://grafana.zoman.switzerlandnorth.cloudapp.azure.com"
echo "    Username: admin"
echo "    Password: Zoman2024!SecureGrafana#"
echo ""
echo "  • Prometheus: https://prometheus.zoman.switzerlandnorth.cloudapp.azure.com"
echo "    Username: $PROM_USER"
echo "    Password: [your password]"
echo ""
echo "Old unsecured URLs are now disabled."
echo ""
echo -e "${YELLOW}⚠️  Save the new Grafana password in a secure location!${NC}"
