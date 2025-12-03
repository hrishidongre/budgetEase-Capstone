"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Trash2, Check, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, setUserData } = useAuth();

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  // UI state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  // Load user data from context on mount
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
    }
  }, [user]);

  // Show toast notification
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Handle save changes
  const handleSaveChanges = async (e) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim()) {
      showToast("Full name and email are required", "error");
      return;
    }

    setLoading(true);

    try {
      // Build update data - only include changed fields
      const updateData = {};

      if (fullName !== user.fullName) {
        updateData.fullName = fullName;
      }

      if (email !== user.email) {
        updateData.email = email;
      }

      // If no changes, show message
      if (Object.keys(updateData).length === 0) {
        showToast("No changes to save", "info");
        setLoading(false);
        return;
      }

      // Send PUT request
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/update`,
        updateData,
        { withCredentials: true }
      );

      if (response.data.success) {
        // Update user in context
        setUserData(response.data.data);
        showToast("Profile updated successfully", "success");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to update profile";
      showToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete all data
  const handleDeleteConfirm = async () => {
    setShowDeleteModal(false);
    setDeleting(true);

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/profile/delete-all`,
        { withCredentials: true }
      );

      if (response.data.success) {
        showToast("All budgets and expenses deleted successfully", "success");

        // Refresh the page to show updated data
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Error deleting data:", error);
      const errorMsg =
        error.response?.data?.message || "Failed to delete data";
      showToast(errorMsg, "error");
      setDeleting(false);
    }
  };

  if (!user) {
    return (
      <div className="p-6 sm:p-10 max-w-2xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 min-h-screen bg-white">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg z-50 animate-[slideIn_0.3s_ease] ${
            toast.type === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : toast.type === "error"
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-blue-100 text-blue-700 border border-blue-300"
          }`}
        >
          {toast.type === "success" && <Check size={18} />}
          {toast.type === "error" && <X size={18} />}
          {toast.message}
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold mb-2 tracking-tight">Profile</h1>
        <p className="text-gray-500 mb-10 text-lg">Manage your account settings</p>

        {/* Personal Information Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-semibold mb-6">Personal Information</h2>

          <form className="space-y-6" onSubmit={handleSaveChanges}>
            {/* Full Name */}
            <div>
              <label className="text-sm font-medium text-gray-600">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 w-full px-4 py-2.5 border rounded-lg bg-gray-50 hover:bg-gray-100 
                focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition border-gray-200"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-2.5 border rounded-lg bg-gray-50 hover:bg-gray-100 
                focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition border-gray-200"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || deleting}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl shadow transition font-semibold"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>

          {/* DELETE ACCOUNT BUTTON */}
          <button
            onClick={() => setShowDeleteModal(true)}
            disabled={deleting}
            className="mt-8 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl shadow transition font-semibold flex items-center gap-2"
          >
            <Trash2 className="w-5 h-5" /> Delete All Data
          </button>

          {/* WARNING BLOCK */}
          <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 shadow-sm">
            <h3 className="text-red-700 font-semibold mb-1">Warning</h3>
            <p className="text-red-600 text-sm leading-relaxed">
              Clicking this button will permanently delete{" "}
              <span className="font-semibold">all your data</span>, including
              expenses, transactions, and profile information. This action{" "}
              <span className="font-semibold">cannot be undone</span>.
            </p>
          </div>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-[90%] max-w-md text-center animate-[fadeIn_0.2s_ease]">
            <h2 className="text-2xl font-semibold mb-3 text-red-600">
              Are you sure?
            </h2>
            <p className="text-gray-600 mb-6">
              This will permanently delete all your data. This action cannot be
              undone.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white transition font-medium"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
