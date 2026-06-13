# Auth Service

## Overview

**AuthService** is responsible for all user authentication and authorization in the marketplace. It handles registration, login, logout, profile updates, password reset, and role management. User data is stored in MongoDB and sessions are managed using JWT (JSON Web Tokens).

---

## Responsibilities

- **User registration** — creates new accounts, validates email uniqueness, and hashes passwords with Bcrypt before storing
- **Login** — validates credentials, compares hashed passwords, and issues a signed JWT
- **Logout** — invalidates the session by removing the JWT from client cookies
- **Profile update** — allows users to update their name, email, or password with proper validation and re-hashing on password change
- **Password reset** — generates a secure reset token, sends it to the user's email via Nodemailer, validates the token, and updates the password
- **Auth check** — verifies the user's current auth state on every request by validating the JWT; supports refresh token logic for expired sessions
- **Role management** — allows admins to change user roles (e.g. user → admin); role-change routes are protected and admin-only
- **Security** — protects all sensitive routes with JWT middleware, hashes passwords with Bcrypt, enforces CORS, and guards against brute force attacks

---

## Tech Stack

| Package | Purpose |
|---|---|
| `Express.js` | HTTP server and REST API |
| `MongoDB` + `Mongoose` | User data storage and schema management |
| `JWT` | Stateless session tokens |
| `Bcrypt` | Password hashing |
| `Nodemailer` | Sending password reset emails |
| `cookie-parser` | Reading JWT from cookies |
| `cors` | Cross-origin security |
| `dotenv` | Environment configuration |

---

## API Endpoints

| Method | Route | Description | Auth Required |
|---|---|---|---|
| `POST` | `/register` | Create a new user account | No |
| `POST` | `/login` | Log in and receive JWT | No |
| `POST` | `/logout` | Log out and clear session | Yes |
| `PUT` | `/profile` | Update user profile | Yes |
| `POST` | `/password/reset-request` | Send password reset email | No |
| `POST` | `/password/reset` | Reset password with token | No |
| `GET` | `/me` | Get current authenticated user | Yes |
| `PUT` | `/role` | Change user role (admin only) | Yes (Admin) |

---

## Running the Service

```bash
cd backend/AuthService
cp .env.example .env   # fill in your values
npm install
npm run start
```

Default port: `4000`

---

## Environment Variables

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/auth
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
```
