'use client'

import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { authService } from '../../api/authService';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';

export default function SignUp() {
  const route = useRouter();

  const fullNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmailError('');
    setPasswordError('');
    setLoading(true);

    const fullName = fullNameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    // Email validation
    if (!validateEmail(email)) {
      setEmailError("Enter a valid email address");
      setLoading(false);
      return;
    }

    // Password validation
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    // Match passwords
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await authService.signup(fullName, email, password);
      route.push('/login');
    } catch (err) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EFFFFE] flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl border border-gray-100">

        {/* Brand */}
        <h1 className="text-3xl font-bold text-center mb-1">
          Budget<span className="text-[#0D9488]">Ease</span>
        </h1>
        <p className="text-center text-gray-600 text-sm mb-6">
          Enter your information to create your account
        </p>

        {/* Top-level error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Full Name */}
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-800">Full Name</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
              <User className="h-4 w-4 text-gray-400 mr-2" />
              <input
                type="text"
                ref={fullNameRef}
                placeholder="Enter your full name"
                className="w-full text-sm bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-800">Email</label>
            <div className={`flex items-center border rounded-md px-3 py-2 bg-gray-50 
                 ${emailError ? 'border-red-400' : 'border-gray-300'}`
            }>
              <Mail className="h-4 w-4 text-gray-400 mr-2" />
              <input
                type="text"
                ref={emailRef}
                placeholder="Enter your email"
                className="w-full text-sm bg-transparent outline-none"
                onBlur={(e) => {
                  if (!validateEmail(e.target.value)) {
                    setEmailError("Enter a valid email address");
                  } else {
                    setEmailError('');
                  }
                }}
              />
            </div>

            {emailError && (
              <p className="text-sm text-red-600 mt-1">{emailError}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-800">Password</label>
            <div className={`flex items-center border rounded-md px-3 py-2 bg-gray-50 
              ${passwordError ? 'border-red-400' : 'border-gray-300'}`}
            >
              <Lock className="h-4 w-4 text-gray-400 mr-2" />
              <input
                type={showPassword ? 'text' : 'password'}
                ref={passwordRef}
                placeholder="Enter your password"
                className="w-full text-sm bg-transparent outline-none"
                onBlur={(e) => {
                  if (e.target.value.length < 8) {
                    setPasswordError("Password must be at least 8 characters long");
                  } else {
                    setPasswordError('');
                  }
                }}
              />

              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
              </button>
            </div>

            {passwordError && (
              <p className="text-sm text-red-600 mt-1">{passwordError}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm mb-1 font-medium text-gray-800">Confirm Password</label>
            <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-gray-50">
              <Lock className="h-4 w-4 text-gray-400 mr-2" />
              <input
                type={showConfirm ? 'text' : 'password'}
                ref={confirmPasswordRef}
                placeholder="Confirm your password"
                className="w-full text-sm bg-transparent outline-none"
              />

              <button type="button" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#0D9488] text-white py-2 rounded-md font-semibold 
                       hover:bg-[#0b7d73] transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-[#0D9488] font-medium hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}
