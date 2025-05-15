#!/bin/bash

# Exit on error
set -e

# Configuration
IMAGE_NAME="backend"
VERSION="1.0.0"  # Default version
REGISTRY="henrycyc"  # DockerHub username

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

# Setup buildx builder for multi-platform builds if not already set up
if ! docker buildx inspect multi-platform-builder > /dev/null 2>&1; then
  echo "Creating new buildx builder for multi-platform builds..."
  docker buildx create --name multi-platform-builder --driver docker-container --use
fi

# Select the builder
docker buildx use multi-platform-builder

# Build the Docker image (and optionally push)
if [ "$BUILD" = true ]; then
  echo "Building multi-architecture Docker image: $FULL_IMAGE_NAME"
  
  BUILDX_ARGS="--platform linux/amd64,linux/arm64 -t $FULL_IMAGE_NAME -f Dockerfile ."
  
  if [ "$PUSH" = true ]; then
    # If pushing, we build and push in one step
    docker buildx build --push $BUILDX_ARGS
    echo "Build and push completed successfully"
  else
    # Just build locally
    docker buildx build --load $BUILDX_ARGS
    echo "Build completed successfully"
  fi
else
  echo "Skipping build as requested"
  
  # Push the image if requested without building
  if [ "$PUSH" = true ]; then
    echo "Pushing Docker image to registry: $FULL_IMAGE_NAME"
    docker push "$FULL_IMAGE_NAME"
    echo "Push completed successfully"
  fi
fi

echo "Script completed"