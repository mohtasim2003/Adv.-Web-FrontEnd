"use client";

import { useEffect, useState } from "react";
import FlightCard from "../../Component/FlightCard";
import api from "../hook/api";
// import api from "../lib/api"; // your axios instance

interface Flight {
  id: string;
  flightNumber: string;
  route: string;
  departureTime: string;
  arrivalTime: string;
}

export default function FlightsPage() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/customer/getallflight")
      .then(res => setFlights(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleBook = (flightId: string) => {
    console.log("Booking flight:", flightId);
    // later redirect to booking form
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

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
