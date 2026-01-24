"use client";

import { useState } from "react";
import FlightCard from "../../Component/FlightCard";
import BookingModal from "../Booking/BookingModal";

interface Flight {
  id: string;
  flightNumber: string;
  route: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
}

export default function FlightsClient({ flights }: { flights: Flight[] }) {
  const [open, setOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  const handleBook = (flight: Flight) => {
    setSelectedFlight(flight);
    setOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {flights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} onBook={handleBook} />
        ))}
      </div>

      {/* ✅ Modal stays exactly like yours */}
      <BookingModal
        open={open}
        flight={selectedFlight}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
