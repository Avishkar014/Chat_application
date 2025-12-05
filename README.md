Chat Application

A real-time team chat application built with Node.js, Express, Socket.IO, MongoDB, and React. The app supports user authentication, channels, messaging, and live updates using WebSockets. This repository contains two separate folders: backend/ for the API + socket server and frontend/ for the React client application.

Features

Real-time chat using Socket.IO

User authentication (login/signup)

Channel-based messaging

MongoDB persistence via Mongoose

React frontend with clean UI

Production deployment on Render

SPA routing with automatic fallbacks

Secure CORS setup for frontend–backend communication

Tech Stack
Backend

Node.js

Express

MongoDB + Mongoose

Socket.IO

JSON Web Tokens (JWT)

Frontend

React

React Router

Fetch API / Context for state management

Infrastructure

MongoDB Atlas

Render Web Service (backend)

Render Static Site (frontend)

Repository Structure
Chat_application/
  backend/
    server.js
    package.json
    src/
      routes/
      socket/
      models/
  frontend/
    src/
    public/
      _redirects
    package.json

Setup and Run Instructions
1. Clone the repository
git clone https://github.com/<your-username>/Chat_application.git
cd Chat_application

Backend Setup
Install dependencies
cd backend
npm install

Create an .env file in backend/

Example:

MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/chat-app
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
PORT=4000
NODE_ENV=development

Start (development)
npm run dev

Start (production-like)
npm start


Backend runs at:

http://localhost:4000


Health check:

GET /health → { "ok": true }

Frontend Setup
Install dependencies
cd frontend
npm install

Create .env files
For local development:
REACT_APP_BACKEND_URL=http://localhost:4000
REACT_APP_SOCKET_URL=http://localhost:4000

For production builds:

Create frontend/.env.production:

REACT_APP_BACKEND_URL=https://<your-backend-url>.onrender.com
REACT_APP_SOCKET_URL=https://<your-backend-url>.onrender.com

Run locally
npm start

Build for production
npm run build

Deploying to Render
Backend (Web Service)

Settings:

Root Directory: backend
Build Command: npm install
Start Command: npm start
Health Check Path: /health


Environment Variables (Render → Environment):

MONGODB_URI=<your-atlas-uri>
JWT_SECRET=<secret>
FRONTEND_URL=https://<your-frontend-domain>
NODE_ENV=production


Render automatically sets PORT; do not define it manually.

Frontend (Static Site)

Settings:

Root Directory: frontend
Build Command: npm install && npm run build
Publish Directory: build


Add SPA redirects in frontend/public/_redirects:

/* /index.html 200


Deploy after pushing latest commits.

API & Sockets Overview
REST Endpoints (examples)

POST /api/auth/login

POST /api/auth/signup

GET /api/channels

GET /api/messages/:channelId

POST /api/messages

Socket.IO events (examples)

connection

message:send

message:receive

channel:join

Client connection example:

const socket = io(process.env.REACT_APP_SOCKET_URL, {
  transports: ["websocket"],
  withCredentials: true,
  auth: { token: localStorage.getItem("token") }
});

Assumptions & Limitations

MongoDB Atlas is used (Render does not host MongoDB natively).

Frontend is an SPA; direct refresh on routes requires _redirects or HashRouter.

Authentication is simple JWT-based and does not include advanced security hardening.

Project is not optimized for massive scale (suitable for small/medium usage).

Optional Features Implemented

Modal-based login UI

Real-time message updates per channel

Sticky navigation bar

Basic profile info display

Environment-based URL configuration

SPA redirect setup for production routing

WebSocket auth support

How to Test

Backend:

curl http://localhost:4000/health


Frontend:

Open http://localhost:3000

Open two browser windows

Login as two users

Send messages and confirm real-time updates

License

MIT — use freely for learning or building upon.
