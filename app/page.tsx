"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function QueuePicker() {
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);
  const [displayNumber, setDisplayNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [error, setError] = useState("");

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

  const getNextTicketNumber = async () => {
    const res = await fetch("/api/get-last-ticket");
    if (!res.ok) return "0001";

    const json = await res.json();
    const last = json?.data?.ticketNumber;

    if (!last) return "0001";

    return formatNumber(parseInt(last, 10) + 1);
  };

  /* =========================
     Your handleSubmit (unchanged logic)
  ========================== */
  const handleSubmit = async (generatedNumber: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/submit-ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketNumber: generatedNumber }),
      });

      if (!res.ok) throw new Error("Failed to submit ticket");

      document.cookie = `patient_ticket=${generatedNumber}; max-age=3600; path=/`;

      setDisplayNumber(generatedNumber);
      setCountdown(10);
    } catch {
      setError("Failed to submit ticket");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     Button action
  ========================== */
  const handleGetNumber = async () => {
    if (loading || countdown !== null) return;

    const nextNumber = await getNextTicketNumber();
    setTicketNumber(nextNumber);
    handleSubmit(nextNumber);
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
        {/* LEFT: Display (smaller) */}
        <div className="w-3/5 flex flex-col items-center justify-center bg-white rounded-2xl shadow">
          {displayNumber ? (
            <>
              <div className="text-[8rem] font-bold text-blue-600">
                {displayNumber}
              </div>
              <div className="text-xl text-gray-500 mt-4">
                Reset in {countdown}s
              </div>
            </>
          ) : (
            <span className="text-3xl text-gray-400 text-center">
              Tap button to get number
            </span>
          )}
        </div>

        {/* RIGHT: Button + Instructions */}
        <div className="flex-1 flex flex-col justify-center gap-8">
          <div className="bg-white rounded-xl p-6 shadow text-lg text-gray-700 space-y-2">
            <p className="font-semibold">Instructions</p>
            <p>
              👉 Press <b>GET NUMBER</b> to receive your queue number.
            </p>
            <p>
              👉 The number will be shown for <b>10 seconds</b>.
            </p>
            <hr />
            <p className="font-semibold">Petunjuk</p>
            <p>
              👉 Tekan <b>GET NUMBER</b> untuk mendapatkan nomor antrian.
            </p>
            <p>
              👉 Nomor akan tampil selama <b>10 detik</b>.
            </p>
          </div>
          <button
            onClick={handleGetNumber}
            disabled={loading || countdown !== null}
            className="w-full h-24 text-3xl font-semibold rounded-2xl bg-blue-600 text-white active:scale-95 disabled:opacity-50"
          >
            {loading ? "Processing..." : "GET NUMBER"}
          </button>

          {error && <p className="text-red-500 text-center text-lg">{error}</p>}
        </div>
      </div>
    </div>
  );
}
