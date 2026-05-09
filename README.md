# College Discovery Platform

A full-stack college discovery and comparison platform built to help students explore colleges, compare institutions, and make informed academic decisions.

---

# Features

## College Listing & Search
- Browse colleges with responsive listing cards
- Search colleges by name
- Filter colleges by location and fees
- Pagination support for scalable browsing

## College Detail Pages
- Dynamic college detail routes
- Overview, placements, fees, ratings, and courses
- Responsive and user-friendly layouts

## Compare Colleges
- Compare up to 3 colleges side-by-side
- Compare:
  - Fees
  - Ratings
  - Placement Percentage
  - Average Package
  - Courses
  - Location

## Authentication & Saved Colleges
- JWT-based authentication
- User registration and login
- Save and manage favorite colleges
- Protected user dashboard

## Real Dataset Integration
- Real-world college dataset integrated using CSV import pipeline
- PostgreSQL persistence with Prisma ORM
- Data normalization and validation support

---

# Tech Stack

## Frontend
- Next.js
- TypeScript
- Tailwind CSS

## Backend
- Node.js
- Express.js
- Prisma ORM

## Database
- PostgreSQL (NeonDB)

## Authentication
- JWT
- bcrypt

---

# Project Structure

```bash
frontend/
backend/
```

---

# Environment Variables

## Backend (`backend/.env`)

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_secret_key
PORT=5000
```

## Frontend (`frontend/.env.local`)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/pxchavhan/college-discovery-platform.git
cd college-discovery-platform
```

---

# Backend Setup

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

---

# Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

# Database

The project uses PostgreSQL with Prisma ORM.

Prisma migration and seed workflows are included for schema setup and data import.

---

# API Features

- College listing APIs
- Search and filter APIs
- Compare APIs
- Authentication APIs
- Saved colleges APIs

---

# Deployment

- Frontend: Vercel
- Backend: Render
- Database: Neon PostgreSQL

---

# Future Improvements

- Advanced recommendation system
- College ranking analytics
- Student reviews and discussion forums
- AI-powered college prediction tools
- Advanced search filters

---

# Author

Prachi Chavhan