# 🔗 URL Shortener --- Frontend

A modern frontend for a full-stack URL management platform. The
application provides authenticated URL management, premium link
controls, analytics, visitor logs, QR-code generation, and a polished
dashboard experience.

## ✨ Features

### URL Management

-   Create shortened URLs
-   Copy shortened URLs
-   Search URLs
-   Paginated URL listings
-   Delete and update URLs
-   Custom aliases for Premium users
-   Custom-alias availability checking
-   Configurable expiration by duration or specific date
-   Password-protected links
-   QR-code generation

### Dashboard & Analytics

-   Centralized URL dashboard
-   Click counts
-   Analytics overview
-   Click history
-   Visitor logs
-   Device/browser information
-   Referrer tracking
-   Creation and expiration information
-   Link management actions

### Authentication

-   User registration
-   Login
-   JWT-based authentication
-   Protected application routes
-   User-specific URL management
-   Forgot-password flow
-   Logout
-   Premium account support

### User Experience

-   Dark-themed interface
-   Custom toast notifications
-   Loading states
-   Buttons disabled during asynchronous mutations
-   Protection against accidental double submissions
-   Keyboard-friendly interactions
-   Accessibility-focused UI
-   Search and pagination
-   QR-code workflow

> Responsive/mobile optimization is being improved as part of the
> project's ongoing UI polish.

------------------------------------------------------------------------

## 🖥️ Application Screens

### Landing Page

Introduces the URL shortening platform and provides clear paths to
registration and login.

### Dashboard

Provides URL management, search, pagination, click counts, expiration
information, copying, QR-code access, editing, and deletion.

### Create Short URL

Provides advanced URL configuration including Premium custom aliases and
expiration controls.

### Analytics

Visualizes click activity and provides link performance information.

### Visitor Logs

Displays detailed visit information including timestamps, device/browser
data, and referrer information.

------------------------------------------------------------------------

## 🧰 Tech Stack

-   React
-   TanStack Query
-   Modern JavaScript/TypeScript frontend tooling
-   Custom UI components
-   REST API integration
-   JWT authentication flow

> Update this section with the exact framework/build tool names used in
> the repository, such as Vite, if applicable.

------------------------------------------------------------------------

## 🏗️ Frontend Architecture

The frontend communicates with a separately deployed backend API.

``` text
┌──────────────────────────┐
│       React Frontend     │
│                          │
│  Pages / Components      │
│  Forms / Dashboard       │
│  Authentication UI       │
│  Analytics UI            │
│                          │
│       TanStack Query     │
└────────────┬─────────────┘
             │
             │ REST API
             ▼
┌──────────────────────────┐
│       Backend API        │
│      Deployed on Render  │
└──────────────────────────┘
```

TanStack Query is used for server-state management, asynchronous
requests, caching where appropriate, and mutation handling.

------------------------------------------------------------------------

## 🔐 Authentication

The frontend integrates with the backend's JWT authentication system.

Protected application areas require an authenticated user. API responses
and authentication failures are surfaced to the user through the
application's notification system.

The frontend also respects Premium feature availability when presenting
gated functionality such as custom aliases.

------------------------------------------------------------------------

## ⚡ Loading & Error States

Asynchronous operations provide explicit UI feedback.

Examples include:

-   Loading states
-   Disabled action buttons during requests
-   Prevention of duplicate submissions
-   Success toasts
-   Backend error messages displayed through custom toasts
-   Validation feedback
-   Graceful handling of failed API requests

------------------------------------------------------------------------

## 🔌 Backend API

The frontend requires the URL Shortener backend API to be running.

Configure the backend/API base URL through environment variables rather
than hard-coding deployment-specific URLs.

Example:

``` env
VITE_API_BASE_URL="YOUR_BACKEND_API_URL"
```

Use the exact environment variable name expected by the project.

------------------------------------------------------------------------

## 🚀 Local Development

### 1. Clone the repository

``` bash
git clone YOUR_FRONTEND_REPOSITORY_URL
cd YOUR_FRONTEND_DIRECTORY
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Configure environment variables

Create the appropriate `.env` file and configure the backend API URL.

### 4. Start the development server

``` bash
npm run dev
```

The frontend will run using the development configuration and
communicate with the configured backend API.

------------------------------------------------------------------------

## 🌐 Deployment

The frontend is deployed on **Vercel**.

Production configuration points the frontend to the deployed backend
API.

``` text
Frontend
   ↓
Vercel
   ↓
Backend API
   ↓
Render
```

Production traffic uses HTTPS.

------------------------------------------------------------------------

## 📸 Portfolio

This frontend is part of a full-stack URL Shortener project.

The complete application includes:

-   URL shortening
-   Authentication
-   Premium features
-   URL management
-   Analytics
-   Visitor tracking
-   QR codes
-   Expiration
-   Password-protected links
-   Rate limiting
-   Production PostgreSQL database

------------------------------------------------------------------------

## 🔮 Future Improvements

-   Further mobile/responsive UI optimization
-   Optional light/dark theme switching
-   Additional analytics visualizations
-   Improved link preview experience

------------------------------------------------------------------------

## 📄 License

Add the project's preferred license here if the repository is intended
for public distribution.
