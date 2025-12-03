import express from "express";
import { PrismaClient } from "@prisma/client";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
const prisma = new PrismaClient();

// Update user profile
// PUT /api/profile/update
// Body: { fullName?, email?, avatarUrl? }
router.put("/update", verifyToken, async (req, res) => {
  try {
    const userId = req.userId; // From verifyToken middleware
    const { fullName, email, avatarUrl } = req.body;

    // Validate that user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if email is already taken (if changing email)
    if (email && email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }
    }

    // Build update data - only include fields that are provided
    const updateData = {};
    if (fullName !== undefined) {
      updateData.fullName = fullName;
    }
    if (email !== undefined) {
      updateData.email = email;
    }
    if (avatarUrl !== undefined) {
      updateData.avatarUrl = avatarUrl;
    }

    // If no fields provided, return current user
    if (Object.keys(updateData).length === 0) {
      const { password: _, ...userWithoutPassword } = user;
      return res.json({
        success: true,
        message: "No changes provided",
        data: userWithoutPassword,
      });
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    // Return updated user (without password)
    const { password: _, ...userWithoutPassword } = updatedUser;
    res.json({
      success: true,
      message: "Profile updated successfully",
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get user profile
// GET /api/profile
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Return user (without password)
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Delete all user data and the user account
// DELETE /api/profile/delete-all
router.delete("/delete-all", verifyToken, async (req, res) => {
  try {
    const userId = req.userId; // From verifyToken middleware

    // Validate that user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete all related data in cascade order
    // Note: If Prisma cascade is configured, some of these may be automatic
    try {
      // Delete all expenses
      await prisma.expense.deleteMany({
        where: { userId },
      });

      // Delete all budgets
      await prisma.budget.deleteMany({
        where: { userId },
      });

      res.json({
        success: true,
        message: "All budgets and expenses deleted successfully. Your account remains active.",
      });
    } catch (dbError) {
      console.error("Database error during deletion:", dbError);
      res.status(500).json({
        success: false,
        message: "Error deleting user data",
      });
    }
  } catch (error) {
    console.error("Error deleting profile:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
