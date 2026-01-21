"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import api from "../hook/empapi";

export default function page() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const normalizeBooking = (b: any) => {
    const flightObj = b?.flight ?? null;
    const customerObj = b?.customer ?? null;

    const flightId =
      typeof b?.flightId === "string"
        ? b.flightId
        : typeof flightObj?.id === "string"
          ? flightObj.id
          : null;

    const customerId =
      typeof b?.customerId === "string"
        ? b.customerId
        : typeof customerObj?.id === "string"
          ? customerObj.id
          : null;

    return {
      ...b,
      flightId,
      customerId,

      flight:
        typeof flightObj?.flightNumber === "string"
          ? flightObj.flightNumber
          : "-",
      customer:
        typeof customerObj?.name === "string"
          ? customerObj.name
          : typeof customerObj?.email === "string"
            ? customerObj.email
            : "-",
    };
  };


  const getBookingTime = (b: any): number | null => {
    const candidates = [
      b?.createdAt,
      b?.bookingDate,
      b?.date,
      b?.updatedAt,
      b?.created_at,
      b?.booking_date,
    ];

    for (const v of candidates) {
      if (typeof v === "string" || v instanceof Date) {
        const t = new Date(v).getTime();
        if (!Number.isNaN(t)) return t;
      }
      if (typeof v === "number" && Number.isFinite(v)) {
        return v < 10_000_000_000 ? v * 1000 : v;
      }
    }
    return null;
  };

  const load = async () => {
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await api.get("/employee/bookings");
      const data = Array.isArray(res.data) ? res.data : [];

      const normalized = data.map(normalizeBooking);

      const sorted = [...normalized].sort((a, b) => {
        const ta = getBookingTime(a);
        const tb = getBookingTime(b);

        if (ta !== null && tb !== null) return tb - ta;

        if (ta === null && tb !== null) return 1;
        if (ta !== null && tb === null) return -1;

        return 0;
      });

      setBookings(sorted);
    } catch (err: any) {
      console.error("Bookings error:", {
        status: err?.response?.status,
        data: err?.response?.data,
        message: err?.message,
      });
      setErrorMsg(err?.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-4">
      <div className="bg-base-100 p-6 rounded-2xl shadow">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <h2 className="text-2xl font-bold text-accent"> Bookings</h2>

          <button className="btn btn-outline" onClick={load}>
            Refresh
          </button>
        </div>

        {loading && <p className="mt-4 text-accent">Loading bookings...</p>}

        {!loading && errorMsg && (
          <div className="alert alert-error mt-4">
            <span>{errorMsg}</span>
          </div>
        )}

        {!loading && !errorMsg && bookings.length === 0 && (
          <div className="alert alert-info mt-4">
            <span>No bookings found.</span>
          </div>
        )}

        {!loading && !errorMsg && bookings.length > 0 && (
          <div className="overflow-x-auto mt-4">
            <table className="table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Status</th>
                  <th>Flight ID</th>
                  <th>Flight No</th>
                  <th>Customer ID</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((b) => {
                  const id = String(b.id ?? b.bookingId ?? b._id);

                  return (
                    <tr key={id}>
                      <td className="text-accent font-semibold">{id}</td>
                      <td>{b.status ?? "-"}</td>
                      <td>{b.flightId ?? "-"}</td>
                      <td>{b.flight ?? "-"}</td>
                      <td>{b.customerId ?? "-"}</td>
                      <td>
                        <Link
                          className="btn btn-sm btn-primary"
                          href={`/employee/bookings/${id}`}
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
