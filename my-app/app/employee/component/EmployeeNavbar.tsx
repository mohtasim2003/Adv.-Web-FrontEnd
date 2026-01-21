"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../hook/empapi";

interface Employee {
  name: string;
  email: string;
}

export default function EmployeeNavbar() {
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    api
      .get("/employee/me")
      .then((res) => {
        setEmployee(res.data.employee || res.data);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          // ❌ Not logged in as employee → go to login
          localStorage.removeItem("auth_role");
          router.push("/login");
        }
      });
  }, [router]);

  const logout = async () => {
    try {
      await api.post("/employee/logout");
    } catch {}

    localStorage.removeItem("auth_role");
    router.push("/");
  };

  return (
    <div className="navbar bg-base-300 px-4">
      <div className="flex-1">
        <button
          className="btn btn-ghost text-xl"
          onClick={() => router.push("/employee/dashboard")}
        >
          Employee Portal
        </button>
      </div>

      <div className="flex-none gap-2">
        {employee && <span className="mr-4">Hi, {employee.name}</span>}

        <button
          className="btn btn-primary"
          onClick={() => router.push("/employee/bookings")}
        >
          Bookings
        </button>

        <button className="btn btn-error" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
