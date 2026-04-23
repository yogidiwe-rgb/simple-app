#!/bin/bash

# Kind Cluster Cleanup Script
# Removes all Kind clusters and configurations

set -e

echo "🧹 Cleaning up Kind clusters..."

# Stop and remove all containers
echo "📦 Stopping Docker containers..."
docker stop $(docker ps -q) 2>/dev/null || echo "No running containers"

# Remove all containers
echo "🗑️ Removing Docker containers..."
docker rm $(docker ps -aq) 2>/dev/null || echo "No containers to remove"

# Delete all Kind clusters
echo "💥 Deleting Kind clusters..."
for cluster in $(kind get clusters); do
    echo "Deleting cluster: $cluster"
    kind delete cluster --name "$cluster"
done

# Clean up Docker images (optional)
read -p "🧼 Clean up Docker images? (y/N): " -n response
if [[ $response =~ ^[Yy]$ ]]; then
    echo "🗑️ Removing Docker images..."
    docker image prune -f
fi

echo "✅ Cleanup complete!"
echo ""
echo "🎯 Ready for fresh cluster setup!"
