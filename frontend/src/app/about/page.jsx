"use client"
import Feature from "../Components/Feature";
import Footer from "../Components/Footer";
import Header from "../Components/Header.jsx";
import { Users, Target } from "lucide-react";

export default function About() {
  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-50 via-white to-blue-50">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Users className="w-4 h-4" />
            <span>Trusted by 50,000+ users worldwide</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Empowering Your
            <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600"> Financial Journey</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">//gives line between the text
            We believe everyone deserves financial peace of mind. Our mission is to make budgeting simple,
            insightful, and accessible to people from all walks of life.
          </p>
        </div>
      </section>

      {/* Mission section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Target className="w-4 h-4" />
                <span>Our Mission</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                Making Financial Wellness Accessible to Everyone
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mb-6 leading-relaxed">
                Born from the frustration of complex financial tools and confusing spreadsheets,
                BudgetEase was created to democratize financial planning. We've helped thousands
                of people take control of their finances and build a more secure future.
              </p>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Our team combines to deliver an experience that's both powerful and surprisingly simple to use.
              </p>
            </div>
            <div>
              <img src="/about_page_image.avif" alt="Team collaboration" className="w-full h-auto rounded-2xl shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Why Choose BudgetEase?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              We've built more than just another budgeting app. We've created a comprehensive
              financial companion that grows with you.
            </p>
          </div>
          <Feature />
        </div>
      </section>

      <Footer />
    </div>
  );
}
