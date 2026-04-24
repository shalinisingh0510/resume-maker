# ResumeAI - Production-Ready Resume Builder SaaS

A full-stack, freemium Resume Builder SaaS application built with the MERN stack (MongoDB, Express, React, Node.js) and integrated with the Groq AI API for resume analysis and enhancement.

## Features

*   **Modern Frontend**: React + Vite + Tailwind CSS v4 with highly dynamic, glassmorphism UI.
*   **Robust Backend**: Node.js + Express + MongoDB with JWT authentication and middleware enforcement.
*   **Live Resume Builder**: Interactive split-screen editor with real-time preview.
*   **Multiple Templates**: Clean, Professional, and Modern resume variants.
*   **AI Integration**: Resume enhancement (STAR method rewrites) and ATS Scoring using Groq API (`llama-3.3-70b-versatile`).
*   **Freemium Model Logic**: Free users limited to 2 resumes and 2 AI enhancements. Premium users get unlimited access.
*   **Export**: HTML-to-PDF generation configured on the client side.

## Project Structure
```
resume-maker/
├── backend/
│   ├── config/db.js       # MongoDB setup
│   ├── middleware/auth.js # JWT & limits logic
│   ├── models/            # User & Resume schemas
│   ├── routes/            # Auth, Resume, AI routes
│   ├── server.js          # Entry point
│   ├── .env.example
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/    # Navbar, ResumePreview
    │   ├── context/       # AuthContext
    │   ├── pages/         # Home, Auth, Dashboard, Builder, AI Tools, Pricing
    │   ├── services/api.js# Axios centralized API logic
    │   ├── App.jsx        # Routing
    │   └── index.css      # Design system & tokens
    ├── vite.config.js
    └── package.json
```

## Setup Instructions

### 1. Prerequisites
Ensure you have Node.js and MongoDB installed on your system.

### 2. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd resume-maker/backend
   ```
2. Copy the `.env.example` file to create a `.env` file, and fill in your variables:
   *   `PORT=5000`
   *   `MONGODB_URI=mongodb://localhost:27017/resume-maker`
   *   `JWT_SECRET=your_secret_key`
   *   `GROQ_API_KEY=your_groq_api_key`
3. Start the backend development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd resume-maker/frontend
   ```
2. Start the frontend development server:
   ```bash
   npm run dev
   ```
3. Open your browser to `http://localhost:5173`.

## Architecture Notes
The application is pre-configured to easily proxy API requests from the frontend to backend via `vite.config.js`. API calls are managed via centralized services interceptors.
