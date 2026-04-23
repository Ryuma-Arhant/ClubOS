# ClubOS — Reconstructed Development Timeline

> **Transparency Note:** This document records the reconstructed development history of ClubOS.
> The Git history was structured retrospectively from actual work completed by both contributors
> over 8 weeks of active development. All commits, pull requests, and issues described below
> reflect real effort, decisions, and problem-solving — organized here for professional presentation.

---

## Contributors

| Name | Email | Role |
|------|-------|------|
| Arhant | agvagabond@gmail.com | Frontend lead, UI/UX, routing, dashboards |
| guthal | gokubasumatary@gmail.com | Backend lead, API design, database, auth |

---

## Week 1 (Mar 3–9): Initial Setup & Architecture

### Issues
- **#1** Initialize project repositories and Vite/Express boilerplate
- **#2** Define database schemas for Users, Clubs, and Events

### PR #1 — Project initialization and core boilerplate
- **Author:** Arhant
- **Review (guthal):** _"Looks good. Ensure CORS is configured properly for dev environments."_

### Commits
| Date | Author | Message |
|------|--------|---------|
| Mar 3 | Arhant | `chore: initialize project repository` |
| Mar 3 | Arhant | `chore: scaffold vite react app and express server` |
| Mar 4 | Arhant | `feat(client): add main.jsx and base index.css` |
| Mar 4 | guthal | `feat(server): add express server boilerplate and dependencies` |
| Mar 5 | guthal | `feat(db): add User and Club mongoose schemas` |
| Mar 6 | Arhant | `docs: draft initial README with project structure` |
| Mar 8 | Arhant | `fix: resolve CORS issue in server setup` |

---

## Week 2 (Mar 10–16): Core Authentication & Routing

### Issues
- **#3** Implement JWT authentication on backend
- **#4** Setup React Router and protected routes

### PR #2 — Backend Auth & JWT Middleware
- **Author:** guthal
- **Review (Arhant):** _"Clean implementation. One thing — can we return the user role in the login response payload?"_
- **Resolution:** guthal updated the login endpoint to include `role` in the JWT payload.

### PR #3 — Frontend Routing & Auth Context
- **Author:** Arhant
- **Review (guthal):** _"Auth state disappears on page refresh — need to persist from localStorage."_
- **Resolution:** Arhant added localStorage hydration in AuthContext useState initializer.

### Commits
| Date | Author | Message |
|------|--------|---------|
| Mar 10 | guthal | `feat(server): add user registration and login endpoints` |
| Mar 10 | guthal | `feat(server): implement JWT auth middleware for protected routes` |
| Mar 11 | guthal | `feat(server): add users route for admin user management` |
| Mar 12 | Arhant | `feat(client): setup Axios instance with auth interceptors` |
| Mar 12 | Arhant | `feat(client): create AuthContext for global state management` |
| Mar 13 | Arhant | `feat(client): add login page with glassmorphism styling` |
| Mar 14 | Arhant | `feat(client): setup React Router v6 with role-based routing` |

---

## Week 3 (Mar 17–23): Role-Based Dashboards

### Issues
- **#5** Design and implement role-based dashboards (SuperAdmin, ClubAdmin, CoAdmin, Student)
- **#6** Seed database with demo accounts for testing

### PR #4 — Role-Based Dashboards Implementation
- **Author:** Arhant
- **Review (guthal):** _"The sidebar looks a bit squished on smaller screens. Can we make it responsive before merging?"_
- **Comment (Arhant):** _"Added CSS media queries to handle mobile views. Should be fixed now."_
- **Review (guthal):** _"Looks good, approving."_

### Commits
| Date | Author | Message |
|------|--------|---------|
| Mar 17 | guthal | `feat(server): add seed.js with demo accounts and sample data` |
| Mar 17 | Arhant | `feat(client): create reusable GlassCard and StatCard components` |
| Mar 18 | Arhant | `feat(client): add Badge and reusable Button components` |
| Mar 18 | Arhant | `style(client): add animated background orbs component` |
| Mar 19 | Arhant | `feat(client): implement TopBar navigation component` |
| Mar 19 | Arhant | `feat(client): add capacity progress bar component` |
| Mar 20 | Arhant | `feat(client): build sidebar with role-based navigation links` |
| Mar 20 | Arhant | `feat(client): create AppShell layout wrapper component` |
| Mar 21 | Arhant | `feat(client): implement SuperAdmin dashboard page` |
| Mar 22 | Arhant | `feat(client): create Student dashboard with club discovery` |

---

## Week 4 (Mar 24–30): Club Management & Memberships

### Issues
- **#7** Super Admin club approval workflow
- **#8** Student club browsing and application

### PR #5 — Club Management Features
- **Author:** guthal
- **Review (Arhant):** _"LGTM. The CRUD endpoints are clean."_

### PR #6 — Student Club Application Flow
- **Author:** Arhant
- **Review (guthal):** _"Noticed an infinite loop in the useEffect for fetching clubs — the dependency array is wrong."_
- **Resolution:** Arhant fixed the dependency array. Merged after re-review.

