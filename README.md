# 📘 BudgetEase – Personal Budget and Expense Planner

**BudgetEase** helps individuals track expenses, plan budgets, and build healthier financial habits through clear visual insights.  
It provides an intuitive interface, secure authentication, and practical analytics to simplify personal finance management.

---

## 🚨 Problem Statement

Tracking expenses manually can be tedious and confusing. People often struggle to understand:

- Where their money goes  
- How to maintain budgets  
- How to monitor their financial health  

**BudgetEase** solves these issues by enabling users to:

- Record and categorize expenses  
- Visualize spending patterns  
- Create and manage budgets  
- View monthly insights and financial breakdowns  

---

## 🏗️ System Architecture

**Architecture Flow:**  
**Frontend (Next.js + React)** → **Backend API (Node.js + Express)** → **Database (MySQL)**

---

## 🔧 Tech Stack

### **Frontend**
- Next.js  
- React  
- Tailwind CSS  

### **Backend**
- Node.js  
- Express.js  

### **Database**
- MySQL  

### **Authentication**
- JWT-based login & signup  

### **Hosting**
- Frontend → Vercel  
- Backend → Render / Railway  
- Database → Aiven  

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- User registration  
- Login & logout  
- JWT-based session management  

### 📦 CRUD Operations
- Add, view, edit, delete expenses  
- Create and manage budgets  

### 🧭 Frontend Routing
- Home  
- Login  
- Signup  
- Dashboard  
- Add Expense  
- Budget Overview  

### 🗂️ Expense Categorization
- Categories such as Food, Transport, Utilities, etc.

### ⚙️ Data Operations
- Search  
- Filter  
- Sort (date, category, amount)  
- Pagination  

### 📊 Analytics & Visualization
- Monthly spending summaries  
- Category-wise spending charts  
- Budget vs. actual spending comparison  

---

## 📑 Tech Stack Overview

| Layer          | Technologies                                          |
|----------------|--------------------------------------------------------|
| Frontend       | Next.js, React, TailwindCSS, Axios                     |
| Backend        | Node.js, Express.js                                    |
| Database       | MySQL                                                  |
| Authentication | JWT-based login/signup                                 |
| Hosting        | Vercel (Frontend), Render/Railway (Backend), Aiven     |

---

## 🧪 API Overview

| Endpoint              | Method | Description                         | Access        |
|----------------------|--------|-------------------------------------|---------------|
| /api/auth/signup     | POST   | Register a new user                 | Public        |
| /api/auth/login      | POST   | Authenticate user & issue JWT       | Public        |
| /api/expenses        | GET    | Get all expenses for user           | Authenticated |
| /api/expenses        | POST   | Add a new expense                   | Authenticated |
| /api/expenses/:id    | PUT    | Update expense by ID                | Authenticated |
| /api/expenses/:id    | DELETE | Delete expense by ID                | Authenticated |
| /api/budgets         | GET    | Get user budget overview            | Authenticated |
| /api/budgets         | POST   | Create/update budget                | Authenticated |

---

