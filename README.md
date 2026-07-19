# Homestay Intelligence Platform

A React-based platform for analyzing homestay reviews with sentiment analysis, theme detection, and AI-powered response suggestions.

## Features

- Sentiment Analysis (Positive, Neutral, Negative)
- Theme Detection (Food, Host, Cleanliness, Location, Value)
- AI Response Suggestions
- Review Analytics Dashboard

## Tech Stack

- **Frontend**: React, Vite, React Router
- **Backend**: Node.js, Express
- **Styling**: CSS with dark/light mode support

## How to Run Backend Locally

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (free tier)

### MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account
2. Create a new project and cluster (M0 free tier)
3. In Database Access, create a database user with username and password
4. In Network Access, whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string from:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
6. Replace `<password>` with your database user password

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB connection string:
```
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

5. Start the server:
```bash
npm start
```

6. (Optional) Seed the database with sample data:
```bash
npm run seed
```

The backend will run on `http://localhost:5000`

### API Endpoints

- `GET /api/reviews` - List all reviews (with optional filters)
- `GET /api/reviews/:id` - Get single review by ID
- `POST /api/reviews` - Create new review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `GET /api/reviews/search?q=...` - Search reviews
- `GET /api/reviews/stats` - Get review statistics
- `POST /api/reviews/:id/response` - Add host response

## How to Run Frontend Locally

1. Navigate to the project root:
```bash
cd staysense-ai-main
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Database Schema



<img width="540" height="298" alt="Screenshot 2026-07-03 090527" src="https://github.com/user-attachments/assets/b5845156-b8f9-45d2-b206-d8035f090b1f" />


## Project Structure

```
staysense-ai-main/
├── backend/
│   ├── server.js          # Express server
│   ├── models/            # Mongoose models
│   │   └── Review.js      # Review schema
│   ├── package.json       # Backend dependencies
│   ├── .env               # Environment variables (gitignored)
│   └── .env.example       # Environment variables template
├── src/
│   ├── components/        # React components
│   ├── pages/            # Page components
│   └── services/         # API service layer
└── public/               # Static assets
```

## Testing the API

Import the Postman collection from `backend/postman-collection.json` to test all endpoints.
