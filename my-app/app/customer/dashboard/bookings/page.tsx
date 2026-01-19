"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import api from "@/app/customer/hook/api";
import Pusher from "pusher-js";

type Booking = {
  id: string;
  status?: string;
  bookingDate?: string;

  flight?: {
    id?: string;
    flightNumber?: string;
    route?: string;
    departureTime?: string;
  };

  passengers?: Array<{
    id?: string;
    name?: string;
  }>;
};

export default function Page() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string>("");

  // ✅ modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  // ✅ pusher toast state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // ✅ current user id for channel
  const [userId, setUserId] = useState<string | null>(null);

  const pusherRef = useRef<Pusher | null>(null);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setMsg("");
      const res = await api.get("/customer/bookings");
      setBookings(res.data || []);
    } catch (err: any) {
      console.error("Load bookings failed:", err?.response?.data || err);
      setMsg(err?.response?.data?.message || "Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ load userId once (for pusher channel)
  const loadMe = async () => {
    try {
      const meRes = await api.get("/customer/me");
      setUserId(meRes.data?.id || null);
    } catch {
      setUserId(null);
    }
  };

  useEffect(() => {
    loadMe();
    loadBookings();
  }, []);

  // ✅ pusher listener for cancel success
  useEffect(() => {
    if (!userId) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    pusherRef.current = pusher;

    const channelName = `user-${userId}`;
    const channel = pusher.subscribe(channelName);

    const handler = (data: any) => {
      setToastMsg(data?.message || "Updated ✅");
      setTimeout(() => setToastMsg(null), 2500);
    };

    // backend should trigger this event on cancel/delete
    channel.bind("booking-cancelled", handler);

    return () => {
      channel.unbind("booking-cancelled", handler);
      pusher.unsubscribe(channelName);
      pusher.disconnect();
      pusherRef.current = null;
    };
  }, [userId]);

  // ✅ NEW: flightId -> total passengers booked (for this user)
  const flightBookedCount = useMemo(() => {
    const map: Record<string, number> = {};

    for (const b of bookings) {
      const fid = b.flight?.id;
      if (!fid) continue;

      const count = b.passengers?.length || 0;
      map[fid] = (map[fid] || 0) + count;
    }

    return map;
  }, [bookings]);

  // ✅ open modal instead of confirm()
  const openCancelModal = (bookingId: string) => {
    setSelectedBookingId(bookingId);
    setConfirmOpen(true);
  };

  const closeCancelModal = () => {
    setConfirmOpen(false);
    setSelectedBookingId(null);
  };

  // ✅ confirm cancel
  const confirmCancel = async () => {
    if (!selectedBookingId) return;

    try {
      setMsg("");
      await api.delete(`/customer/bookings/${selectedBookingId}`);

      // ✅ no alert, no confirm
      // pusher toast will show if backend triggers it
      closeCancelModal();
      loadBookings();
    } catch (err: any) {
      console.error("Cancel booking failed:", err?.response?.data || err);
      setMsg(err?.response?.data?.message || "Cancel failed");
    }
  };

  const viewDetails = (bookingId: string) => {
    console.log("View details:", bookingId);
    setMsg(`Details clicked for booking: ${bookingId}`);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  return (
    <div className="p-2 lg:p-4">
      {/* ✅ Toast from pusher */}
      {toastMsg && (
        <div className="toast toast-top toast-end z-50">
          <div className="alert alert-success shadow-lg">
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* ✅ Confirm Modal */}
      <dialog className={`modal ${confirmOpen ? "modal-open" : ""}`}>
        <div className="modal-box bg-base-200 border border-accent/20 rounded-2xl shadow-2xl">
          <h3 className="font-bold text-lg text-accent">Cancel Booking</h3>
          <p className="py-2 text-base-content/70">
            Do you want delete the flight?
          </p>
          <div className="modal-action">
            <button className="btn btn-ghost" onClick={closeCancelModal}>
              Cancel
            </button>
            <button className="btn btn-error" onClick={confirmCancel}>
              OK
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={closeCancelModal}>close</button>
        </form>
      </dialog>

      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-accent">My Bookings</h1>
        <button
          className="btn btn-sm btn-outline btn-accent"
          onClick={loadBookings}
        >
          Refresh
        </button>
      </div>

      {msg && (
        <div className="mt-4 alert alert-info">
          <span>{msg}</span>
        </div>
      )}

      <div className="mt-4 bg-base-100 border border-accent/15 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="bg-base-200">
              <tr>
                <th>#</th>
                <th>Flight</th>
                <th>Route</th>
                <th>Date</th>
                <th>Status</th>
                <th>Passengers</th>
                <th>Flight Booked</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="p-6 text-center text-base-content/70">
                      No bookings found.
                    </div>
                  </td>
                </tr>
              ) : (
                bookings.map((b, idx) => {
                  const flightNo = b.flight?.flightNumber || b.flight?.id || "-";
                  const route = b.flight?.route || "-";

                  const date = b.bookingDate
                    ? new Date(b.bookingDate).toLocaleString()
                    : "-";

                  const passengerCount = b.passengers?.length || 0;

                  const fid = b.flight?.id;
                  const totalBookedForThisFlight = fid
                    ? flightBookedCount[fid] || 0
                    : 0;

                  return (
                    <tr key={b.id}>
                      <td>{idx + 1}</td>
                      <td className="font-semibold text-accent">{flightNo}</td>
                      <td>{route}</td>
                      <td>{date}</td>
                      <td>
                        <span className="badge badge-outline badge-accent">
                          {b.status || "unknown"}
                        </span>
                      </td>
                      <td>{passengerCount}</td>

                      <td>
                        <span className="badge badge-info">
                          {totalBookedForThisFlight}
                        </span>
                      </td>

                      <td className="text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            className="btn btn-xs btn-outline btn-accent"
                            onClick={() => viewDetails(b.id)}
                          >
                            Details
                          </button>

                          <button
                            className="btn btn-xs btn-outline btn-error"
                            onClick={() => openCancelModal(b.id)}
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
