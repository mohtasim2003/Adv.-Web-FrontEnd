"use client";
import React, { useEffect, useState } from "react";
import api from "../hook/api";
// import api from "../customer/hook/api"; // ✅ adjust if path differs

type Flight = {
  id: string;
  flightNumber: string;
  route: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
};

type Passenger = { name: string; passport: string };

export default function BookingModal({
  open,
  onClose,
  flight,
}: {
  open: boolean;
  onClose: () => void;
  flight: Flight | null;
}) {
  const [passengers, setPassengers] = useState<Passenger[]>([
    { name: "", passport: "" },
  ]);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (open) {
      setPassengers([{ name: "", passport: "" }]);
      setPaymentMethod("card");
      setErr("");
      setLoading(false);
    }
  }, [open, flight?.id]);

  const updatePassenger = (i: number, key: keyof Passenger, value: string) => {
    setPassengers((prev) => {
      const copy = [...prev];
      copy[i] = { ...copy[i], [key]: value };
      return copy;
    });
  };

  const addPassenger = () => setPassengers((p) => [...p, { name: "", passport: "" }]);
  const removePassenger = (i: number) => setPassengers((p) => p.filter((_, idx) => idx !== i));

  const submitBooking = async () => {
    if (!flight) return;

    if (passengers.some((p) => !p.name.trim() || !p.passport.trim())) {
      setErr("Please fill passenger name & passport.");
      return;
    }

    try {
      setLoading(true);
      setErr("");

      const payload = {
        flightId: flight.id,
        passengers,
        paymentMethod,
      };

      const res = await api.post("/customer/bookings", payload);
      console.log("Booking success ✅", res.data);

      onClose();
      alert("Booking Created ✅");
    } catch (e: any) {
      console.error("Booking failed ❌", e.response?.data || e);
      setErr(e?.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog className={`modal ${open ? "modal-open" : ""}`}>
      <div className="modal-box bg-base-200 border border-accent/20 rounded-2xl shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-accent">Book Flight</h3>
            <p className="text-sm text-base-content/70 mt-1">
              Enter passenger details and pay.
            </p>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-ghost">✕</button>
        </div>

        {flight && (
          <div className="mt-4 p-4 rounded-2xl bg-base-100 border border-accent/10">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-accent">{flight.route}</div>
                <div className="text-xs text-base-content/70">
                  Flight No: {flight.flightNumber}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-base-content/70">Total</div>
                <div className="text-2xl font-bold text-accent">${flight.price}</div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 flex items-center justify-between">
          <h4 className="font-semibold text-base-content">Passengers</h4>
          <button onClick={addPassenger} className="btn btn-sm btn-outline btn-accent">
            + Add
          </button>
        </div>

        <div className="mt-3 space-y-3">
          {passengers.map((p, i) => (
            <div key={i} className="p-4 rounded-2xl bg-base-100 border border-accent/10">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-base-content">Passenger {i + 1}</span>
                {passengers.length > 1 && (
                  <button onClick={() => removePassenger(i)} className="btn btn-xs btn-ghost text-error">
                    Remove
                  </button>
                )}
              </div>

              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  className="input input-bordered bg-base-200 border-accent/20 text-accent"
                  placeholder="Name"
                  value={p.name}
                  onChange={(e) => updatePassenger(i, "name", e.target.value)}
                />
                <input
                  className="input input-bordered bg-base-200 border-accent/20 text-accent"
                  placeholder="Passport"
                  value={p.passport}
                  onChange={(e) => updatePassenger(i, "passport", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 p-4 rounded-2xl bg-base-100 border border-accent/10">
          <h4 className="font-semibold text-base-content">Payment</h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {["card", "bkash", "nagad", "cash"].map((m) => (
              <button
                key={m}
                onClick={() => setPaymentMethod(m)}
                className={`btn btn-sm rounded-full ${
                  paymentMethod === m ? "btn-accent text-base-100" : "btn-outline btn-accent"
                }`}
                type="button"
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {err && <div className="mt-4 alert alert-error"><span>{err}</span></div>}

        <div className="modal-action">
          <button onClick={onClose} className="btn btn-ghost">Cancel</button>
          <button
            onClick={submitBooking}
            className="btn btn-accent text-base-100 rounded-full"
            disabled={loading || !flight}
          >
            {loading ? "Processing..." : "Pay & Confirm"}
          </button>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
