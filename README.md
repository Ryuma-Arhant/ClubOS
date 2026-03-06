# ClubOS — Campus Club Management Portal

A full-stack web application for managing university clubs, events, members, galleries, and messaging.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT + bcrypt |
| File Uploads | Multer (local disk storage) |
| HTTP Client | Axios |
| Styling | Inline CSS (glass-morphism design system) |

---

## Prerequisites

- Node.js v18+
- npm v9+
- MongoDB (local instance or MongoDB Atlas URI)

---

## Project Structure

```
New folder/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── api/             # Axios instance + interceptors
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # AuthContext (global auth state)
│   │   └── pages/           # Route-level page components
│   ├── vite.config.js
│   └── package.json
│
└── server/                  # Express backend
    ├── middleware/          # JWT auth middleware
    ├── models/              # Mongoose schemas
    ├── routes/              # API route handlers
    ├── uploads/             # Uploaded gallery photos (auto-created)
    ├── index.js             # Server entry point
    ├── seed.js              # Database seeder
    └── package.json
```

---

## Installation

### 1. Clone / open the project

```bash
cd "New folder"
```

### 2. Install server dependencies

```bash
cd server
npm install
```

### 3. Install client dependencies

```bash
cd ../client
npm install
```

---

## Environment Setup

Create a `.env` file inside the `server/` directory:

```env
MONGO_URI=mongodb://localhost:27017/clubos
JWT_SECRET=your_secret_key_here
PORT=5000
```

> Replace `MONGO_URI` with your MongoDB Atlas connection string if using cloud MongoDB.

---

## Seed the Database

From the `server/` directory, run the seeder to populate demo accounts and sample data:

```bash
npm run seed
```

This creates the four demo user accounts used for login.

---

## Running the App

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```
Server runs on `http://localhost:5000`

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```
Frontend runs on `http://localhost:3000`

Open `http://localhost:3000` in your browser.

---

## Demo Accounts

All accounts use password: `password123`

| Email | Role | Access |
|-------|------|--------|
| `superadmin@uni.edu` | Super Admin | All clubs, all users, all events |
| `clubadmin@uni.edu` | Club Admin | Own club management, events, chat, gallery |
| `coadmin@uni.edu` | Co-Admin | Events, members, chat, gallery (no settings) |
| `student@uni.edu` | Student | Browse clubs, RSVP events, chat, gallery |

> Quick-fill buttons for each role are available on the login screen.

---

## Features

### Authentication
- JWT-based login with persistent session (localStorage)
- Role-based routing — each role lands on its own dashboard
- Auto logout on token expiry (401 response)

### Super Admin Dashboard
- View and manage all clubs (approve, reject, archive, delete)
- View and delete all users
- Create and manage events across all clubs
- Pending club approval workflow

### Club Admin / Co-Admin Dashboard
- View club statistics (members, events, applications)
- Review and approve/reject member applications
- Create and manage club events
- Access club chat and gallery

### Student Dashboard
- View enrolled clubs and upcoming events
- Discover and apply to new clubs
- RSVP to published events

### Events
- Create events (draft or published)
- Edit existing events
- Filter by status, category, or search
- Grid and list view
- RSVP toggle with capacity tracking

### Chat
- Club general channel (#general)
- Direct messaging — click any member to open a private chat
- Messages persist in MongoDB
- DM channel identified by sorted pair of user names

### Gallery
- Create albums with Public or Members Only visibility
- Upload multiple photos per album (images only, max 10 MB each)
- Masonry photo grid layout
- Lightbox viewer with keyboard navigation (← → Esc)
- Download uploaded photos directly
- Cover photo auto-populated from first album photo

---

## API Base URL

All API routes are prefixed with `/api`:

```
http://localhost:5000/api/...
```

Static uploaded files are served at:

```
http://localhost:5000/uploads/...
```

---

## Available Scripts

### Server (`server/`)

| Script | Command | Description |
|--------|---------|-------------|
| Start (prod) | `npm start` | Run with node |
| Start (dev) | `npm run dev` | Run with nodemon (auto-restart) |
| Seed DB | `npm run seed` | Populate demo data |

### Client (`client/`)

| Script | Command | Description |
|--------|---------|-------------|
| Dev server | `npm run dev` | Vite dev server on port 3000 |
| Build | `npm run build` | Production build |
| Preview | `npm run preview` | Preview production build |

---

## Notes

- The app hardcodes **Computer Science Club** as the primary club for chat, gallery, and dashboards. All users see this club's data.
- The chat member list in the sidebar is currently hardcoded. Real user presence would require WebSockets.
- Uploaded photos are stored in `server/uploads/` on disk. This directory is auto-created on first upload.
- No email verification or password reset flow is implemented.

---

## Development Timeline

> **Note:** The Git history of this project is a **reconstructed development history**. While it represents the actual authentic work, problem-solving, and collaborative workflow undertaken by the contributors over the past 8 weeks, it has been structured retrospectively to demonstrate a clean, professional Git history.

**Project Contributors:**
- Arhant (@agvagabond)
- Guthal (@gokubasumatary)

**Key Milestones:**
- **Weeks 1-2:** Project architecture, Vite/Express boilerplate, and core JWT Authentication.
- **Weeks 3-4:** Role-based routing, Super Admin/Club Admin dashboards, and Club Management APIs.
- **Week 5:** Event creation, capacity tracking, and Student RSVP flows.
- **Week 6:** Multer-based Image Gallery, Lightbox UI, and Chat Interface implementation.
- **Weeks 7-8:** UI glass-morphism polishing, bug fixes (middleware ordering, token expiry), and documentation.

*(For a comprehensive list of commits, PRs, and Issues, please refer to the `development_history.md` artifact.)*
