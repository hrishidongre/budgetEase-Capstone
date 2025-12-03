import express from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// Helper function to get current month date range
const getCurrentMonthRange = () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { startOfMonth, endOfMonth };
};

// GET /api/analytics/category-spending
// Returns spending by category for the current month
router.get("/category-spending", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { startOfMonth, endOfMonth } = getCurrentMonthRange();

    // Fetch expenses for current month grouped by category
    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      select: {
        category: true,
        amount: true,
      },
    });

    // Group by category and sum amounts
    const categorySpending = {};
    expenses.forEach((expense) => {
      if (!categorySpending[expense.category]) {
        categorySpending[expense.category] = 0;
      }
      categorySpending[expense.category] += expense.amount;
    });

    // Convert to array format for chart
    const data = Object.entries(categorySpending).map(([category, totalAmount]) => ({
      category,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
    }));

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching category spending:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// GET /api/analytics/daily-expenses
// Returns expenses grouped by day for the current month
router.get("/daily-expenses", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { startOfMonth, endOfMonth } = getCurrentMonthRange();

    // Fetch expenses for current month
    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      select: {
        createdAt: true,
        amount: true,
      },
    });

    // Group by day of month
    const dailyExpenses = {};
    expenses.forEach((expense) => {
      const day = expense.createdAt.getDate();
      if (!dailyExpenses[day]) {
        dailyExpenses[day] = 0;
      }
      dailyExpenses[day] += expense.amount;
    });

    // Convert to array format, filling in missing days with 0
    const daysInMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0).getDate();
    const data = [];
    for (let day = 1; day <= daysInMonth; day++) {
      data.push({
        day,
        total: parseFloat((dailyExpenses[day] || 0).toFixed(2)),
      });
    }

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error fetching daily expenses:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// GET /api/analytics/budget-summary
// Returns total budget and total expenses for current month
router.get("/budget-summary", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    const { startOfMonth, endOfMonth } = getCurrentMonthRange();

    // Sum all budgets for user
    const budgetResult = await prisma.budget.aggregate({
      where: { userId },
      _sum: { amount: true },
    });

    // Sum all expenses for current month
    const expenseResult = await prisma.expense.aggregate({
      where: {
        userId,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      _sum: { amount: true },
    });

    const totalBudget = parseFloat((budgetResult._sum.amount || 0).toFixed(2));
    const totalExpensesThisMonth = parseFloat((expenseResult._sum.amount || 0).toFixed(2));

    res.json({
      success: true,
      data: {
        totalBudget,
        totalExpensesThisMonth,
      },
    });
  } catch (error) {
    console.error("Error fetching budget summary:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
