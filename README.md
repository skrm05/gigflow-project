# GigFlow - Freelance Marketplace Platform

A MERN stack platform where Clients can post jobs and Freelancers can bid on them. Features real-time notifications and secure authentication.

## 🚀 Features

- [cite_start]**User Roles:** Fluid roles (User can act as both Client & Freelancer)[cite: 16].
- [cite_start]**Gig Management:** Post jobs, search jobs by title, and view details[cite: 17, 18, 19, 20].
- **Hiring Logic:** Client selects one bid to "Hire". [cite_start]This automatically assigns the gig and marks all other bids as rejected.
- [cite_start]**Real-Time Updates:** Socket.io integration for instant "You are Hired!" notifications[cite: 40].
- [cite_start]**Security:** HttpOnly Cookies for secure JWT storage[cite: 12].

## 🛠️ Tech Stack

- [cite_start]**Frontend:** React (Vite), Tailwind CSS [cite: 8]
- [cite_start]**Backend:** Node.js, Express.js [cite: 9]
- [cite_start]**Database:** MongoDB (Mongoose) [cite: 10]
- [cite_start]**Real-Time:** Socket.io [cite: 40]

## ⚙️ Setup Instructions

### 1. Backend Setup

cd backend
npm install

# Create .env file using .env.example as reference

npm run dev

### 2. Frontend Setup

cd frontend
npm install
npm run dev
