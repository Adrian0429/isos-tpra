"use client";

type Props = {
  ticket: string;
  onReset: () => void;
};

export default function TicketDisplayCard({ ticket, onReset }: Props) {
  const handleReset = () => {
    document.cookie = "patient_ticket=; max-age=0; path=/";
    onReset();
  };

  return (
    <div
      className="
        relative bg-white rounded-lg shadow-lg
        p-6 md:p-10
        w-full
        max-w-md md:max-w-2xl lg:max-w-3xl
        flex flex-col
      "
    >
      {/* CONTENT */}
      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-800">
          Your Ticket Number
        </h2>

        <p className="text-base md:text-xl text-gray-600 mt-2 mb-6">
          Nomor tiket Anda
        </p>

        <div className="border rounded-lg px-6 md:px-10 py-8 md:py-14 bg-blue-50 text-center">
          <p className="text-6xl md:text-7xl lg:text-8xl font-bold text-blue-700">
            {ticket}
          </p>
        </div>

        <p className="mt-6 text-sm md:text-base text-gray-500 text-center">
          Please head to administration and state the number
          <br />
          <span className="italic">
            Silakan menuju administrasi dan menunjukkan nomor antrian
          </span>
        </p>
      </div>

      {/* RESET */}
      <button
        onClick={handleReset}
        className="mt-8 text-blue-600 hover:text-blue-800 underline text-sm md:text-base self-center"
      >
        Submit another queue number
        <br />
        <span className="italic text-xs md:text-sm">
          Ambil nomor antrian lain
        </span>
      </button>

    </div>
  );
}
