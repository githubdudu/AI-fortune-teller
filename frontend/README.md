# ArcanaVerse Frontend

A React-based frontend application for the ArcanaVerse project built with Vite, offering an interactive UI for fortune telling and tarot card readings.

**Visit our live site: [ArcanaVerse](https://arcanaverse.xyz/home)**

## 🚀 Features

- Firebase Authentication (Google Sign-in and Email/Password)
- Interactive card selection and fortune telling
- User profiles and preferences storage
- Daily fortune content delivery
- Responsive design with Gestalt components
- Themed tarot card readings

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
VITE_API_BASE_URL=http://localhost:5000
```

The `VITE_API_BASE_URL` is essential for connecting to the backend API. In development, it should point to your local API server, while in production, it would point to your deployed API endpoint.

### Development

```bash
# Start the development server
npm run dev
```

The development server will be available at `http://localhost:5173`

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
  -e VITE_API_BASE_URL=http://api.arcanaverse.com \
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
  --build-arg VITE_API_BASE_URL=$VITE_API_BASE_URL \
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

The frontend follows a well-organized structure that promotes component reusability and clean separation of concerns:

```
frontend/
├── public/                   # Static assets served directly
│   ├── defaultBackCard.png   # Default card back image
│   ├── defaultFrontCard.png  # Default card front image
│   └── assets/               # Additional public assets
├── src/                      # Source code
│   ├── assets/               # Images and other resources
│   │   └── arcanaVerse.png   # Logo image
│   ├── components/           # Reusable UI components
│   │   ├── Card/             # Card components
│   │   ├── CardDeck/         # Card deck component
│   │   ├── FortuneDisplay/   # Fortune display components
│   │   ├── ThemeSelector/    # Theme selector components
│   │   └── UserProfile/      # User profile components
│   ├── constants/            # Application-wide constants
│   ├── context/              # React Context providers
│   │   ├── AppContext/       # Main application context
│   │   └── AuthContext/      # Authentication context
│   ├── hooks/                # Custom React hooks
│   │   ├── useApi.js         # API interaction hook
│   │   ├── useFortune.js     # Fortune data hook
│   │   └── useTheme.js       # Theme management hook
│   ├── pages/                # Page components
│   │   ├── DailyFortunePage/ # Daily fortune page
│   │   ├── HomePage/         # Home page
│   │   ├── ProfilePage/      # User profile page
│   │   ├── ReadingPage/      # Card reading page
│   │   └── ThemesPage/       # Themes browse page
│   ├── utils/                # Helper functions
│   │   ├── api.js            # API utilities
│   │   └── firebase.js       # Firebase configuration
│   ├── App.jsx               # Root component with routing
│   ├── index.css             # Global styles with Tailwind
│   └── main.jsx              # Application entry point
├── Dockerfile                # Docker configuration
├── nginx.conf                # Nginx configuration for Docker
├── README.md                 # Frontend documentation
└── vite.config.js            # Vite configuration
```

## 🔄 API Integration

The frontend communicates with the backend API at the URL specified in the `VITE_API_BASE_URL` environment variable. Key API endpoints used include:

### Card Endpoints

```javascript
// Get all cards
const cards = await api.get('/api/v1/cards');

// Get a random card
const randomCard = await api.get('/api/v1/cards/random');
```

### Fortune Endpoints

```javascript
// Get daily fortune
const dailyFortune = await api.get('/api/v1/fortunes/daily');

// Get fortune by theme
const themeFortune = await api.get(`/api/v1/fortunes/theme/${themeId}`);
```

### User Endpoints

```javascript
// Get user profile
const userProfile = await api.get(`/api/v1/users/${userId}`);

// Update user preferences
await api.put(`/api/v1/users/${userId}`, {
  preferences: { favoriteThemeId: selectedThemeId }
});
```

## 🔗 Related Documentation

- [Main Project Documentation](../README.md) - Overall project information
- [Backend Documentation](../backend/README.md) - Backend service details
- [API Documentation](../backend/Api/README.md) - API endpoints and usage
- [Kubernetes Deployment](../kubernetes/README.md) - Deployment configuration
