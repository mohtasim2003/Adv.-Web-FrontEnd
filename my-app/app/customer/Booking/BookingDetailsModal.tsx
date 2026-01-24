"use client";

import React from "react";

type Props = {
  open: boolean;
  booking: any | null;
  onClose: () => void;
};

export default function BookingDetailsModal({
  open,
  booking,
  onClose,
}: Props) {
  if (!booking) return null;

  const flight = booking.flight;
  const passengers = booking.passengers || [];

  return (
    <dialog className={`modal ${open ? "modal-open" : ""}`}>
      <div className="modal-box bg-base-200 border border-accent/20 rounded-2xl shadow-2xl">
        <h3 className="font-bold text-xl text-accent mb-4">
          Flight Details
        </h3>

        {/* Flight Info */}
        <div className="space-y-2 text-sm">
          <p>
            <span className="font-semibold">Flight:</span>{" "}
            {flight?.flightNumber || "-"}
          </p>
          <p>
            <span className="font-semibold">Route:</span>{" "}
            {flight?.route || "-"}
          </p>
          <p>
            <span className="font-semibold">Departure:</span>{" "}
            {flight?.departureTime
              ? new Date(flight.departureTime).toLocaleString()
              : "-"}
          </p>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            <span className="badge badge-outline badge-accent">
              {booking.status}
            </span>
          </p>

        </div>

        {/* Passenger List */}
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Passengers</h4>
          {passengers.length === 0 ? (
            <p className="text-base-content/70">No passengers found</p>
          ) : (
            <ul className="list-disc pl-5 space-y-1">
              {passengers.map((p: any, idx: number) => (
                <li key={p.id || idx}>{p.name || "Unnamed Passenger"}</li>
              ))}
            </ul>
          )}
        </div>

        {/* Actions */}
        <div className="modal-action">
          <button className="btn btn-outline btn-accent" onClick={onClose}>
            Close
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
