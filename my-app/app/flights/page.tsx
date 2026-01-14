"use client";

import FlightCard from "../Component/FlightCard";

// import FlightCard from "@/components/FlightCard";

const flights = [
  {
    id: "1",
    flightNumber: "SP-101",
    route: "Dhaka → London",
    departureTime: "2026-02-01T10:00:00Z",
    arrivalTime: "2026-02-01T14:00:00Z",
  },
  {
    id: "2",
    flightNumber: "SP-202",
    route: "Dhaka → Dubai",
    departureTime: "2026-02-03T08:00:00Z",
    arrivalTime: "2026-02-03T11:30:00Z",
  },
  {
    id: "3",
    flightNumber: "SP-202",
    route: "Dhaka → Dubai",
    departureTime: "2026-02-03T08:00:00Z",
    arrivalTime: "2026-02-03T11:30:00Z",
  },
  {
    id: "4",
    flightNumber: "SP-202",
    route: "Dhaka → Dubai",
    departureTime: "2026-02-03T08:00:00Z",
    arrivalTime: "2026-02-03T11:30:00Z",
  },
];

export default function FlightsPage() {
  const handleBook = (flightId: string) => {
    alert(`Book flight ${flightId}`);
  };

  return (
    <div className="min-h-screen bg-base-300 px-10 py-20">
      <h1 className="text-4xl font-bold text-base-content mb-10">
        Available Flights
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {flights.map(flight => (
          <FlightCard
            key={flight.id}
            flight={flight}
            onBook={handleBook}
          />
        ))}
      </div>
    </div>
  );
}
