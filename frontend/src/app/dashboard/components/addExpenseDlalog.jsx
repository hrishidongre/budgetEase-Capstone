"use client";
import { X, Plus } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import ExpenseDialogBody from "./addExpenseForm";
import { useState } from "react";

export default function AddExpenseDialog({onExpenseAdded }) {
  const [open, setOpen] = useState(false);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      {/* Trigger Button */}
      <DialogPrimitive.Trigger asChild>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition mx-2 my-3 sm:mx-5 sm:my-4">
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </button>
      </DialogPrimitive.Trigger>

      {/* dialog Modal */}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <DialogPrimitive.Content
          className="fixed left-1/2 top-1/2 z-50 w-[90%] sm:w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4 sm:p-6 shadow-lg focus:outline-none"
        >
          {/* Close Icon */}
          <DialogPrimitive.Close asChild>
            <button className="absolute right-4 top-4 text-gray-500 hover:text-black">
              <X className="h-5 w-5" />
            </button>
          </DialogPrimitive.Close>

          {/* Title */}
          <DialogPrimitive.Title className="text-lg font-semibold mb-4">
            Add Expense
          </DialogPrimitive.Title>

          {/* Form */}
          <ExpenseDialogBody
            onSuccess={onExpenseAdded}
            closeDialog={() => setOpen(false)}
          />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
