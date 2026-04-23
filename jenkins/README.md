# Jenkins CI/CD Pipeline Configuration

## 🎯 Pipeline Strategy

This directory contains Jenkins pipeline configurations for your three-pipeline DevOps workflow.

### 📁 Pipeline Files

#### 1. `Jenkinsfile.feature`
- **Trigger**: Push to `feature/*` branches
- **Purpose**: Build + validation only (no deployment)
- **Stages**: Checkout → Build → Validate → Security Scan

#### 2. `Jenkinsfile.dev`
- **Trigger**: Merge to `develop` branch
- **Purpose**: Deploy to DEV environment
- **Stages**: Checkout → Build → Push → Deploy → Health Check → Integration Tests

#### 3. `Jenkinsfile.prod`
- **Trigger**: Pull Request `develop` → `main`
- **Purpose**: Deploy to PROD environment
- **Stages**: Checkout → Build → Security Scan → Push → Manual Approval → Deploy → Health Check → Production Tests

## 🔧 Jenkins Setup Instructions

### Step 1: Jenkins Configuration
1. Install Jenkins with recommended plugins:
   - Docker Pipeline
   - Kubernetes CLI
   - Slack Notification
   - Blue Ocean
   - Git

2. Create three Jenkins jobs:
   - `feature-pipeline` (uses `Jenkinsfile.feature`)
   - `dev-pipeline` (uses `Jenkinsfile.dev`)
   - `prod-pipeline` (uses `Jenkinsfile.prod`)

### Step 2: Environment Configuration
```bash
# Configure Docker registry
export DOCKER_REGISTRY="your-registry.com"

# Configure Kubernetes contexts
kubectl config set-context dev-cluster --cluster=dev-cluster
kubectl config set-context prod-cluster --cluster=prod-cluster

# Configure Slack notifications
export SLACK_WEBHOOK_URL="your-slack-webhook-url"
```

### Step 3: Branch-based Triggers
Configure each Jenkins job to trigger on specific branches:

**Feature Pipeline**:
- Branch Spec: `feature/*`
- GitHub Webhook: Enabled

**Dev Pipeline**:
- Branch Spec: `develop`
- GitHub Webhook: Enabled

**Prod Pipeline**:
- Branch Spec: `main`
- GitHub Webhook: Enabled
- Manual Approval: Required

## 🔄 Workflow Integration

### Development Workflow
```mermaid
gitGraph
    commit id: "Feature Development"
    branch feature/user-auth
    checkout develop
    merge feature/user-auth
    commit id: "DEV Deployment"
    checkout main
    merge develop
    commit id: "PROD Deployment"
```

### Pipeline Triggers
1. **Feature branch push** → Feature pipeline (build + validate)
2. **Merge to develop** → Dev pipeline (build + deploy to DEV)
3. **PR develop → main** → Prod pipeline (manual approval + deploy to PROD)

## 🧪 Testing Configuration

### Local Testing
Use `docker-compose.test.yml` for pipeline validation:
```bash
# Run test environment
docker-compose -f jenkins/docker-compose.test.yml up --build

# Run integration tests
python tests/integration_tests.py

# Clean up
docker-compose -f jenkins/docker-compose.test.yml down
```

### Environment-specific Testing
- **DEV**: Tests against `dev-cluster` endpoints
- **PROD**: Full production test suite + load testing

## 🔐 Security Configuration

### Docker Registry Security
- Use private registry for production images
- Implement image scanning with Trivy
- Sign images for production deployment

### Kubernetes Security
- Use namespace isolation (dev/prod)
- Implement RBAC permissions
- Use secrets for sensitive data

## 📊 Monitoring & Notifications

### Slack Integration
Configure notifications for:
- ✅ Successful deployments
- ❌ Failed pipelines
- 🚨 Production alerts

### Health Monitoring
- Application health checks
- Kubernetes pod status
- Resource utilization metrics

## 🚀 Next Steps

1. Set up Jenkins server with above configuration
2. Configure GitHub webhooks for automatic triggers
3. Set up Kubernetes clusters (dev/prod)
4. Create Kubernetes manifests in `k8s/` directory
5. Test complete workflow end-to-end
