#!/bin/bash

# Kind Cluster Setup Script
# Creates DEV and PROD Kubernetes clusters using Kind

set -e

echo "🚀 Setting up Kind clusters for DevOps pipeline..."

# Function to create cluster
create_cluster() {
    local cluster_name=$1
    local config_file=$2
    local description=$3
    
    echo "📦 Creating $description cluster..."
    
    # Check if cluster already exists
    if kind get clusters | grep -q "$cluster_name"; then
        echo "⚠️  Cluster $cluster_name already exists. Deleting first..."
        kind delete cluster --name "$cluster_name"
    fi
    
    # Create cluster
    kind create cluster --config "$config_file" --name "$cluster_name"
    
    echo "✅ $description cluster created successfully!"
}

# Create DEV cluster
create_cluster "dev-cluster" "k8s/kind-config-dev.yaml" "DEV"

# Create PROD cluster  
create_cluster "prod-cluster" "k8s/kind-config-prod.yaml" "PROD"

# Show cluster status
echo ""
echo "📊 Cluster Status:"
kind get clusters

# Configure kubectl contexts
echo ""
echo "🔧 Configuring kubectl contexts..."

# Set up contexts
kubectl config set-context dev-cluster --cluster=kind-dev-cluster --user=kind-dev-cluster
kubectl config set-context prod-cluster --cluster=kind-prod-cluster --user=kind-prod-cluster

echo "✅ Clusters setup complete!"
echo ""
echo "🎯 Usage:"
echo "  DEV:  kubectl config use-context dev-cluster"
echo "  PROD: kubectl config use-context prod-cluster"
echo "  Status: kubectl cluster-info --context=dev-cluster"
