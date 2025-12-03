"use client";
import Link from "next/link.js";
import FeatureCards from "./Components/Feature.jsx";
import Footer from "./Components/Footer.jsx";
import Header from "./Components/Header.jsx";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || loading) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-t from-teal-100 via-white to-teal-100 rounded-b-[80px] md:rounded-b-[150px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="w-full min-h-screen bg-gradient-to-t from-teal-100 via-white to-teal-100 rounded-b-[80px] md:rounded-b-[150px]">
        {/* Header  */}
        <Header />

        {/* Hero Content below header */}
        <div className="flex flex-col items-center justify-center text-center h-full px-4 sm:px-6 lg:px-12 mt-8 sm:mt-12 mb-10 sm:mb-12 md:mb-20">
          <img
            src="Main Logo.svg"
            alt="illustration"
            className="w-full max-w-[450px] sm:max-w-[600px] md:max-w-[750px] my-8"
          />

          {user ? (
            <Link
              href="#features"
              className="font-semibold underline text-md transition-transform duration-300 hover:scale-[1.05] mt-4 mb-12 sm:mb-20"
            >
              Check out the features
            </Link>
          ) : (
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="text-white shadow font-semibold w-[140px] h-[50px] bg-[#0D9488] rounded-[10px] text-sm flex items-center justify-center transition-transform duration-300 hover:scale-[1.05] hover:shadow-lg"
              >
                Get Started
              </Link>

              <Link
                href="#features"
                className="font-semibold underline text-md transition-transform duration-300 hover:scale-[1.05]"
              >
                Check out the features
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Tagline Section */}
      <h1 className="my-16 text-3xl sm:text-4xl md:text-5xl text-center px-4 sm:px-12 font-semibold leading-snug">
        Plan smarter. Spend wiser. Join{" "}
        <span className="text-[#0D9488]">thousands</span> already budgeting
        better.
      </h1>

      {/* Feature Section */}
      <div className="bg-gradient-to-br from-teal-100 via-white to-blue-100 w-full py-16 px-4 sm:px-6 md:px-12 flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-l from-blue-600 to-teal-600 text-center">
          Powerful Features for Financial Success
        </h1>
        <p className="text-gray-600 font-semibold text-base sm:text-lg text-center max-w-2xl mb-12">
          Everything you need to visualize, analyze, and optimize your financial
          data with complete privacy and security.
        </p>

        <div id="features">
          <FeatureCards />
        </div>
      </div>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-teal-600 w-full">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-8 font-medium">
            Join thousands of users who have transformed their financial lives
            with BudgetEase.
          </p>
          {(
            <Link href={user ? "/dashboard" : "/signup"}>
              <button className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-[10px] font-semibold transition">
                {user ? "Go to Dashboard" : "Start Your Journey"}
              </button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
