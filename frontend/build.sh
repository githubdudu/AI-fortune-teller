#!/bin/bash

# Build script for Docker multi-architecture builds with Firebase configuration
# Usage: ./build.sh [version] [--push]
# Example: ./build.sh 1.0.2 --push

# Exit on error
set -e

# Default values
VERSION=${1:-"1.0.1"}
OUTPUT_ARG=""

# Check if --push flag is provided
if [[ "$*" == *--push* ]]; then
  OUTPUT_ARG="--push"
  echo "Image will be pushed to Docker registry"
else
  # When not pushing, use --load to make image available locally
  # Note: --load only works with single platform builds, not multi-platform
  echo "Image will be built locally and loaded into Docker"
  # Remove multi-platform for local builds since --load doesn't support it
  PLATFORM_ARG="--platform linux/amd64"
  OUTPUT_ARG="--load"
fi

# Check if .env file exists and source it
if [ -f .env ]; then
  echo "Loading environment variables from .env file"
  export $(grep -v '^#' .env | xargs)
else
  echo "Warning: .env file not found. Make sure Firebase environment variables are set."
fi

# Check for required environment variables
REQUIRED_VARS=(
  "VITE_FIREBASE_API_KEY"
  "VITE_FIREBASE_AUTH_DOMAIN"
  "VITE_FIREBASE_PROJECT_ID"
  "VITE_FIREBASE_STORAGE_BUCKET"
  "VITE_FIREBASE_MESSAGING_SENDER_ID"
  "VITE_FIREBASE_APP_ID"
)

MISSING_VARS=0
for VAR in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!VAR}" ]; then
    echo "Error: Required environment variable $VAR is not set"
    MISSING_VARS=1
  fi
done

if [ $MISSING_VARS -eq 1 ]; then
  echo "Please set all required environment variables before building"
  echo "You can create a .env file with these variables or export them manually"
  exit 1
fi

echo "Building Docker image henrycyc/frontend:$VERSION"

# Set platform argument for multi-platform builds when pushing
if [[ "$OUTPUT_ARG" == "--push" ]]; then
  PLATFORM_ARG="--platform linux/amd64,linux/arm64"
fi

# Set default API base URL for k8s if not provided
if [ -z "$VITE_API_BASE_URL" ]; then
  echo "VITE_API_BASE_URL not set, defaulting to https://170.64.246.207.nip.io/api/v1"
  export VITE_API_BASE_URL="https://170.64.246.207.nip.io/api/v1"
fi

# Build the Docker image with all required build args
docker buildx build $PLATFORM_ARG \
  --build-arg VITE_FIREBASE_API_KEY="$VITE_FIREBASE_API_KEY" \
  --build-arg VITE_FIREBASE_AUTH_DOMAIN="$VITE_FIREBASE_AUTH_DOMAIN" \
  --build-arg VITE_FIREBASE_PROJECT_ID="$VITE_FIREBASE_PROJECT_ID" \
  --build-arg VITE_FIREBASE_STORAGE_BUCKET="$VITE_FIREBASE_STORAGE_BUCKET" \
  --build-arg VITE_FIREBASE_MESSAGING_SENDER_ID="$VITE_FIREBASE_MESSAGING_SENDER_ID" \
  --build-arg VITE_FIREBASE_APP_ID="$VITE_FIREBASE_APP_ID" \
  --build-arg VITE_API_BASE_URL="$VITE_API_BASE_URL" \
  -t henrycyc/frontend:$VERSION \
  -t henrycyc/frontend:latest \
  $OUTPUT_ARG .

echo "Build completed!"