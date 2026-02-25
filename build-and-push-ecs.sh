#!/bin/bash
set -e

REGION="us-east-1"
ACCOUNT_ID="ACCOUNT_ID"
ECR_REGISTRY="${ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"

# Authenticate to ECR
aws ecr get-login-password --region $REGION | \
    docker login --username AWS --password-stdin $ECR_REGISTRY

# Function to create ECR repo if not exists
create_ecr_repo_if_not_exists() {
    REPO_NAME=$1
    if ! aws ecr describe-repositories --repository-names $REPO_NAME --region $REGION; then
        aws ecr create-repository \
            --repository-name $REPO_NAME \
            --region $REGION \
            --image-scanning-configuration scanOnPush=true \
            --encryption-configuration encryptionType=AES256
    fi
}

# Create repos
create_ecr_repo_if_not_exists "app-backend"
create_ecr_repo_if_not_exists "app-frontend-prod"

# Build and push backend
cd base-app/src/backend
docker build -t app-backend:latest .
docker tag app-backend:latest ${ECR_REGISTRY}/app-backend:latest
docker push ${ECR_REGISTRY}/app-backend:latest
cd ../../..

# Build and push frontend
cd base-app
docker build -f src/frontend/Dockerfile.ecs -t app-frontend-prod:latest .
docker tag app-frontend-prod:latest ${ECR_REGISTRY}/app-frontend-prod:latest
docker push ${ECR_REGISTRY}/app-frontend-prod:latest
cd ..

echo "✅ All images pushed successfully!"
