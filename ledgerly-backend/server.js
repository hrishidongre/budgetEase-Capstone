import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import contactRoutes from "./routes/contact.js";
import dashboardRoutes from "./routes/dashboard.js";
import budgetRoutes from "./routes/budget.js";
import expenseRoutes from "./routes/expense.js";
import transactionRoutes from "./routes/transactions.js";
import profileRoutes from "./routes/profile.js";
import analyticsRoutes from "./routes/analytics.js";
import { verifyToken } from "./middleware/auth.js";


dotenv.config();

const app = express();

// allowed origins (ONLY production + localhost)
const allowedOrigins = [
  process.env.FRONTEND_URL,       // production: https://ledgerly-capstone.vercel.app
  "http://localhost:3000",
  "http://127.0.0.1:3000"
];

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://budget-ease-capstone.vercel.app/"
  ]
}))

// app.use(
//   cors({
//     origin: (origin, callback) => {

//       if (!origin) return callback(null, true); // mobile/postman

//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }

//       console.log("Blocked by CORS:", origin);
//       return callback(new Error("CORS Not Allowed"));
//     },
//     credentials: true,
//   })
// );

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/dashboard", verifyToken, dashboardRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/analytics", analyticsRoutes);

// Server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Allowed origins:", allowedOrigins);
});
