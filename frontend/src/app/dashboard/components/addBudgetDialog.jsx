'use client';
import React, { useState } from 'react';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, Plus } from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import Input from '../uiElements/input';
import Label from '../uiElements/label';
import Select from '../uiElements/Select';

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

export default function AddBudgetDialog({ onBudgetAdded }) {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const { user } = useAuth();

  const handleAddBudget = async (e) => {
    e.preventDefault();

    if (!category || !amount) {
      alert("Please fill in all fields");
      return;
    }

    const userId = user?.id;
    if (!userId) {
      alert("User not authenticated");
      return;
    }

    const {  error } = await supabase.from("budget").insert([
      {
        category_name: category,
        amount: parseFloat(amount),
        user_id: userId,
      },
    ]);

    if (error) {
      alert("Failed to add budget. Try again.");
      return;
    }

    onBudgetAdded?.();

    // Reset fields and close dialog
    setCategory('');
    setAmount('');
    setOpen(false);
  };

  return (
    //DialogPrimitve is a object containing the all the dialog components such as trigger
    //wraps the whole dialog component and controls the open and close states
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      {/* Trigger Button */}
      <DialogPrimitive.Trigger asChild>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition mx-2 my-3 sm:my-4 sm:mx-5">
          <Plus className="w-4 h-4 mr-2" />Add Budget
        </button>
      </DialogPrimitive.Trigger>

      {/* Modal Content */}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-[90%] sm:w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4 sm:p-6 shadow-lg focus:outline-none">
          
          {/* Close Icon */}
          <DialogPrimitive.Close asChild>
            <button className="absolute right-4 top-4 text-gray-500 hover:text-black">
              <X className="h-5 w-5" />
            </button>
          </DialogPrimitive.Close>

          {/* Title */}
          <DialogPrimitive.Title className="text-lg font-semibold mb-4">
            Add New Budget
          </DialogPrimitive.Title>

          {/* Form */}
          <form onSubmit={handleAddBudget} className="space-y-4">
            {/* Category */}
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                className='border-gray-300'
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={categoryOptions}
              />
            </div>

            {/* Amount */}
            <div>
              <Label htmlFor="amount">Budget Amount</Label>
              <Input
                className='bg-gray-100 border-gray-100'
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
              <DialogPrimitive.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              </DialogPrimitive.Close>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Add Budget
              </button>
            </div>
          </form>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
