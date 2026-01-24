"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import {
  ArrowLeft,
  Users,
  CreditCard,
  Trash2,
  UserPlus,
  BadgeCheck,
  RefreshCcw,
} from "lucide-react";

const empAxios = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:3000",
});

empAxios.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("employee_token");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

function getErrMsg(err: unknown, fallback = "Request failed") {
  const e = err as AxiosError<any>;
  return (e?.response?.data as any)?.message || e?.message || fallback;
}

function getStatus(err: unknown) {
  const e = err as AxiosError<any>;
  return e?.response?.status;
}

export default function Page() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const bookingId = useMemo(() => params?.id ?? "", [params?.id]);

  const [booking, setBooking] = useState<any>(null);
  const [passengers, setPassengers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [status, setStatus] = useState("");

  const [pName, setPName] = useState("");
  const [pPassport, setPPassport] = useState("");

  const [amount, setAmount] = useState<number | "">("");
  const [method, setMethod] = useState("");

  const loadAll = async () => {
    if (!bookingId) return;

    setLoading(true);
    setErrorMsg("");

    try {
      // Booking
      const b = await empAxios.get(`/employee/bookings/${bookingId}`);
      setBooking(b.data);
      setStatus(b.data?.status ?? "");

      // Passengers
      const p = await empAxios.get(
        `/employee/bookings/${bookingId}/passengers`,
      );
      setPassengers(Array.isArray(p.data) ? p.data : []);
    } catch (err) {
      console.error("Load booking failed:", err);
      setErrorMsg(getErrMsg(err, "Failed to load booking"));

      if (getStatus(err) === 401) {
        alert("Unauthorized. Please login again.");
        router.push("/employee/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [bookingId]);

  const updateStatus = async () => {
    if (!status.trim()) {
      alert("Status is required");
      return;
    }
    try {
      await empAxios.patch(`/employee/bookings/${bookingId}/status`, {
        status: status.trim(),
      });
      alert("Status updated");
      await loadAll();
    } catch (err) {
      console.error("Update status failed:", err);
      alert(getErrMsg(err, "Failed to update status"));
    }
  };

  const addPassenger = async () => {
    if (!pName.trim() || !pPassport.trim()) {
      alert("Passenger name and passport number are required");
      return;
    }
    try {
      await empAxios.post(`/employee/bookings/${bookingId}/passengers`, [
        { name: pName.trim(), passport: pPassport.trim() },
      ]);
      setPName("");
      setPPassport("");
      alert("Passenger added");
      await loadAll();
    } catch (err) {
      console.error("Add passenger failed:", err);
      alert(getErrMsg(err, "Failed to add passenger"));
    }
  };

  const deletePassenger = async (passengerId: string) => {
    try {
      await empAxios.delete(
        `/employee/bookings/${bookingId}/passengers/${passengerId}`,
      );
      alert("Passenger deleted");
      await loadAll();
    } catch (err) {
      console.error("Delete passenger failed:", err);
      alert(getErrMsg(err, "Failed to delete passenger"));
    }
  };

  const addPayment = async () => {
    const amt = typeof amount === "string" ? Number(amount) : amount;

    if (!amt || Number.isNaN(amt) || amt < 1) {
      alert("Amount must be at least 1");
      return;
    }
    if (!method.trim()) {
      alert("Payment method is required");
      return;
    }

    try {
      await empAxios.post(`/employee/bookings/${bookingId}/payment`, {
        amount: amt,
        method: method.trim(),
      });
      setAmount("");
      setMethod("");
      alert("Payment added");
      await loadAll();
    } catch (err) {
      console.error("Add payment failed:", err);
      alert(getErrMsg(err, "Failed to add payment"));
    }
  };

  const checkin = async () => {
    try {
      await empAxios.post(`/employee/checkin`, { bookingId });
      alert("Check-in successful");
      await loadAll();
    } catch (err) {
      console.error("Check-in failed:", err);
      alert(getErrMsg(err, "Check-in failed"));
    }
  };

  const deleteBooking = async () => {
    const ok = confirm("Are you sure you want to delete this booking?");
    if (!ok) return;

    try {
      await empAxios.delete(`/employee/bookings/${bookingId}`);
      alert("Booking deleted");
      router.push("/employee/bookings");
    } catch (err) {
      console.error("Delete booking failed:", err);
      alert(getErrMsg(err, "Failed to delete booking"));
    }
  };

  return (
    <div className="drawer lg:drawer-open">
      <input
        id="emp-view-booking-drawer"
        type="checkbox"
        className="drawer-toggle"
      />

      <div className="drawer-content bg-accent-content">
        <nav className="navbar w-full bg-base-300">
          <label
            htmlFor="emp-view-booking-drawer"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost text-accent"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
              className="my-1.5 inline-block size-4"
            >
              <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
              <path d="M9 4v16"></path>
              <path d="M14 10l2 2l-2 2"></path>
            </svg>
          </label>

          <div className="px-4 text-accent font-semibold">
            Employee • View Booking
          </div>

          <div className="ml-auto px-4 flex gap-2">
            <button
              className="btn btn-ghost text-accent"
              onClick={() => router.push("/employee/bookings")}
            >
              <ArrowLeft size={18} /> Back
            </button>
            <button className="btn btn-outline" onClick={loadAll}>
              <RefreshCcw size={18} /> Refresh
            </button>
          </div>
        </nav>

        <div className="p-4 text-accent space-y-6">
          {loading && (
            <div className="bg-base-100 p-6 rounded-2xl shadow">
              Loading booking...
            </div>
          )}

          {!loading && errorMsg && (
            <div className="alert alert-error">
              <span>{errorMsg}</span>
            </div>
          )}

          {!loading && !errorMsg && (
            <>
              <div className="bg-base-100 p-6 rounded-2xl shadow space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h2 className="text-2xl font-bold">Booking Details</h2>
                    <p className="text-base-content/70 text-sm">
                      Booking ID:{" "}
                      <span className="font-semibold">{bookingId}</span>
                    </p>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <button className="btn btn-secondary" onClick={checkin}>
                      <BadgeCheck size={18} /> Check-in
                    </button>
                    <button className="btn btn-error" onClick={deleteBooking}>
                      <Trash2 size={18} /> Delete
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-base-200 p-4 rounded-xl">
                    <p className="text-sm text-base-content/70">Flight ID</p>
                    <p className="font-semibold">
                      {booking?.flightId ?? booking?.flight?.id ?? "-"}
                    </p>
                    <p className="text-xs text-base-content/70 mt-1">
                      Flight No: {booking?.flight?.flightNumber ?? "-"}
                    </p>
                    <p className="text-xs text-base-content/70">
                      Route: {booking?.flight?.route ?? "-"}
                    </p>
                  </div>

                  <div className="bg-base-200 p-4 rounded-xl">
                    <p className="text-sm text-base-content/70">Customer ID</p>
                    <p className="font-semibold">
                      {booking?.customerId ?? booking?.customer?.id ?? "-"}
                    </p>
                    <p className="text-xs text-base-content/70 mt-1">
                      Customer:{" "}
                      {booking?.customer?.name ??
                        booking?.customer?.email ??
                        "-"}
                    </p>
                  </div>
                </div>

                <div className="bg-base-200 p-4 rounded-xl">
                  <p className="text-sm text-base-content/70 mb-2">
                    Update Status
                  </p>
                  <div className="flex gap-2 flex-wrap items-center">
                    <input
                      className="input input-bordered w-full max-w-xs"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      placeholder="e.g. confirmed / cancelled / checked-in"
                    />
                    <button className="btn btn-primary" onClick={updateStatus}>
                      Update
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-base-100 p-6 rounded-2xl shadow">
                  <div className="flex items-center gap-2">
                    <CreditCard className="text-accent" />
                    <h3 className="text-xl font-bold">Add Payment</h3>
                  </div>

                  <div className="mt-4 space-y-3">
                    <input
                      className="input input-bordered w-full"
                      type="number"
                      min={1}
                      placeholder="Amount (min 1)"
                      value={amount}
                      onChange={(e) =>
                        setAmount(
                          e.target.value === "" ? "" : Number(e.target.value),
                        )
                      }
                    />
                    <input
                      className="input input-bordered w-full"
                      placeholder="Method (cash/card/bkash)"
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                    />
                    <button
                      className="btn btn-primary w-full"
                      onClick={addPayment}
                    >
                      Add Payment
                    </button>
                  </div>
                </div>

                <div className="bg-base-100 p-6 rounded-2xl shadow">
                  <div className="flex items-center gap-2">
                    <UserPlus className="text-accent" />
                    <h3 className="text-xl font-bold">Add Passenger</h3>
                  </div>

                  <div className="mt-4 space-y-3">
                    <input
                      className="input input-bordered w-full"
                      placeholder="Passenger Name"
                      value={pName}
                      onChange={(e) => setPName(e.target.value)}
                    />
                    <input
                      className="input input-bordered w-full"
                      placeholder="Passport Number"
                      value={pPassport}
                      onChange={(e) => setPPassport(e.target.value)}
                    />
                    <button
                      className="btn btn-primary w-full"
                      onClick={addPassenger}
                    >
                      Add Passenger
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-base-100 p-6 rounded-2xl shadow">
                <div className="flex items-center gap-2">
                  <Users className="text-accent" />
                  <h3 className="text-xl font-bold">Passenger List</h3>
                </div>

                <div className="overflow-x-auto mt-4">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Passenger ID</th>
                        <th>Name</th>
                        <th>Passport</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {passengers.map((p) => {
                        const pid = String(p.id ?? p._id ?? p.passengerId);
                        return (
                          <tr key={pid}>
                            <td>{pid}</td>
                            <td>{p.name ?? "-"}</td>
                            <td>{p.passport ?? "-"}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-error"
                                onClick={() => deletePassenger(pid)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}

                      {passengers.length === 0 && (
                        <tr>
                          <td colSpan={4} className="text-base-content/70">
                            No passengers found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label
          htmlFor="emp-view-booking-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
          <ul className="menu w-full grow">
            <li>
              <button
                onClick={() => router.push("/employee/bookings")}
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Bookings"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2"
                  fill="none"
                  stroke="currentColor"
                  className="my-1.5 inline-block size-4 text-accent"
                >
                  <path d="M9 6h11"></path>
                  <path d="M9 12h11"></path>
                  <path d="M9 18h11"></path>
                  <path d="M5 6h.01"></path>
                  <path d="M5 12h.01"></path>
                  <path d="M5 18h.01"></path>
                </svg>
                <span className="is-drawer-close:hidden text-accent">
                  Bookings
                </span>
              </button>
            </li>
          </ul>

          <div className="w-full p-2">
            <button
              className="btn btn-error w-full is-drawer-close:btn-square"
              onClick={() => {
                localStorage.removeItem("employee_token");
                router.push("/employee/login");
              }}
            >
              <span className="is-drawer-close:hidden">Logout</span>
              <span className="is-drawer-open:hidden">⎋</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
