# MERN Starter Pack

A starter template for building web applications using the MERN stack (MongoDB, Express, React, Node.js) with Firebase authentication.

## Features

- React frontend with Vite
- Node.js/Express backend
- MongoDB database integration
- Firebase authentication
- JWT token implementation
- Environment configuration

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- MongoDB Atlas account
- Firebase project

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd mern-starter-pack
```

2. Install dependencies
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Environment Configuration

#### Frontend (.env file in frontend directory)
Create a `.env` file in the frontend directory with the following variables:
```
# Firebase Configuration (Client-side)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

#### Backend (.env file in backend directory)
Create a `.env` file in the backend directory with the following variables:
```
# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=your_database_name

# JWT Configuration
# Generate a secure random string for JWT token signing
# You can generate one using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_generated_jwt_secret

# Environment
NODE_ENV=development
```

## Running the Application

### Development Mode

```bash
# Start frontend (from frontend directory)
npm run dev

# Start backend (from backend directory)
npm run dev
```

### Production Mode

```bash
# Build frontend (from frontend directory)
npm run build

# Start backend in production mode (from backend directory)
npm start
```

## Project Structure

```
mern-starter-pack/
├── frontend/           # React frontend with Vite
│   ├── public/         # Static assets
│   ├── src/            # Source files
│   └── .env            # Frontend environment variables
│
└── backend/            # Node.js/Express backend
    ├── config/         # Configuration files
    ├── controllers/    # Route controllers
    ├── models/         # MongoDB models
    ├── routes/         # API routes
    ├── utils/          # Utility functions
    └── .env            # Backend environment variables
```

## Security Notes

- Never commit your `.env` files to version control
- Keep your JWT secret secure
- Implement proper authentication and authorization

## License

[MIT](LICENSE)