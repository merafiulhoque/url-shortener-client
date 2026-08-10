# 🔗 URL Shortener --- Frontend

A modern frontend for a full-stack URL management platform with
authentication, URL management, premium features, analytics, visitor
tracking, QR-code generation, and a production dashboard.

## ✨ Features

### URL Management

-   Create shortened URLs
-   Copy shortened URLs
-   Search URLs
-   Paginated URL listings
-   Update and delete URLs
-   Custom aliases for Premium users
-   Custom-alias availability checking
-   Configurable expiration by duration or specific date
-   Password-protected links
-   QR-code generation

### Dashboard & Analytics

-   URL management dashboard
-   Click counts
-   Analytics overview
-   Click history
-   Visitor logs
-   Device/browser information
-   Referrer tracking
-   Creation and expiration information
-   Per-link analytics

### Authentication

-   User registration
-   Login
-   JWT-based authentication
-   Protected routes
-   User-specific URL management
-   Forgot-password flow
-   Logout
-   Premium account support

### User Experience

-   Dark-themed interface
-   Custom toast notifications
-   Loading states
-   Disabled actions during mutations
-   Duplicate-submission prevention
-   Keyboard-friendly interactions
-   Accessibility-focused UI
-   Search and pagination

## 🧰 Tech Stack

-   React
-   TanStack Query
-   JavaScript
-   REST API
-   JWT authentication
-   Custom UI components

## 🏗️ Architecture

The frontend communicates with a separately deployed REST API.

``` text
┌──────────────────────────┐
│       React Frontend     │
│                          │
│  Pages / Components      │
│  Dashboard               │
│  Authentication UI       │
│  Analytics UI            │
│  Forms                   │
│                          │
│      TanStack Query      │
└────────────┬─────────────┘
             │
             │ REST API
             ▼
┌──────────────────────────┐
│       Backend API        │
│      Deployed on Render  │
└──────────────────────────┘
```

## 🔐 Authentication

The frontend integrates with the backend JWT authentication system.

Protected application areas require authentication, while user-specific
data is loaded through authenticated API requests.

Premium-only functionality is presented according to the user's account
status.

## ⚡ Loading & Error Handling

The application provides feedback during asynchronous operations:

-   Loading states
-   Disabled buttons during requests
-   Duplicate-submission prevention
-   Success notifications
-   Backend error messages through custom toast notifications
-   Validation feedback
-   Graceful API error handling

TanStack Query is used for server-state management and asynchronous
mutations.

## 📱 Accessibility & UI

The interface includes accessibility-focused form and interaction
patterns, keyboard-friendly controls, clear feedback states, and a
consistent dark-themed design.

## 🔌 Backend API

The frontend consumes the URL Shortener REST API.

The production frontend communicates with the deployed backend over
HTTPS.

## 🚀 Local Development

### Install dependencies

``` bash
npm install
```

### Configure environment variables

Create the required frontend environment file and configure the backend
API URL used by the application.

### Start the development server

``` bash
npm run dev
```

## 🌐 Deployment

The frontend is deployed on **Vercel**.

``` text
Frontend
   ↓
Vercel
   ↓
Backend API
   ↓
Render
```

Production communication uses HTTPS.

## 📸 Application

The frontend provides:

-   Landing page
-   Authentication screens
-   URL creation
-   URL dashboard
-   Search and pagination
-   Analytics dashboard
-   Visitor logs
-   Premium URL controls
-   QR-code workflow

## 📄 License

This project is a portfolio project.
