# Construction Site Tracker

A full-stack MERN web application for tracking construction site workflows, user access, and safety-related operations.  
This project is being built as a placement-focused portfolio project to demonstrate full-stack development skills using React, Node.js, Express, and MongoDB.  

## Status

🚧 **Work in Progress**

The backend authentication flow is functional, and the project is currently under active frontend development.  
Core UI components, dashboard pages, and advanced project features are still being added.  

## Features Completed

- User registration and login
- JWT-based authentication
- Protected routes
- MongoDB database integration
- Express backend setup
- React frontend setup with Vite
- GitHub repository setup

## Features In Progress

- Role-based access control
- Dashboard UI
- Project listing and project cards
- Frontend page structure
- Better error handling and validation

## Planned Features

- Admin and user role management
- Analytics dashboard
- Search, filter, and sort
- File/image upload
- Audit logs
- Deployment

## Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

## Folder Structure

```bash
Construction-Site-Tracker/
│
├── public/
├── src/                # Frontend source code
├── server/
│   ├── src/            # Backend source code
│   ├── package.json
│   └── .env
│
├── package.json
├── README.md
└── .gitignore
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/aparna21-6/Construction-Site-Tracker.git
cd Construction-Site-Tracker
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd server
npm install
```

### 4. Create environment variables

Create a `.env` file inside the `server` folder and add:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 5. Run backend

```bash
cd server
npm run dev
```

### 6. Run frontend

Open a new terminal:

```bash
npm run dev
```

## Current Development Notes

- Authentication is working with MongoDB and JWT.
- Protected route setup is implemented.
- Some frontend components and pages are still incomplete.
- The project is being improved step by step for placement readiness.

## Roadmap

- [x] Setup MERN project structure
- [x] Connect MongoDB
- [x] Implement user authentication
- [x] Add protected routes
- [ ] Add role-based authorization
- [ ] Build dashboard UI
- [ ] Add project cards and listing
- [ ] Add analytics and reports
- [ ] Add file uploads
- [ ] Add audit logs
- [ ] Deploy frontend and backend

## Why This Project

This project is being built to demonstrate:
- full-stack web development
- authentication and route protection
- backend API development
- MongoDB integration
- scalable feature planning for real-world applications

## Author

**Aparna Srivastava**

GitHub: [aparna21-6](https://github.com/aparna21-6)# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
