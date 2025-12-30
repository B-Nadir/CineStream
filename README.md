# 🎬 CineStream

CineStream is a full-stack OTT discovery platform that allows users to browse movies and series, check ratings, see streaming availability, and manage a personal watchlist.

This project is built as a **DB-first system** with no live API calls at runtime.

---

## ✨ Features

- Browse Movies & Series
- Search from local database
- Filter by genre, rating, year
- Streaming availability (Netflix, Prime Video, Hotstar, etc.)
- User authentication (JWT)
- Personal watchlist
- Redis caching
- Cron-based ingestion
- Cinematic UI (React + CSS)

---

## 🧠 Architecture

- **Frontend**: React (Vite)
- **Backend**: Node.js + Express
- **Database**: MySQL
- **Caching**: Redis
- **Auth**: JWT
- **Ingestion**: RapidAPI (offline / cron-based)
- **Deployment**: Docker-ready (not deployed)

---

## 🐳 Run with Docker (Local)

```bash
docker compose build
docker compose up
