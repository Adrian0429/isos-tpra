"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function QueuePicker() {
  const [ticketNumber, setTicketNumber] = useState<string>("");
  const [displayNumber, setDisplayNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [counter, setCounter] = useState(1);

  /* =========================
     Countdown logic
  ========================== */
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      setDisplayNumber(null);
      setCountdown(null);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  /* =========================
     Helpers
  ========================== */
  const formatNumber = (num: number) => num.toString().padStart(4, "0");

  /* =========================
     Submit logic
  ========================== */
  const handleSubmit = async (finalNumber: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/submit-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketNumber: finalNumber }),
      });

      if (!res.ok) throw new Error("Failed to submit ticket");

      document.cookie = `patient_ticket=${finalNumber}; max-age=3600; path=/`;

      setDisplayNumber(finalNumber);
      setCountdown(3);
      setTicketNumber("");
      setCounter((prev) => prev + 1);
    } catch {
      setError("Failed to submit ticket");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     Button action
  ========================== */
  const handleSubmitTicket = async () => {
    if (loading || countdown !== null) return;

    const finalNumber =
      ticketNumber.trim() !== ""
        ? ticketNumber.padStart(4, "0")
        : formatNumber(counter);

    handleSubmit(finalNumber);
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Image
            src="/isos.png"
            alt="International SOS"
            width={120}
            height={25}
          />
          <Image
            src="/freeport.png"
            alt="Freeport Indonesia"
            width={250}
            height={70}
          />
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex gap-8 p-10">
        {/* LEFT */}
        <div className="w-3/5 flex flex-col items-center justify-center bg-white rounded-2xl shadow text-center px-6">
          {displayNumber ? (
            <>
              <div className="text-[8rem] font-bold text-blue-600">
                {displayNumber}
              </div>
              <p className="text-xl text-gray-600 mt-4">
                Please head to the administration
              </p>
              <p className="text-lg text-gray-500">
                Silahkan menuju meja administrasi
              </p>
              <div className="text-lg text-gray-400 mt-4">
                Reset in {countdown}s
              </div>
            </>
          ) : (
            <div>
              <span className="text-3xl text-gray-400">
                Get your queue number and type it in on the right side
              </span>
              <br />
              <br />
              <br />
              <span className="text-3xl text-gray-400">
                Ambil nomor dan ketik pada sisi kanan
              </span>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="flex-1 flex flex-col justify-center gap-6">
          <div className="bg-white rounded-xl p-6 shadow text-lg text-gray-700 space-y-2">
            <p className="font-semibold">Instructions</p>
            <p>👉 Get your ticket number on the counter, then type it in.</p>
            <p>
              👉 After you submit the number, please head to the administration.
            </p>
            <hr />
            <p className="font-semibold">Petunjuk</p>
            <p>👉 Ambil nomor antrian dimeja, dan ketik di kolom bawah</p>
            <p>
              👉 Setelah memasukkan nomornya dan submit, silahkan menuju meja
              administrasi
            </p>
          </div>

          <input
            type="text"
            inputMode="numeric"
            placeholder="Optional: manual ticket number"
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
            disabled={loading || countdown !== null}
            className="w-full h-14 px-4 text-xl text-gray-800 rounded-xl border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />

          <button
            onClick={handleSubmitTicket}
            disabled={loading || countdown !== null}
            className="w-full h-24 text-3xl font-semibold rounded-2xl bg-blue-600 text-white active:scale-95 disabled:opacity-50"
          >
            {loading ? "Processing..." : "SUBMIT TICKET"}
          </button>

          {error && <p className="text-red-500 text-center text-lg">{error}</p>}
        </div>
      </div>
    </div>
  );
}
