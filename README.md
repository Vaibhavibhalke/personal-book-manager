# Personal Book Manager

A full-stack reading list app built with Next.js, MongoDB, and JWT authentication. Track books you want to read, are currently reading, or have completed — with tags and filters to organize your collection.

## Features

- **Authentication** — Sign up, log in, and log out with JWT stored in httpOnly cookies
- **Book collection** — Add, edit, and delete books with title, author, tags, and status
- **Reading statuses** — Want to Read, Reading, Completed
- **Filters** — Filter your collection by status or tag
- **Dashboard** — Overview stats and quick status updates

## Screenshots

### Login

![Login page](./screenshots/login.png)

### Sign Up

![Sign up page with existing account error](./screenshots/signup-error.png)

### Dashboard

![Empty dashboard](./screenshots/dashboard-empty.png)

![Dashboard with stats](./screenshots/dashboard-stats.png)

### Add & Manage Books

![Add a book and view collection](./screenshots/add-book-collection.png)

![Edit a book](./screenshots/edit-book.png)

### Filters

![No books match filters](./screenshots/filter-no-results.png)

### Login Filled

![Login page filled in](./screenshots/login-filled.png)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router) |
| Styling | Tailwind CSS |
| Backend | Next.js API Routes |
| Database | MongoDB (Mongoose) |
| Authentication | JWT (jose) + bcrypt |

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local installation or MongoDB Atlas)

### Setup

#### 1. Clone the repository

```bash
git clone https://github.com/Vaibhavibhalke/personal-book-manager.git
cd personal-book-manager
```

#### 2. Install dependencies

```bash
npm install
```

#### 3. Configure environment variables

Create a `.env.local` file in the project root.

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

You can use `.env.example` as a reference.

> Never commit `.env.local` or your MongoDB credentials to GitHub.

#### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```text
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   ├── logout/
│   │   │   ├── me/
│   │   │   └── signup/
│   │   └── books/
│   │       └── [id]/
│   ├── dashboard/
│   ├── login/
│   └── signup/
│
├── components/
├── lib/
├── models/
├── middleware.ts
└── types/
```

## API Routes

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/signup` | Create a new account |
| POST | `/api/auth/login` | Log in |
| POST | `/api/auth/logout` | Log out |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/books` | List user's books |
| POST | `/api/books` | Add a book |
| PUT | `/api/books/[id]` | Update a book |
| DELETE | `/api/books/[id]` | Delete a book |

## Authentication

The application uses JWT-based authentication.

- Passwords are securely hashed using `bcrypt`
- JWT tokens are generated after successful login
- JWT tokens are stored in `httpOnly` cookies
- Protected routes verify the authentication token
- Users can only access and manage their own books

## Book Management

Each book can contain:

- Title
- Author
- Tags
- Reading status

Supported reading statuses:

```text
Want to Read
Reading
Completed
```

Users can:

- Add books
- Edit books
- Delete books
- Filter books by status
- Filter books by tag
- View dashboard statistics

## Database

MongoDB is used as the application's database, with Mongoose providing schema modeling and database interaction.

The application stores:

- User accounts
- Hashed passwords
- Book collections
- Book metadata
- Reading status
- Tags

## Deployment

### Vercel + MongoDB Atlas

1. Push the project to GitHub.
2. Create a MongoDB Atlas cluster.
3. Get the MongoDB connection string.
4. Import the GitHub repository into Vercel.
5. Add the following environment variables in Vercel:

```text
MONGODB_URI
JWT_SECRET
```

6. Deploy the application.

After deployment, Vercel will provide a public URL for the application.

## Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random secret used to sign JWT tokens |

Example:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/book-manager
JWT_SECRET=your_long_random_secret
```

**Do not use the example values in production.**

## Scripts

```bash
npm run dev
```

Starts the development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Starts the production server.

```bash
npm run lint
```

Runs ESLint.

## License

MIT
