import express from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// Add a new expense
router.post("/add", verifyToken, async (req, res) => {
  try {
    const { category, name, amount } = req.body;
    const userId = req.userId;

    // Validation
    if (!category || !name || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Category, name, and amount are required",
      });
    }

    if (parseFloat(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than 0",
      });
    }

    // Create expense
    const expense = await prisma.expense.create({
      data: {
        category,
        name,
        amount: parseFloat(amount),
        userId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      data: expense,
    });
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get all expenses for a user with filtering, sorting, and pagination
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;
    
    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const sort = (req.query.sort || "date-desc").toLowerCase();
    const category = req.query.category;
    const status = req.query.status;
    const dateFrom = req.query.dateFrom;
    const dateTo = req.query.dateTo;
    const search = (req.query.search || "").trim();

    // Validate pagination params
    const validPage = Math.max(1, page);
    const validLimit = Math.min(100, Math.max(1, limit)); // Cap at 100 records per page

    // Build where clause dynamically
    const whereClause = { userId };

    // Category filter
    if (category) {
      whereClause.category = {
        equals: category,
        mode: "insensitive", // Case-insensitive search
      };
    }

    // Search filter (name or category contains search string - case insensitive)
    if (search) {
      whereClause.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          category: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    // Note: status is typically all "Completed" for expenses, but included for future extensibility
    if (status) {
      // Add status filter if needed in future
    }

    // Date range filtering
    if (dateFrom || dateTo) {
      whereClause.createdAt = {};
      if (dateFrom) {
        whereClause.createdAt.gte = new Date(dateFrom);
      }
      if (dateTo) {
        whereClause.createdAt.lte = new Date(dateTo);
      }
    }

    // Build orderBy dynamically based on sort param
    let orderBy = { createdAt: "desc" }; // Default

    // Normalize sort values and validate
    switch (sort) {
      case "date-asc":
        orderBy = { createdAt: "asc" };
        break;
      case "date-desc":
        orderBy = { createdAt: "desc" };
        break;
      case "amount-asc":
        orderBy = { amount: "asc" };
        break;
      case "amount-desc":
        orderBy = { amount: "desc" };
        break;
      case "alpha-asc":
        orderBy = { name: "asc" };
        break;
      case "alpha-desc":
        orderBy = { name: "desc" };
        break;
      default:
        // Log invalid sort values for debugging
        console.warn(`Invalid sort value received: "${sort}", using default "date-desc"`);
        orderBy = { createdAt: "desc" };
    }

    // Get total count for pagination
    const totalRecords = await prisma.expense.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(totalRecords / validLimit);

    // Fetch expenses with pagination - SORTING HAPPENS HERE
    const expenses = await prisma.expense.findMany({
      where: whereClause,
      orderBy,
      skip: (validPage - 1) * validLimit,
      take: validLimit,
    });

    res.json({
      success: true,
      data: expenses,
      pagination: {
        page: validPage,
        limit: validLimit,
        totalPages,
        totalRecords,
      },
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get a single expense
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const expense = await prisma.expense.findUnique({
      where: { id: parseInt(id) },
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    // Check ownership
    if (expense.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    res.json({
      success: true,
      data: expense,
    });
  } catch (error) {
    console.error("Error fetching expense:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Update an expense
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { category, name, amount } = req.body;
    const userId = req.userId;

    const expense = await prisma.expense.findUnique({
      where: { id: parseInt(id) },
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    if (expense.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const updatedExpense = await prisma.expense.update({
      where: { id: parseInt(id) },
      data: {
        category: category || expense.category,
        name: name || expense.name,
        amount: amount !== undefined ? parseFloat(amount) : expense.amount,
      },
    });

    res.json({
      success: true,
      message: "Expense updated successfully",
      data: updatedExpense,
    });
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Delete an expense
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const expense = await prisma.expense.findUnique({
      where: { id: parseInt(id) },
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    if (expense.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await prisma.expense.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
