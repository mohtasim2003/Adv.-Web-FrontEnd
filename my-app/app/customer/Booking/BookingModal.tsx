"use client";
import React, { useEffect, useRef, useState } from "react";
import api from "../hook/api";
import Pusher from "pusher-js";

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

  // ✅ toast from pusher
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // ✅ keep pusher instance
  const pusherRef = useRef<Pusher | null>(null);

  // ✅ store user id so we can subscribe like ProfileClient
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setPassengers([{ name: "", passport: "" }]);
      setPaymentMethod("card");
      setErr("");
      setLoading(false);
      setToastMsg(null);

      // ✅ get logged in user id (same idea as ProfileClient)
      (async () => {
        try {
          const me = await api.get("/customer/me");
          setUserId(me.data?.id || null);
        } catch {
          setUserId(null);
        }
      })();
    } else {
      setUserId(null);
    }
  }, [open, flight?.id]);

  // ✅ PUSHER LISTENER (like your ProfileClient)
  useEffect(() => {
    if (!open) return;
    if (!userId) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    pusherRef.current = pusher;

    const channelName = `user-${userId}`;
    const channel = pusher.subscribe(channelName);

    const handler = (data: any) => {
      setToastMsg(data?.message || "Flight Booked successfully ✅");

      // ✅ close modal after showing toast
      setTimeout(() => {
        setToastMsg(null);
        onClose();
      }, 1200);
    };

    // ✅ backend must trigger this event name
    channel.bind("booking-created", handler);

    return () => {
      channel.unbind("booking-created", handler);
      pusher.unsubscribe(channelName);
      pusher.disconnect();
      pusherRef.current = null;
    };
  }, [open, userId, onClose]);

  const updatePassenger = (i: number, key: keyof Passenger, value: string) => {
    setPassengers((prev) => {
      const copy = [...prev];
      copy[i] = { ...copy[i], [key]: value };
      return copy;
    });
  };

  const addPassenger = () =>
    setPassengers((p) => [...p, { name: "", passport: "" }]);
  const removePassenger = (i: number) =>
    setPassengers((p) => p.filter((_, idx) => idx !== i));

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

      // ❌ no alert here
      // ✅ toast will show ONLY when pusher event arrives
    } catch (e: any) {
      console.error("Booking failed ❌", e.response?.data || e);
      setErr(e?.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog className={`modal ${open ? "modal-open" : ""}`}>
      {/* ✅ toast (does not change your design) */}
      {toastMsg && (
        <div className="toast toast-top toast-end z-50">
          <div className="alert alert-success shadow-lg">
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      <div className="modal-box bg-base-200 border border-accent/20 rounded-2xl shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-accent">Book Flight</h3>
            <p className="text-sm text-base-content/70 mt-1">
              Enter passenger details and pay.
            </p>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-ghost">
            ✕
          </button>
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
                <div className="text-2xl font-bold text-accent">
                  ${flight.price}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 flex items-center justify-between">
          <h4 className="font-semibold text-base-content">Passengers</h4>
          <button
            onClick={addPassenger}
            className="btn btn-sm btn-outline btn-accent"
          >
            + Add
          </button>
        </div>

        <div className="mt-3 space-y-3">
          {passengers.map((p, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-base-100 border border-accent/10"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-base-content">
                  Passenger {i + 1}
                </span>
                {passengers.length > 1 && (
                  <button
                    onClick={() => removePassenger(i)}
                    className="btn btn-xs btn-ghost text-error"
                  >
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
                  paymentMethod === m
                    ? "btn-accent text-base-100"
                    : "btn-outline btn-accent"
                }`}
                type="button"
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {err && (
          <div className="mt-4 alert alert-error">
            <span>{err}</span>
          </div>
        )}

        <div className="modal-action">
          <button onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
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
