"use client"
import React from "react"
export default function Footer() {
  return (
    <footer className="w-full bg-black text-white pt-8 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* Logo */}
        <div>
          <img
            src="logo/footer_logo.svg"
            alt="footer logo"
            className="w-[160px] sm:w-[180px] md:w-[200px] mx-auto md:mx-0 mb-4"
          />
          <p className="text-[12px] text-gray-400">
            © 2025 BudgetEase. All rights reserved.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-base font-semibold mb-3">Quick Links</h3>
          <ul className="text-sm space-y-2">
            <li>
              <a href="/" className="hover:underline hover:text-teal-400 transition">
                Home
              </a>
            </li>
            <li>
              <a href="/about" className="hover:underline hover:text-teal-400 transition">
                About
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-base font-semibold mb-3">Contact</h3>
          <ul className="text-sm space-y-2">
            <li>Email: competitivehridon2024@gmail.com</li>
            <li>Phone: +91 91314-XXXXX</li>
            <li>Location: India</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
