import express from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// Get all transactions (combined budgets + expenses) with filtering, sorting, and pagination
router.get("/get", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    // Parse query parameters with normalization
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 30)); // Cap at 100
    const sort = (req.query.sort || "date-desc").toLowerCase();
    const type = req.query.type; // "budget" | "expense" | undefined (all)
    const category = req.query.category;
    const search = (req.query.search || "").trim();

    // Build where clause for budgets and expenses
    const whereClause = { userId };

    if (category) {
      whereClause.category = {
        equals: category,
        mode: "insensitive",
      };
    }

    // Fetch budgets (skip if filtering for expenses only)
    let budgets = [];
    if (type !== "expense") {
      budgets = await prisma.budget.findMany({ where: whereClause });
    }

    // Fetch expenses (skip if filtering for budgets only)
    let expenses = [];
    if (type !== "budget") {
      expenses = await prisma.expense.findMany({ where: whereClause });
    }

    // Convert to transactions
    let transactions = [];

    // Add budgets as positive transactions (income)
    budgets.forEach((budget) => {
      transactions.push({
        id: `budget-${budget.id}`,
        name: budget.name,
        date: budget.createdAt,
        amount: budget.amount,
        type: "budget",
        category: budget.category,
        status: "Completed",
      });
    });

    // Add expenses as negative transactions (outgoing)
    expenses.forEach((expense) => {
      transactions.push({
        id: `expense-${expense.id}`,
        name: expense.name,
        date: expense.createdAt,
        amount: -expense.amount,
        type: "expense",
        category: expense.category,
        status: "Completed",
      });
    });

    // SORT FIRST, THEN PAGINATE - Apply server-side sorting BEFORE pagination
    switch (sort) {
      case "date-asc":
        transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "date-desc":
        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "amount-asc":
        transactions.sort((a, b) => a.amount - b.amount);
        break;
      case "amount-desc":
        transactions.sort((a, b) => b.amount - a.amount);
        break;
      case "alpha-asc":
        transactions.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "alpha-desc":
        transactions.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Log invalid sort values for debugging
        console.warn(`Invalid sort value received: "${sort}", using default "date-desc"`);
        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Apply search filter (name or category contains search string - case insensitive)
    if (search) {
      transactions = transactions.filter((transaction) => {
        const nameMatch = transaction.name.toLowerCase().includes(search.toLowerCase());
        const categoryMatch = transaction.category.toLowerCase().includes(search.toLowerCase());
        return nameMatch || categoryMatch;
      });
    }

    // Get total count AFTER filtering but BEFORE pagination
    const totalRecords = transactions.length;
    const totalPages = Math.ceil(totalRecords / limit);

    // Apply pagination AFTER sorting
    const paginatedTransactions = transactions.slice(
      (page - 1) * limit,
      page * limit
    );

    res.json({
      success: true,
      data: paginatedTransactions,
      pagination: {
        page,
        limit,
        totalPages,
        totalRecords,
      },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
