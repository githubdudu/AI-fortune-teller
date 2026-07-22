#!/bin/bash

# Build script for Docker multi-architecture builds
# Usage: ./build.sh [version] [--push]
# Example: ./build.sh 1.0.2 --push

# Exit on error
set -e

# Default values
VERSION=${1:-"1.0.1"}
OUTPUT_ARG=""
REGISTRY="docker.io/henrycyc"
IMAGE_NAME="fortune-frontend"

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
fi

FULL_IMAGE_NAME="$REGISTRY/$IMAGE_NAME:$VERSION"
echo "Building Docker image $FULL_IMAGE_NAME"

# Set platform argument for multi-platform builds when pushing
if [[ "$OUTPUT_ARG" == "--push" ]]; then
  PLATFORM_ARG="--platform linux/amd64,linux/arm64"
fi

# Set default API base URL for k8s if not provided
if [ -z "$VITE_API_BASE_URL" ]; then
  echo "VITE_API_BASE_URL not set, defaulting to https://arcanaverse.xyz/api/v1"
  export VITE_API_BASE_URL="https://arcanaverse.xyz/api/v1"
fi

# Build the Docker image with all required build args
docker buildx build $PLATFORM_ARG \
  --build-arg VITE_API_BASE_URL="$VITE_API_BASE_URL" \
  -t $FULL_IMAGE_NAME \
  -t $REGISTRY/$IMAGE_NAME:latest \
  $OUTPUT_ARG .

echo "Build completed!"