# ArcanaVerse Frontend

A React-based frontend application for the ArcanaVerse project built with Vite, offering an interactive UI for fortune telling and tarot card readings.

## 🚀 Features

- Firebase Authentication (Google Sign-in and Email/Password)
- Interactive card selection and fortune telling
- User profiles and preferences storage
- Daily fortune content delivery
- Responsive design with Gestalt components

## 🛠️ Tech Stack

- React 19
- Vite 6
- Firebase Authentication
- React Router 7
- React Query (TanStack Query)
- Gestalt UI components
- Tailwind CSS
- SWC for Fast Refresh

## 🏗️ Getting Started

### Prerequisites

- Node.js 18+ (recommended: latest LTS version)
- npm 8+ or yarn 1.22+

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to frontend directory
cd group-project-42/frontend

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the root directory with your Firebase configuration:

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
```

### Development

```bash
# Start the development server
npm run dev
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🐳 Docker Deployment

The project includes Docker configuration for containerized deployment.

### Using the build script

A convenient build script is provided to handle both local development and production deployment:

```bash
# Make the script executable
chmod +x build.sh

# For local development (single platform, loaded into Docker)
./build.sh

# For production deployment with a specific version (multi-platform, pushed to registry)
./build.sh 1.0.2 --push
```

### Manual Docker commands

```bash
# Build the Docker image
docker build -t arcanaverse-frontend .

# Run the container locally
docker run -p 8080:80 \
  -e VITE_FIREBASE_API_KEY=your_api_key \
  -e VITE_FIREBASE_AUTH_DOMAIN=your_domain.firebaseapp.com \
  -e VITE_FIREBASE_PROJECT_ID=your_project_id \
  -e VITE_FIREBASE_STORAGE_BUCKET=your_bucket.appspot.com \
  -e VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id \
  -e VITE_FIREBASE_APP_ID=your_app_id \
  arcanaverse-frontend
```

### Multi-platform builds

For multi-platform deployment:

```bash
docker buildx build --platform linux/amd64,linux/arm64 \
  --build-arg VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY \
  --build-arg VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN \
  --build-arg VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID \
  --build-arg VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET \
  --build-arg VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID \
  --build-arg VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID \
  -t henrycyc/frontend:1.0.1 \
  --push .
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run vitest suite
npm run vitest
```

## 📝 Code Quality

```bash
# Format code with Prettier
npm run prettier

# Run ESLint
npm run lint

# Format and lint
npm run format
```

## 🧠 Project Structure

- `/src`: Application source code
  - `/assets`: Static assets
  - `/components`: Reusable UI components
  - `/context`: React context providers
  - `/hooks`: Custom React hooks
  - `/pages`: Application pages/routes
  - `/utils`: Utility functions including Firebase setup

## 📜 License

[License information]
