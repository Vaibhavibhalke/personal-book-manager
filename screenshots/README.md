# Personal Book Manager

A full-stack reading list app built with Next.js, MongoDB, and JWT authentication. Track books you want to read, are currently reading, or have completed — with tags and filters to organize your collection.

## Features

- **Authentication** — Sign up, log in, and log out with JWT stored in httpOnly cookies
- **Book collection** — Add, edit, and delete books (title, author, tags, status)
- **Reading statuses** — Want to Read, Reading, Completed
- **Filters** — Filter your collection by status or tag
- **Dashboard** — Overview stats and quick status updates

## Screenshots

### Login

![Login page](./screenshots/login.png)

### Sign up

![Sign up page with existing account error](./screenshots/signup-error.png)

### Dashboard

![Empty dashboard](./screenshots/dashboard-empty.png)

![Dashboard with stats](./screenshots/dashboard-stats.png)

### Add & manage books

![Add a book and view collection](./screenshots/add-book-collection.png)

![Edit a book](./screenshots/edit-book.png)

### Filters

![No books match filters](./screenshots/filter-no-results.png)

![Login page filled in](./screenshots/login-filled.png)

## Tech Stack

| Layer    | Technology                    |
| -------- | ----------------------------- |
| Frontend | Next.js 16 (App Router)       |
| Styling  | Tailwind CSS                  |
| Backend  | Next.js API Routes            |
| Database | MongoDB (Mongoose)            |
| Auth     | JWT (jose) + bcrypt           |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### Setup

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd book-manager
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy `.env.example` to `.env.local` and fill in your values:

   ```bash
   cp .env.example .env.local
   ```

   | Variable      | Description                                      |
   | ------------- | ------------------------------------------------ |
   | `MONGODB_URI` | MongoDB connection string                        |
   | `JWT_SECRET`  | Secret key for signing JWT tokens (use a strong random string in production) |

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # signup, login, logout, me
│   │   └── books/         # CRUD endpoints
│   ├── dashboard/         # Protected dashboard page
│   ├── login/
│   └── signup/
├── components/            # UI components
├── lib/                   # DB connection, auth helpers
├── models/                # Mongoose schemas (User, Book)
├── middleware.ts          # Route protection
└── types/                 # Shared TypeScript types
```

## API Routes

| Method | Route              | Description              |
| ------ | ------------------ | ------------------------ |
| POST   | `/api/auth/signup` | Create a new account     |
| POST   | `/api/auth/login`  | Log in                   |
| POST   | `/api/auth/logout` | Log out                  |
| GET    | `/api/auth/me`     | Get current user         |
| GET    | `/api/books`       | List user's books        |
| POST   | `/api/books`       | Add a book               |
| PUT    | `/api/books/[id]`  | Update a book            |
| DELETE | `/api/books/[id]`  | Delete a book            |

## Deployment

### Vercel + MongoDB Atlas

1. Push your code to GitHub
2. Create a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster and get your connection string
3. Import the project on [Vercel](https://vercel.com)
4. Add environment variables (`MONGODB_URI`, `JWT_SECRET`) in Vercel project settings
5. Deploy

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```
