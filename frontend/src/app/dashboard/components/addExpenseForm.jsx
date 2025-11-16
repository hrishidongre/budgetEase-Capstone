"use client";
import Input from "../uiElements/input";
import Label from "../uiElements/label";
import Select from "../uiElements/Select";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog"; 

const categoryOptions = [
  { name: "Food & Dining", icon: "🍽️" },
  { name: "Transportation", icon: "🚗" },
  { name: "Shopping", icon: "🛒" },
  { name: "Entertainment", icon: "🎬" },
  { name: "Bills & Utilities", icon: "💡" },
  { name: "Healthcare", icon: "🏥" },
  { name: "Education", icon: "📚" },
  { name: "Travel", icon: "✈️" },
  { name: "Savings", icon: "💰" },
  { name: "Other", icon: "📋" },
];

export default function ExpenseDialogBody({ onSuccess, closeDialog }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = user?.id;

    if (!category || !amount) {
      alert("Please fill in all required fields.");
      return;
    }

    const { data, error } = await supabase.from("expense").insert([
      {
        category_name: category,
        amount: parseFloat(amount),
        description: description,
        user_id: userId,
      },
    ]);

    if (error) {
      alert("Failed to add expense. Try again.");
    } else {
      onSuccess?.();
      closeDialog?.();
    }

    setCategory("");
    setAmount("");
    setDescription("");
  };

  return (
    <form className="space-y-4 text-sm sm:text-base" onSubmit={handleSubmit}>
      {/* Category */}
      <div className="flex flex-col">
        <Label htmlFor="category">Category</Label>
        <Select
          id="category"
          className="border border-gray-300 rounded-md mt-1 text-sm sm:text-base"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={categoryOptions}
        />
      </div>

      {/* Amount */}
      <div className="flex flex-col">
        <Label htmlFor="amount">Amount</Label>
        <Input
          type="number"
          id="amount"
          placeholder="0.00"
          className="mt-1 bg-gray-100 border border-gray-300 rounded-md"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      {/* Description */}
      <div className="flex flex-col">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          placeholder="What was this expense for?"
          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
        <DialogPrimitive.Close asChild>
          <button
            type="button"
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition"
          >
            Cancel
          </button>
        </DialogPrimitive.Close>

        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
        >
          Add Expense
        </button>
      </div>
    </form>
  );
}
