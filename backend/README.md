# WealthCalc India - Backend API

Express.js + TypeScript backend for WealthCalc India ETF Calculator.

## Features

- **Authentication**: JWT-based auth with credential and Google OAuth support
- **Password Reset**: Secure token-based password reset flow
- **Calculations**: CRUD operations for user portfolio calculations
- **MongoDB**: Connection pooling and health checks
- **CORS**: Configured for frontend origin

## Getting Started

### Install Dependencies

```bash
cd backend
npm install
```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=http://localhost:3000
```

### Development

```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Production

```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/signin` - Sign in with credentials
- `POST /api/auth/google` - Google OAuth (placeholder)

### Password Management
- `POST /api/forgot-password` - Request password reset
- `POST /api/reset-password` - Reset password with token

### Calculations (Protected)
- `GET /api/calculations` - Get user's calculations
- `POST /api/calculations` - Save new calculation
- `DELETE /api/calculations/:id` - Delete calculation

### Health
- `GET /api/health` - Database connection status

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts       # MongoDB connection
│   ├── middleware/
│   │   └── auth.ts           # JWT authentication
│   ├── routes/
│   │   ├── auth.ts           # Auth endpoints
│   │   ├── password.ts       # Password reset
│   │   ├── calculations.ts   # Calculations CRUD
│   │   └── health.ts         # Health check
│   ├── types/
│   │   └── index.ts          # TypeScript interfaces
│   └── server.ts             # Express app entry
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## Authentication

All calculation endpoints require JWT token in Authorization header:

```
Authorization: Bearer <token>
```

Get token from `/api/auth/signin` response.
