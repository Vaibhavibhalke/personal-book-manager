# Personal Book Manager — Architecture & Code Guide

This document explains the full project structure, how each file works, and how data flows through the application.

---

## 1. High-Level Architecture

```
Browser
   │
   ├── Pages (Next.js App Router)
   │     login / signup / dashboard
   │
   ├── API Routes (/api/auth, /api/books)
   │
   └── Middleware (JWT cookie check)
           │
           ▼
      MongoDB (Atlas or local)
```

**Data flow summary:**

1. User opens `/` → redirected to `/login` or `/dashboard`
2. Sign up / log in → API creates JWT → stored in httpOnly cookie
3. Dashboard loads books from MongoDB on the server
4. Add / edit / delete books via API calls from the browser
5. Middleware blocks unauthenticated users from `/dashboard`

---

## 2. Folder Structure

```
book-manager/
├── .env.example          # Template for environment variables
├── .env.local            # Your secrets (not committed to git)
├── package.json          # Dependencies and scripts
├── README.md             # Setup and deployment guide
├── ARCHITECTURE.md       # This file
│
└── src/
    ├── middleware.ts     # Route protection
    │
    ├── app/              # Next.js App Router
    │   ├── layout.tsx    # Root layout (fonts, metadata)
    │   ├── globals.css   # Global styles
    │   ├── page.tsx      # Home (redirects)
    │   ├── login/page.tsx
    │   ├── signup/page.tsx
    │   ├── dashboard/page.tsx
    │   └── api/
    │       ├── auth/
    │       │   ├── signup/route.ts
    │       │   ├── login/route.ts
    │       │   ├── logout/route.ts
    │       │   └── me/route.ts
    │       └── books/
    │           ├── route.ts          # GET all, POST new
    │           └── [id]/route.ts     # PUT update, DELETE
    │
    ├── components/
    │   ├── AuthForm.tsx
    │   ├── Navbar.tsx
    │   ├── Dashboard.tsx
    │   ├── StatsCards.tsx
    │   ├── BookForm.tsx
    │   ├── BookCard.tsx
    │   └── FilterBar.tsx
    │
    ├── lib/
    │   ├── mongodb.ts    # Database connection
    │   └── auth.ts       # JWT helpers
    │
    ├── models/
    │   ├── User.ts
    │   └── Book.ts
    │
    └── types/
        └── index.ts
```

---

## 3. Root Files

| File | Purpose |
|------|---------|
| `package.json` | Dependencies: Next.js, React, Mongoose, bcrypt, jose, Tailwind |
| `.env.example` | Required env vars: `MONGODB_URI`, `JWT_SECRET` |
| `.env.local` | Real secrets for local development |
| `README.md` | Setup, API reference, deployment steps |

---

## 4. Backend Core

### `src/lib/mongodb.ts`

Connects to MongoDB and caches the connection in `global.mongooseCache`.

In serverless environments (Vercel), reusing the connection prevents opening too many DB connections per request.

```
connectDB() → check cache → connect if needed → return mongoose
```

### `src/lib/auth.ts`

Handles all JWT logic.

| Function | Purpose |
|----------|---------|
| `signToken()` | Creates JWT with `userId` + `email` (7-day expiry) |
| `verifyToken()` | Validates JWT, returns payload or null |
| `getSession()` | Reads cookie in Server Components |
| `getSessionFromRequest()` | Reads cookie in API routes |
| `setTokenCookie()` | Sets httpOnly cookie after login/signup |
| `clearTokenCookie()` | Clears cookie on logout |

**Security:**

- JWT stored in **httpOnly cookie** (not accessible to JavaScript)
- `secure: true` in production (HTTPS only)
- Password is never stored in the JWT

### `src/models/User.ts`

MongoDB collection: `users`

| Field | Type | Notes |
|-------|------|-------|
| `name` | String | Required |
| `email` | String | Required, unique, lowercase |
| `password` | String | Bcrypt hash, min 6 chars |
| `createdAt` | Date | Auto |
| `updatedAt` | Date | Auto |

### `src/models/Book.ts`

MongoDB collection: `books`

| Field | Type | Notes |
|-------|------|-------|
| `userId` | ObjectId | References User |
| `title` | String | Required |
| `author` | String | Required |
| `tags` | String[] | e.g. `["fiction", "classic"]` |
| `status` | String | `want-to-read` \| `reading` \| `completed` |
| `createdAt` | Date | Auto |
| `updatedAt` | Date | Auto |

Indexes on `{ userId, status }` and `{ userId, tags }` for faster filtering.

### `src/types/index.ts`

Shared TypeScript types:

