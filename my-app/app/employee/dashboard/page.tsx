"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ClipboardList } from "lucide-react";

export default function Page() {
  const router = useRouter();

  const goBookings = () => router.push("/employee/bookings");

  const logout = () => {
    localStorage.removeItem("employee_token");

    localStorage.removeItem("token");

    router.push("/login");
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="emp-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content bg-accent-content">
        {/* Navbar */}
        <nav className="navbar w-full bg-base-300">
          <label
            htmlFor="emp-drawer"
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
              <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" />
              <path d="M9 4v16" />
              <path d="M14 10l2 2l-2 2" />
            </svg>
          </label>

          <div className="px-4 text-accent font-semibold">
            Employee Dashboard
          </div>
        </nav>

        <div className="p-6">
          <button className="btn btn-primary" onClick={goBookings}>
            <ClipboardList size={18} />
            View Bookings
          </button>
        </div>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label
          htmlFor="emp-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <div className="flex min-h-full flex-col bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
          <ul className="menu w-full grow">
            <li>
              <button
                onClick={() => router.push("/")}
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Homepage"
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
                  <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
                  <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
                <span className="is-drawer-close:hidden text-accent">
                  Homepage
                </span>
              </button>
            </li>

            <li>
              <button
                onClick={goBookings}
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Bookings"
              >
                <ClipboardList className="text-accent" size={20} />
                <span className="is-drawer-close:hidden text-accent">
                  Bookings
                </span>
              </button>
            </li>
          </ul>

          <div className="w-full p-2">
            <button
              className="btn btn-error w-full is-drawer-close:btn-square"
              onClick={logout}
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