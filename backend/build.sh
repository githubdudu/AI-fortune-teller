#!/bin/bash

# Exit on error
set -e

# Configuration
IMAGE_NAME="fortune-backend"
VERSION="1.0.0"  # Default version
REGISTRY="ghcr.io/uoa-cs732-s1-2025/group-project-42"

# Parse command line arguments
PUSH=false
BUILD=true

for arg in "$@"; do
  case $arg in
    --push)
      PUSH=true
      ;;
    --no-build)
      BUILD=false
      ;;
    *.*.*|*.*)
      # Match version numbers like 1.0.0 or 1.0
      VERSION="$arg"
      ;;
    *)
      echo "Unknown argument: $arg"
      echo "Usage: $0 [VERSION] [--push] [--no-build]"
      echo "Example: $0 1.0.1 --push"
      exit 1
      ;;
  esac
done

# Full image name with tag
FULL_IMAGE_NAME="$REGISTRY/$IMAGE_NAME:$VERSION"

# Build the Docker image
if [ "$BUILD" = true ]; then
  echo "Building Docker image: $FULL_IMAGE_NAME"
  docker build -t "$FULL_IMAGE_NAME" -f Dockerfile .
  echo "Build completed successfully"
else
  echo "Skipping build as requested"
fi

# Push the image if requested
if [ "$PUSH" = true ]; then
  echo "Pushing Docker image to registry: $FULL_IMAGE_NAME"
  docker push "$FULL_IMAGE_NAME"
  echo "Push completed successfully"
fi

echo "Script completed"