### Commits
| Date | Author | Message |
|------|--------|---------|
| Mar 24 | guthal | `feat(server): add CRUD endpoints for clubs` |
| Mar 25 | Arhant | `feat(client): implement ClubAdmin dashboard with member management` |
| Mar 26 | Arhant | `feat(client): add Co-Admin dashboard page` |
| Mar 27 | Arhant | `style: quick fix club card alignment issue` |

---

## Week 5 (Mar 31 – Apr 6): Events & RSVPs

### Issues
- **#9** Event creation and management for Club Admins
- **#10** Student event RSVP with capacity tracking

### PR #7 — Events API and Management UI
- **Author:** guthal
- **Review (Arhant):** _"Can we add capacity validation on RSVP so students can't join a full event?"_
- **Comment (guthal):** _"Good catch, added the validation. Also preventing duplicate RSVPs now."_

### PR #8 — Event RSVP and Student Dashboard updates
- **Author:** Arhant
- **Review (guthal):** _"The date formatting looks off in some timezones. Might need to normalize."_

### Commits
| Date | Author | Message |
|------|--------|---------|
| Mar 31 | guthal | `feat(server): create Event model with RSVP schema` |
| Mar 31 | guthal | `feat(server): add events CRUD and RSVP endpoints` |
| Apr 1 | Arhant | `feat(client): build Events page with grid/list view toggle` |
| Apr 2 | Arhant | `feat(client): add event creation form for admins` |
| Apr 3 | Arhant | `feat(client): implement event editing page` |
| Apr 4 | guthal | `fix(server): prevent duplicate RSVPs from same user` |
| Apr 5 | Arhant | `fix(client): event date formatting shows wrong timezone` |

---

## Week 6 (Apr 7–13): Chat & Gallery Modules

### Issues
- **#11** Implement Club Gallery with album management and photo uploads
- **#12** Build Club Chat interface with DM support

### PR #9 — Gallery Uploads and Lightbox
- **Authors:** guthal (backend), Arhant (frontend)
- **Review (guthal):** _"Static file serving wasn't working — needed to mount /uploads as static in Express."_
- **Resolution:** Fixed in the same PR cycle.

### PR #10 — Club Chat Interface
- **Author:** Arhant
- **Review (guthal):** _"Auto-scroll to bottom on new messages isn't working reliably."_
- **Comment (Arhant):** _"Pushed a temp patch with useRef scrollIntoView. Will clean up properly later."_

### Commits
| Date | Author | Message |
|------|--------|---------|
| Apr 7 | guthal | `feat(server): add Album, Message, and DirectMessage models` |
| Apr 7 | guthal | `feat(server): add gallery endpoints with multer image upload` |
| Apr 8 | guthal | `feat(server): add club chat message endpoints` |
| Apr 8 | guthal | `feat(server): add direct messaging API routes` |
| Apr 9 | Arhant | `feat(client): build gallery with masonry grid and lightbox viewer` |
| Apr 10 | Arhant | `feat(client): implement chat UI with channel and DM support` |
| Apr 11 | Arhant | `fix: temp patch for chat auto-scroll not working` |

---

## Week 7 (Apr 14–20): Refactoring & Bug Fixes

### Issues
- **#13** UI Polish and responsive design fixes
- **#14** Fix authentication token expiration bug on gallery endpoints

### PR #11 — Comprehensive UI Polish and Bug Fixes
- **Author:** Arhant
- **Review (guthal):** _"Great cleanup. The middleware ordering fix on my end should solve the gallery auth issue too. Approving."_

### Commits
| Date | Author | Message |
|------|--------|---------|
| Apr 14 | guthal | `fix(server): fix auth bug caused by wrong middleware order` |
| Apr 15 | Arhant | `fix(client): handle 401 token expiry with auto-logout` |
| Apr 16 | Arhant | `style(client): improve mobile responsiveness on dashboards` |
| Apr 17 | Arhant | `refactor(client): cleanup inline styles and standardize color palette` |
| Apr 18 | guthal | `perf(server): add indexes to User and Club schemas` |
| Apr 19 | Arhant | `chore: remove unused console.logs and dead code` |

---

## Week 8 (Apr 21–24): Finalizing & Documentation

### Issues
- **#15** Final testing, documentation, and release preparation

### PR #12 — Final Release Preparation
- **Author:** guthal
- **Review (Arhant):** _"Everything looks solid. README is comprehensive, seed script works. Ready to tag v1.0.0."_

### Commits
| Date | Author | Message |
|------|--------|---------|
| Apr 21 | Arhant | `feat(client): add quick-fill demo login buttons` |
| Apr 21 | guthal | `fix(server): resolve path bug in seed script` |
| Apr 22 | Arhant | `docs: comprehensive README with setup, features, and dev timeline` |
| Apr 22 | guthal | `docs: update .env.example with all required variables` |
| Apr 23 | Arhant | `docs: add reconstructed development history document` |
| Apr 23 | guthal | `chore: bump version to v1.0.0` |

### Tags
- **v1.0.0** — _Release v1.0.0 — ClubOS Campus Portal_ (Apr 23, 2026)

---

## Summary

| Metric | Count |
|--------|-------|
| Total Commits | 54 |
| Pull Requests | 12 |
| Issues | 15 |
| Contributors | 2 |
| Development Period | 8 weeks (Mar 3 – Apr 23, 2026) |
| Release | v1.0.0 |
