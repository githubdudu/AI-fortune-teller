# ArcanaVerse Kubernetes Deployment

This directory contains Kubernetes configuration files for deploying the ArcanaVerse application to a Kubernetes cluster. The deployment consists of both frontend and backend services with an ingress controller for external access.

## 📦 Files Overview

- `backend-deployment.yaml`: Deployment and service configuration for the backend API
- `frontend-deployment.yaml`: Deployment and service configuration for the frontend React application
- `ingress.yaml`: Ingress controller configuration for routing external traffic
- `secrets-template.yaml`: Template for creating the required Kubernetes secrets

## 🚀 Deployment Instructions

### Prerequisites

- [kubectl](https://kubernetes.io/docs/tasks/tools/) command-line tool
- Access to a Kubernetes cluster (local or cloud-based)
- Docker images for frontend and backend (either built locally or available in a registry)

### Step 1: Create the Secrets

First, create your secrets from the template:

1. Copy the `secrets-template.yaml` file:
```bash
cp secrets-template.yaml secrets.yaml
```

2. Edit `secrets.yaml` to include your actual secrets:
```yaml
stringData:
  db-connection-string: "Server=your-db-server;Database=ArcanaVerse;User Id=username;Password=password;"
  openai-api-key: "your-openai-api-key-here"
```

3. Apply the secrets to your cluster:
```bash
kubectl apply -f secrets.yaml
```

**Note**: `secrets.yaml` is included in `.gitignore` to prevent committing sensitive information to the repository.

### Step 2: Deploy Backend and Frontend

Apply the deployment configurations:

```bash
# Deploy backend
kubectl apply -f backend-deployment.yaml

# Deploy frontend
kubectl apply -f frontend-deployment.yaml
```

### Step 3: Configure Ingress

Apply the ingress configuration:

```bash
kubectl apply -f ingress.yaml
```

## 🔍 Deployment Details

### Backend Deployment

The backend is deployed with the following specifications:
- 2 replicas for high availability
- Docker image: `henrycyc/fortune-backend:latest`
- Environment Variables:
  - `ASPNETCORE_ENVIRONMENT`: Production
  - `ASPNETCORE_URLS`: http://+:8080
  - OpenAI API key from Kubernetes secrets

The backend service is exposed internally as `backend-service` on port 80.

### Frontend Deployment

The frontend is deployed with similar specifications:
- Docker image: `henrycyc/fortune-frontend:latest`
- Exposed internally as `frontend-service`

### Ingress Configuration

The ingress controller is configured to route traffic:
- Backend API at: `/api/*`
- Frontend at: `/*`

For production deployments, configure your domain name and TLS certificates in the ingress configuration.

## 🔄 Updating Deployments

To update the deployments with new versions:

```bash
# Update the image tag in the deployment file, then apply the changes
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml

# Or, directly set a new image version
kubectl set image deployment/backend-deployment backend=henrycyc/fortune-backend:1.0.1
kubectl set image deployment/frontend-deployment frontend=henrycyc/fortune-frontend:1.0.1
```

## 📊 Monitoring

Check the status of your deployments:

```bash
# Check all resources in the current namespace
kubectl get all

# Check pods status
kubectl get pods

# Check services
kubectl get svc

# Check deployments
kubectl get deployments
```

View logs for a specific pod:

```bash
kubectl logs pod-name
```

## 💻 Local Development with Kubernetes

For local development using minikube:

```bash
# Start minikube
minikube start

# Enable the ingress addon
minikube addons enable ingress

# Apply the configurations
kubectl apply -f secrets.yaml
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml
kubectl apply -f ingress.yaml

# Get the minikube IP
minikube ip
```

## 🔗 Related Documentation

- [Main Project Documentation](../README.md)
- [Backend Documentation](../backend/README.md)
- [Frontend Documentation](../frontend/README.md)

Last updated: May 15, 2025