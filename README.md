📘 BudgetEase – Personal Budget and Expense Planner
BudgetEase helps users track their expenses, plan budgets, and understand their financial habits with clear visual insights.
It offers an intuitive interface, secure authentication, and useful analytics to simplify personal finance management.

🚨 Problem Statement
Manually tracking expenses often becomes confusing and time-consuming. People struggle to understand where their money goes, how to maintain budgets, and how to monitor their financial health.

BudgetEase solves this by allowing users to:

Record and categorize expenses
Visualize spending patterns
Create and manage budgets
Get monthly insights and financial breakdowns
🏗️ System Architecture
Architecture Flow:
Frontend (Next.js + React) → Backend API (Node.js + Express) → Database (MySQL)

🔧 Tech Stack
Frontend
Next.js
React
TailwindCSS
Backend
Node.js
Express.js
Database
MySQL
Authentication
JWT-based login/signup
Hosting
Frontend → Vercel
Backend → Render / Railway
Database → Aiven
✨ Key Features
🔐 Authentication & Authorization
User registration
Login & logout
JWT-based session management
📦 CRUD Operations
Add, view, edit, delete expenses
Create and manage budgets
🧭 Frontend Routing
Home
Login
Signup
Dashboard
Add Expense
Budget Overview
🗂️ Expense Categorization
Categories like Food, Transport, Utilities, etc.
⚙️ Data Operations
Search
Filter
Sorting (by date, category, amount)
Pagination
📊 Analytics & Visualization
Monthly spending summaries
Charts showing category-wise breakdown
Budget vs. actual spending insights
☁️ Hosting
Fully deployed backend & frontend
Accessible production URLs
📑 Tech Stack Overview
Layer	Technologies
Frontend	Next.js, React, TailwindCSS, Axios
Backend	Node.js, Express.js
Database	MySQL
Authentication	JWT-based login/signup
Hosting	Vercel (Frontend), Render/Railway (Backend), MySQL on Aiven
🧪 API Overview
Endpoint	Method	Description	Access
/api/auth/signup	POST	Register a new user	Public
/api/auth/login	POST	Authenticate user and issue JWT	Public
/api/expenses	GET	Get all expenses for user	Authenticated
/api/expenses	POST	Add a new expense	Authenticated
/api/expenses/:id	PUT	Update expense by ID	Authenticated
/api/expenses/:id	DELETE	Delete expense by ID	Authenticated
/api/budgets	GET	Get user budget overview	Authenticated
/api/budgets	POST	Create/update budget	Authenticated
