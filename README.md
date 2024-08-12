# 🚀 Backend Microservices for Authentication and User Management

Welcome to the backend repository for the **Authentication and User Management** microservices. This project is built using **Node.js** and **Express.js**, and it is structured as a microservices architecture with three main services: **Auth Service**, **User Service**, and **Approval Service**.


## 📦 Services

### 1. **Auth Service** 🔒
Handles user authentication, including login and JWT token generation.

- **Port:** `3001`
- **Endpoints:**
  - `POST /login`: Authenticates a user and returns a JWT token if successful.

### 2. **User Service** 👤
Manages user registration (sign up) and stores user details securely.

- **Port:** `3002`
- **Endpoints:**
  - `POST /signup`: Registers a new user and stores their details in the database.

### 3. **Approval Service** ✅
Handles the approval process for new users, allowing them to log in after being approved.

- **Port:** `3003`
- **Endpoints:**
  - `POST /approve/:userId`: Approves a user based on their user ID.

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- 🟢 **Node.js** (v14 or higher)
- 📦 **npm** (Node Package Manager)
- 🐳 **Docker** (for containerization)
- 🐙 **Docker Compose** (to run multiple containers)

### 🛠️ Installation


1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name/backend
