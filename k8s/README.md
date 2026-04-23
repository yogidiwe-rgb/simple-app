# Kubernetes Manifests

## 🎯 Environment Structure

This directory contains Kubernetes manifests for deploying your full-stack application to DEV and PROD environments.

### 📁 Directory Structure

```
k8s/
├── dev/                          # Development Environment
│   ├── namespace.yaml
│   ├── backend-deployment.yaml
│   ├── gateway-deployment.yaml
│   ├── frontend-deployment.yaml
│   └── ingress.yaml
├── prod/                         # Production Environment
│   ├── namespace.yaml
│   ├── backend-deployment.yaml
│   ├── gateway-deployment.yaml
│   ├── frontend-deployment.yaml
│   └── ingress.yaml
└── README.md
```

## 🌍 Environment Configurations

### Development (dev/)
- **Namespace**: `dev`
- **Replicas**: 2 per service
- **Resources**: Lower limits (dev environment)
- **Images**: `your-registry.com/simple-fullstack-app:dev-latest`
- **Host**: `dev-cluster.local`
- **TLS**: None (development only)

### Production (prod/)
- **Namespace**: `prod`
- **Replicas**: 3 per service
- **Resources**: Higher limits (production workload)
- **Images**: `your-registry.com/simple-fullstack-app:prod-latest`
- **Host**: `prod-cluster.example.com`
- **TLS**: Enabled with Let's Encrypt

## 🚀 Deployment Commands

### Deploy to DEV
```bash
# Set kubectl context
kubectl config use-context kind-dev-cluster

# Apply all manifests
kubectl apply -f k8s/dev/

# Check deployment status
kubectl get all -n dev
```

### Deploy to PROD
```bash
# Set kubectl context
kubectl config use-context kind-prod-cluster

# Apply all manifests
kubectl apply -f k8s/prod/

# Check deployment status
kubectl get all -n prod
```

## 🔧 Service Configuration

### Backend Service
- **Port**: 5001
- **Health Check**: `/api/health`
- **Environment Variables**:
  - `FLASK_ENV`: development/production
  - `LOG_LEVEL`: INFO/WARN

### Gateway Service
- **Port**: 3000
- **Health Check**: `/api/health`
- **Environment Variables**:
  - `BACKEND_URL`: `http://backend-service:5001`
  - `NODE_ENV`: development/production

### Frontend Service
- **Port**: 80
- **Health Check**: `/health`
- **Environment Variables**:
  - `API_BASE_URL`: `/api`

## 📊 Resource Allocation

### Development (per pod)
```yaml
requests:
  memory: "128Mi"  # Backend/Gateway
  cpu: "100m"
limits:
  memory: "256Mi"
  cpu: "200m"
```

### Production (per pod)
```yaml
requests:
  memory: "256Mi"  # Backend/Gateway
  cpu: "200m"
limits:
  memory: "512Mi"
  cpu: "400m"
```

## 🔍 Health Checks

All services include:
- **Liveness Probe**: Detects if container is running
- **Readiness Probe**: Detects if container is ready for traffic
- **Initial Delay**: 30s (dev) / 60s (prod)
- **Period**: 10s (dev) / 15s (prod)

## 🌐 Ingress Configuration

### Development
- **Host**: `dev-cluster.local`
- **Path Routing**:
  - `/api` → Gateway Service
  - `/` → Frontend Service

### Production
- **Host**: `prod-cluster.example.com`
- **TLS**: Enabled with cert-manager
- **Path Routing**:
  - `/api` → Gateway Service
  - `/` → Frontend Service

## 🧪 Testing Deployment

### Health Check Commands
```bash
# DEV Environment
kubectl port-forward svc/frontend-service 8080:80 -n dev
kubectl port-forward svc/gateway-service 3000:3000 -n dev
kubectl port-forward svc/backend-service 5001:5001 -n dev

# PROD Environment
kubectl port-forward svc/frontend-service 8080:80 -n prod
kubectl port-forward svc/gateway-service 3000:3000 -n prod
kubectl port-forward svc/backend-service 5001:5001 -n prod
```

## 📝 Notes

- **Image Registry**: Replace `your-registry.com` with actual registry
- **Domain Names**: Update `prod-cluster.example.com` for production
- **TLS Certificates**: Configure cert-manager for production HTTPS
- **Resource Limits**: Adjust based on actual workload requirements
