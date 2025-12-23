"use client"
import { useState } from "react";
import { Ticket, Home, Settings, Menu, X } from "lucide-react";
import Image from "next/image";

export default function TicketSubmission() {
  const [ticketNumber, setTicketNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSubmit = async () => {
    if (!ticketNumber.trim()) {
      setMessage("Please enter a ticket number");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      console.log("Sending request to API...");
      console.log("Ticket number:", ticketNumber.trim());

      const response = await fetch("/api/submit-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticketNumber: ticketNumber.trim(),
        }),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      const contentType = response.headers.get("content-type");
      console.log("Content-Type:", contentType);

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Expected JSON but got:", text.substring(0, 200));
        setMessage("Server configuration error. Check console for details.");
        setMessageType("error");
        return;
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        setMessage("Ticket submitted successfully!");
        setMessageType("success");
        setTicketNumber("");
      } else {
        setMessage(data.error || "Failed to submit ticket");

        setMessageType("error");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setMessage("Network error. Check console for details.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: { key: string; }) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleClear = () => {
    setTicketNumber("");
    setMessage("");
    setMessageType("");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-3">
              <Image src="/isos.png" alt="International SOS" width={120} height={25} priority />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                <Ticket className="w-5 h-5" />
                <span>Antrian</span>
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 space-y-2 border-t border-gray-200">
              <button className="flex items-center space-x-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition">
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>
              <button className="flex items-center space-x-2 w-full px-4 py-2 text-white bg-blue-600 rounded-lg">
                <Ticket className="w-5 h-5" />
                <span>Submit Ticket</span>
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div
        className="flex items-center justify-center p-4"
        style={{ minHeight: "calc(100vh - 160px)" }}
      >
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Submit Ticket
            </h1>
            <p className="text-gray-600">Enter your ticket number below</p>
          </div>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="ticketNumber"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Ticket Number
              </label>
              <input
                type="text"
                id="ticketNumber"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 border placeholder-gray-400 text-gray-800 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Fill here"
                disabled={loading}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Ticket"}
              </button>
              <button
                onClick={handleClear}
                disabled={loading}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear
              </button>
            </div>
          </div>

          {message && (
            <div
              className={`mt-4 p-4 rounded-lg ${
                messageType === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Your ticket will be recorded with a timestamp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
