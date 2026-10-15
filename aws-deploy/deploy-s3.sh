#!/bin/bash
# ==============================================================================
# Albedrozes Autonomous Rover - AWS S3 + CloudFront Deployment Script
# ==============================================================================
set -e

BUCKET_NAME=${1:-"albedrozes-rover-frontend"}
REGION=${2:-"ap-south-1"} # Mumbai default for India, or us-east-1

echo "=== [1/3] Building Production Frontend Bundle ==="
export PATH="/home/vishwa/.nvm/versions/node/v24.21.0/bin:$PATH"
cd "$(dirname "$0")/.."
npm run build

echo "=== [2/3] Syncing Build to AWS S3 Bucket ($BUCKET_NAME) ==="
# Ensure bucket exists
aws s3 mb s3://$BUCKET_NAME --region $REGION 2>/dev/null || true

# Enable static website hosting
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

# Sync dist files with caching policies
aws s3 sync dist/ s3://$BUCKET_NAME/ --delete --acl public-read

echo "=== [3/3] Deployment Completed Successfully! ==="
echo "S3 Website Endpoint: http://$BUCKET_NAME.s3-website.$REGION.amazonaws.com"
echo "Tip: Connect this bucket to an AWS CloudFront Distribution for global HTTPS and custom domain."
