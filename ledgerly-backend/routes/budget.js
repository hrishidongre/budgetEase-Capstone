import express from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// Add a new budget
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

    // Create budget
    const budget = await prisma.budget.create({
      data: {
        category,
        name,
        amount: parseFloat(amount),
        userId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Budget added successfully",
      data: budget,
    });
  } catch (error) {
    console.error("Error adding budget:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get all budgets for a user with search, filtering, sorting, and pagination
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    // Parse query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const sort = (req.query.sort || "date-desc").toLowerCase();
    const category = req.query.category;
    const search = (req.query.search || "").trim();
    const dateFrom = req.query.dateFrom;
    const dateTo = req.query.dateTo;

    // Validate pagination params
    const validPage = Math.max(1, page);
    const validLimit = Math.min(100, Math.max(1, limit)); // Cap at 100 records per page

    // Build where clause dynamically
    const whereClause = { userId };

    // Category filter
    if (category) {
      whereClause.category = {
        equals: category,
        mode: "insensitive",
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
        console.warn(`Invalid sort value received: "${sort}", using default "date-desc"`);
        orderBy = { createdAt: "desc" };
    }

    // Get total count for pagination
    const totalRecords = await prisma.budget.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(totalRecords / validLimit);

    // Fetch budgets with pagination and sorting
    const budgets = await prisma.budget.findMany({
      where: whereClause,
      orderBy,
      skip: (validPage - 1) * validLimit,
      take: validLimit,
    });

    res.json({
      success: true,
      data: budgets,
      pagination: {
        page: validPage,
        limit: validLimit,
        totalPages,
        totalRecords,
      },
    });
  } catch (error) {
    console.error("Error fetching budgets:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get a single budget
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const budget = await prisma.budget.findUnique({
      where: { id: parseInt(id) },
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    // Check ownership
    if (budget.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    res.json({
      success: true,
      data: budget,
    });
  } catch (error) {
    console.error("Error fetching budget:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Update a budget
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { category, name, amount } = req.body;
    const userId = req.userId;

    const budget = await prisma.budget.findUnique({
      where: { id: parseInt(id) },
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    if (budget.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const updatedBudget = await prisma.budget.update({
      where: { id: parseInt(id) },
      data: {
        category: category || budget.category,
        name: name || budget.name,
        amount: amount !== undefined ? parseFloat(amount) : budget.amount,
      },
    });

    res.json({
      success: true,
      message: "Budget updated successfully",
      data: updatedBudget,
    });
  } catch (error) {
    console.error("Error updating budget:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Delete a budget
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const budget = await prisma.budget.findUnique({
      where: { id: parseInt(id) },
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    if (budget.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await prisma.budget.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: "Budget deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting budget:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
