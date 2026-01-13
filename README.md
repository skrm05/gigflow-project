# 🚀 GigFlow - Mini Freelance Marketplace

GigFlow is a full-stack MERN application that connects Clients with Freelancers. It features **real-time bidding**, atomic hiring logic, and a seamless dual-role user system.

Built as an assignment for the **ServiceHive** Full Stack Development Internship.

## 🔗 Live Demo

- **Frontend (Vercel):**[(https://gigflow-project-pearl.vercel.app/)]
- **Backend (Render):** [(https://gigflow-api-zvn3.onrender.com)]

---

## Key Features

### 1. Dual-Role System

- Users can switch between **Client** (Posting Jobs) and **Freelancer** (Bidding) roles seamlessly within the same account.

### 2. Real-Time Bidding (Socket.io)

- Bids appear instantly on the Client's dashboard without refreshing the page.
- Status updates ("Hired" / "Rejected") are pushed to Freelancers in real-time.

### 3. Atomic Hiring Logic

- When a Client clicks **"Hire"**:
  - The selected Freelancer is marked as **Accepted**.
  - All other bids for that specific Gig are automatically **Rejected**.
  - The Gig status updates to **Closed**.

### 4. 🔒 Secure Authentication

- JWT-based Authentication using **Authorization Headers** (Bearer Token).
- Passwords hashed using `bcryptjs`.
- Protected routes for Dashboard and Gig management.

---

## 🛠️ Tech Stack

- **Frontend:** React.js (Vite), Tailwind CSS, React Router DOM
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose)
- **Real-Time:** Socket.io
- **Deployment:** Vercel (Frontend) + Render (Backend)

---

## ⚙️ Local Setup Instructions

Follow these steps to run the project locally on your machine.

### 1. Clone the Repository

```bash
git clone [https://github.com/skrm05/gigflow-project.git](https://github.com/skrm05/gigflow-project.git)
cd gigflow-project


2. Backend Setup
cd api
npm install
npm run dev


3. Frontend Setup
cd frontend
npm install
npm run dev

```