- `Book`, `User`, `BookStatus`
- `BOOK_STATUS_LABELS` — display names
- `BOOK_STATUS_EMOJI` — status icons

---

## 5. Middleware

**File:** `src/middleware.ts`

Runs before protected pages load.

| Route | Behavior |
|-------|----------|
| `/dashboard` | No/invalid token → redirect to `/login` |
| `/login`, `/signup` | Valid token → redirect to `/dashboard` |

---

## 6. API Routes

### Auth

#### `POST /api/auth/signup`

1. Validate name, email, password
2. Check email is not already registered
3. Hash password with bcrypt (12 rounds)
4. Create user in MongoDB
5. Sign JWT, set cookie, return user (without password)

#### `POST /api/auth/login`

1. Find user by email
2. Compare password with bcrypt
3. Sign JWT, set cookie, return user

#### `POST /api/auth/logout`

Clears the JWT cookie.

#### `GET /api/auth/me`

Returns the currently logged-in user from the session cookie.

### Books

#### `GET /api/books`

- Requires authentication
- Returns only books where `userId` matches the JWT
- Optional filters: `?status=reading&tag=fiction`
- Sorted by `updatedAt` (newest first)

#### `POST /api/books`

- Requires authentication
- Creates a book linked to the current user
- Parses tags from comma-separated string
- Default status: `want-to-read`

#### `PUT /api/books/[id]`

- Requires authentication
- Updates book only if `_id` and `userId` match
- Can update title, author, tags, status

#### `DELETE /api/books/[id]`

- Requires authentication
- Deletes book only if it belongs to the current user

---

## 7. Pages

### `src/app/page.tsx` — `/`

Checks session and redirects to `/dashboard` or `/login`.

### `src/app/login/page.tsx`

Login page with split layout and `AuthForm` (mode: login).

### `src/app/signup/page.tsx`

Signup page with split layout and `AuthForm` (mode: signup).

### `src/app/dashboard/page.tsx`

Server Component that:

1. Verifies session
2. Fetches user from MongoDB
3. Fetches user's books
4. Passes data to the `Dashboard` client component

---

## 8. Components

### `AuthForm.tsx`

Handles login and signup forms. Calls the auth API and redirects to `/dashboard` on success.

### `Navbar.tsx`

Top navigation with logo, user name, avatar initial, and logout button.

### `Dashboard.tsx`

Main client component. Manages:

- Book list state
- Add / edit / delete operations
- Client-side filtering by status and tag
- Refreshing data after changes

### `StatsCards.tsx`

Displays total books and counts by status (Want to Read, Reading, Completed).

### `BookForm.tsx`

Form for adding or editing a book (title, author, tags, status).

### `BookCard.tsx`

Displays a single book with status badge, tags, and edit/delete/status controls.

### `FilterBar.tsx`

Pill buttons for status filtering and dropdown for tag filtering.

---

## 9. Styling

### `src/app/layout.tsx`

Loads fonts (Fraunces for headings, Plus Jakarta Sans for body) and wraps all pages.

### `src/app/globals.css`

Global design system:

- CSS variables for colors and surfaces
- Utility classes: `.page-bg`, `.glass-card`, `.btn-primary`, `.input-field`
- Status styles: `.status-want`, `.status-reading`, `.status-completed`
- Animations: `.animate-float-in`

---

## 10. Request Flow Examples

### Sign up

```
Form submit → POST /api/auth/signup
  → hash password
  → save User
  → sign JWT
  → set cookie
  → redirect to /dashboard
```

### Add book

```
BookForm submit → POST /api/books
  → validate JWT
  → Book.create({ userId, title, author, tags, status })
  → refreshBooks() → GET /api/books
  → UI updates
```

### Access protected page

```
Visit /dashboard
  → middleware checks cookie
  → dashboard/page.tsx fetches user + books
  → renders Dashboard component
```

---

## 11. Environment Variables

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWTs (use a strong random string in production) |

---

## 12. Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 App Router, React 19, Tailwind CSS 4 |
| Backend | Next.js API Routes |
| Database | MongoDB + Mongoose |
| Auth | JWT (jose) + bcrypt, httpOnly cookies |
| Language | TypeScript |

---

## 13. Design Decisions

1. **Single codebase** — Frontend and backend in one Next.js project (no separate Express server)
2. **Server + client split** — Dashboard loads initial data on the server; interactions happen on the client
3. **User isolation** — Every book query filters by `userId` from the JWT
4. **httpOnly cookies** — Safer than storing JWT in localStorage
5. **Simple schema** — Two collections (User, Book), no over-engineering
