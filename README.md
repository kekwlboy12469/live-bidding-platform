# Live Bidding Platform 

A real-time live auction platform built with **React + Socket.IO + Node.js**, featuring optimistic UI updates, bid history, and auto-closing auctions.

##  Features
- Real-time bidding via WebSockets
- Optimistic UI with rollback
- Auto-close auctions with winner broadcast
- Bid history per item
- Wallet balance per user
- Server-time–synced countdown timers
- Dockerized backend + frontend

##  Tech Stack
- Frontend: React, Vite, Socket.IO Client
- Backend: Node.js, Express, Socket.IO
- Infrastructure: Docker, Vercel (Frontend), Render (Backend)

##  Live Demo
- Frontend: https://live-bidding-platform-beta.vercel.app
- Backend: https://live-bidding-platform-uq3u.onrender.com

##  Run Locally (Docker)
```bash
docker compose up --build
