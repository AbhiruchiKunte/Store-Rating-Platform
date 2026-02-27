# 🏪 Store Rating Platform

A full-stack web application that allows users to browse, rate, and review stores.  
The platform supports **role-based access control (RBAC)** with dedicated dashboards for:

- 👤 Users  
- 🏬 Store Owners  
- 🛠️ Administrators  

The system includes secure authentication, store management, and rating functionality.

---

## 🚀 Key Features

### 🔐 Authentication & Security
- User Registration & Login
- JWT-based Authentication
- Password hashing using Bcrypt
- Secure password update functionality

### 👥 Role-Based Access Control (RBAC)
- **Admin** – Full platform control
- **Store Owner** – Manage store details & view ratings
- **User** – Browse stores & submit ratings

### 📊 Dashboards
- Admin Dashboard for centralized management
- Store Owner Dashboard for store insights
- User interface for browsing & rating stores

### ⭐ Store Rating System
- Browse available stores
- Submit ratings
- View aggregated ratings

---

## 🛠️ Tech Stack

### 🔹 Backend
- **Runtime:** Node.js  
- **Framework:** Express.js (v5.2.1)  
- **Database:** MySQL (mysql2)  
- **Authentication:** JSON Web Tokens (JWT)  
- **Password Security:** Bcrypt  
- **Environment Variables:** Dotenv  

### 🔹 Frontend
- **Library:** React (v19.2.4)  
- **Routing:** React Router DOM (v6.30.3)  
- **State Management:** React Context API (AuthContext)  
- **HTTP Client:** Axios  

---

## 🛣️ API Routes

| Route        | Description |
|-------------|-------------|
| `/api/auth`  | User Authentication (Login / Signup) |
| `/api/admin` | Admin operations |
| `/api/user`  | User actions & store browsing |
| `/api/owner` | Store Owner management |

---

## 📌 Author

Developed as a Full-Stack Project using MERN + MySQL architecture.


