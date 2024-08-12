🚀 Backend Microservices for Authentication and User Management
Welcome to the backend repository for the Authentication and User Management microservices. This project is built using Node.js and Express.js, and it is structured as a microservices architecture with three main services: Auth Service, User Service, and Approval Service.

🏗️ Project Structure
go
Copy code
my_project/
│
├── backend/
│   ├── auth-service/
│   │   ├── app.js
│   │   └── package.json
│   │
│   ├── user-service/
│   │   ├── app.js
│   │   └── package.json
│   │
│   └── approval-service/
│       ├── app.js
│       └── package.json
│
└── docker-compose.yml
📦 Services
1. Auth Service 🔒
Handles user authentication, including login and JWT token generation.

Port: 3001
Endpoints:
POST /login: Authenticates a user and returns a JWT token if successful.
2. User Service 👤
Manages user registration (sign up) and stores user details securely.

Port: 3002
Endpoints:
POST /signup: Registers a new user and stores their details in the database.
3. Approval Service ✅
Handles the approval process for new users, allowing them to log in after being approved.

Port: 3003
Endpoints:
POST /approve/:userId: Approves a user based on their user ID.
🚀 Getting Started
Prerequisites
Make sure you have the following installed:

Node.js (v14 or higher)
npm (Node Package Manager)
Docker (for containerization)
Docker Compose (to run multiple containers)
🛠️ Installation
Clone the repository:

bash
Copy code
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name/backend
Install dependencies for each service:

Navigate to each service directory and run the following:

bash
Copy code
npm install
Do this for auth-service, user-service, and approval-service.

🐳 Docker Setup
Build and run the services using Docker Compose:

bash
Copy code
docker-compose up --build
Access the services:

Auth Service: http://localhost:3001
User Service: http://localhost:3002
Approval Service: http://localhost:3003
🔧 Usage
Login: Use the POST /login endpoint on the Auth Service to authenticate users.
Sign Up: Use the POST /signup endpoint on the User Service to register new users.
Approve User: Use the POST /approve/:userId endpoint on the Approval Service to approve users so they can log in.
📜 License
This project is licensed under the MIT License. See the LICENSE file for details.

👥 Contributors
Rajeev Kumar Koppisetti - LinkedIn
📧 Contact
For any inquiries, please contact Rajeev Kumar Koppisetti at your-email@example.com.
