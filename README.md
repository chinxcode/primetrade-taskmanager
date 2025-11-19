# Task Manager - Frontend Developer Intern Assignment

A full-stack web application with authentication, user profile management, and task CRUD operations. Built with **Next.js**, **Tailwind CSS**, and **Node.js/Express** with **MongoDB**.

## 🎯 Features Implemented

### ✅ Frontend (Next.js + Tailwind CSS)

-   **Authentication Pages**: Login & Registration with client-side validation
-   **Protected Routes**: Dashboard accessible only to authenticated users
-   **Responsive Design**: Black & white theme, no rounded corners, mobile-first approach
-   **Dashboard**: Overview with statistics and quick actions
-   **Task Management**: Full CRUD operations with search, filter, and sort
-   **Profile Management**: View and update user profile, change password
-   **Real-time Feedback**: Error handling, loading states, success messages

### ✅ Backend (Node.js + Express + MongoDB)

-   **JWT Authentication**: Secure token-based authentication with refresh tokens
-   **Password Hashing**: bcrypt for secure password storage
-   **User APIs**: Register, login, logout, profile fetch/update, password change
-   **Task APIs**: CRUD operations with filtering, searching, and sorting
-   **Error Handling**: Centralized error handling with custom error classes
-   **Validation**: Server-side validation for all inputs
-   **Security**: CORS configuration, secure cookies, token validation middleware

### 🔒 Security Features

-   Password hashing with bcrypt (10 rounds)
-   JWT access tokens (1 day expiry)
-   JWT refresh tokens (10 days expiry)
-   Protected API endpoints with authentication middleware
-   Input validation on both client and server
-   Secure HTTP-only cookies
-   CORS configuration

## 🚀 Setup Instructions

### Prerequisites

-   Node.js (v18 or higher)
-   MongoDB (local or cloud)
-   npm or yarn

### Backend Setup

1. **Navigate to backend directory:**

    ```bash
    cd backend
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Create environment file:**

    ```bash
    cp .env.example .env
    ```

4. **Configure environment variables in `.env`:**

    ```env
    PORT=8000
    CORS_ORIGIN=http://localhost:3000

    ACCESS_TOKEN_SECRET=your-super-secret-access-token-key
    ACCESS_TOKEN_EXPIRY=1d

    REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key
    REFRESH_TOKEN_EXPIRY=10d

    MONGODB_URL=mongodb://localhost:27017/primetrade-taskmanager
    ```

5. **Start MongoDB** (if running locally):

    ```bash
    mongod
    ```

6. **Run the development server:**

    ```bash
    npm run dev
    ```

    Backend will run on `http://localhost:8000`

### Quick Start (Both Servers)

Open terminal window in root projest directory and run:

```bash
npm run install-all
```

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## 📚 API Documentation

### Base URL

```
http://localhost:8000/api/v1
```

### Authentication Endpoints

#### Register User

```http
POST /users/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}

Response: 201 Created
{
  "statusCode": 200,
  "data": {
    "_id": "...",
    "fullName": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "avatar": "...",
    "createdAt": "..."
  },
  "message": "User created successfully!",
  "success": true
}
```

#### Login

```http
POST /users/login
Content-Type: application/json

{
  "username": "johndoe",
  "password": "password123"
}

Response: 200 OK
{
  "statusCode": 200,
  "data": {
    "user": { ... },
    "accessToken": "...",
    "refreshToken": "..."
  },
  "message": "User logged in successfully",
  "success": true
}
```

#### Get Current User

```http
GET /users/profile
Authorization: Bearer <accessToken>

Response: 200 OK
{
  "statusCode": 200,
  "data": {
    "_id": "...",
    "fullName": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    ...
  },
  "message": "User fetched successfully",
  "success": true
}
```

#### Update Profile

```http
PATCH /users/profile
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "fullName": "John Updated",
  "email": "newemail@example.com"
}

Response: 200 OK
```

#### Change Password

```http
POST /users/change-password
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "oldPassword": "password123",
  "newPassword": "newpassword123"
}

Response: 200 OK
```

#### Logout

```http
POST /users/logout
Authorization: Bearer <accessToken>

Response: 200 OK
```

### Task Endpoints

#### Create Task

```http
POST /tasks
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the frontend developer assignment",
  "status": "pending",
  "priority": "high",
  "dueDate": "2025-11-25"
}

Response: 201 Created
```

#### Get All Tasks (with filters)

```http
GET /tasks?status=pending&priority=high&search=project&sortBy=createdAt&order=desc
Authorization: Bearer <accessToken>

Response: 200 OK
{
  "statusCode": 200,
  "data": [
    {
      "_id": "...",
      "title": "Complete project",
      "description": "...",
      "status": "pending",
      "priority": "high",
      "dueDate": "2025-11-25",
      "owner": "...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "message": "Tasks fetched successfully",
  "success": true
}
```

Query Parameters:

-   `status`: pending | in-progress | completed
-   `priority`: low | medium | high
-   `search`: Search in title and description
-   `sortBy`: createdAt | title | priority | dueDate
-   `order`: asc | desc

#### Get Task by ID

```http
GET /tasks/:id
Authorization: Bearer <accessToken>

Response: 200 OK
```

#### Update Task

```http
PATCH /tasks/:id
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "title": "Updated title",
  "status": "completed"
}

Response: 200 OK
```

#### Delete Task

```http
DELETE /tasks/:id
Authorization: Bearer <accessToken>

Response: 200 OK
```

#### Get Task Statistics

```http
GET /tasks/stats
Authorization: Bearer <accessToken>

Response: 200 OK
{
  "statusCode": 200,
  "data": {
    "total": 10,
    "pending": 3,
    "in-progress": 5,
    "completed": 2
  },
  "message": "Task statistics fetched successfully",
  "success": true
}
```
