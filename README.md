# Task Tracker Backend

A Node.js/Express-based backend for the Task Tracker application, providing RESTful APIs for user authentication, project management, and task management. This project uses MongoDB via Mongoose for data persistence and JWT for authentication.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Features
- User authentication with JWT tokens
- Project CRUD operations
- Task CRUD operations
- CORS support for frontend integration
- Cookie parsing for token management

## Tech Stack
- **Backend**: Node.js, Express
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JSON Web Tokens (JWT)
- **Middleware**: CORS, cookie-parser
- **Deployment**: Render

## Prerequisites
- Node.js (v18.x or later recommended)
- npm or yarn
- MongoDB instance (local or remote, e.g., MongoDB Atlas)
- Git

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/task-tracker-backend.git
   cd task-tracker-backend
