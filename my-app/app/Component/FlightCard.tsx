import { Plane } from "lucide-react";
import React from "react";

interface Flight {
  id: string;
  flightNumber: string;
  route: string;
  departureTime: string;
  arrivalTime: string;
  price:number;
}

interface Props {
  flight: Flight;
  onBook: (flightId: string) => void;
}

export default function FlightCard({ flight, onBook }: Props) {
  return (
    <div className="bg-base-300 border border-accent rounded-2xl p-6 shadow-md hover:shadow-xl transition">
      {/* Route */}
      <h2 className="text-xl font-semibold text-accent">
        {flight.route}
      </h2>

      {/* Flight Number */}
      <p className="text-base-content text-sm mt-1">
        Flight No: {flight.flightNumber}
      </p>

      {/* Time */}
      <div className="text-base-content text-sm mt-4 space-y-1">
        <p>
          Departure:{" "}
          {new Date(flight.departureTime).toLocaleString()}
        </p>
        <p>
          Arrival:{" "}
          {new Date(flight.arrivalTime).toLocaleString()}
        </p>
      </div>
      {/* Price */}
<div className="mt-4 flex items-center justify-between w-full border border-accent/30 rounded-xl px-5 py-1">
  <span className="text-sm text-base-content/70 uppercase tracking-wide font-bold">
    Price
  </span>

  <span className="text-2xl font-bold text-accent">
    ${flight.price}
  </span>
</div>

      {/* Book Button */}
      <button
        onClick={() => onBook(flight.id)}
        className="btn btn-outline btn-accent text-base-content w-full mt-6 rounded-full"
      >
        Book Flight<Plane size={15}></Plane>
      </button>
    </div>
  );
}
