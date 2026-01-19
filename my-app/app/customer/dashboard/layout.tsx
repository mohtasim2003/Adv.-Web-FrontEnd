"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { BookOpenText, House, Settings, ShieldUser } from "lucide-react";
import api from "@/app/customer/hook/api";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const goMyProfile = async () => {
    try {
      const res = await api.get("/customer/me");
      const me = res.data;
      const id = me.id || me._id;
      router.push(`/customer/dashboard/profile/${id}`);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Please login again");
      router.push("/customer/login");
    }
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content bg-accent-content">
        <nav className="navbar w-full bg-content border-b-2 border-accent/15">
          <label htmlFor="my-drawer-4" className="btn btn-square btn-ghost text-accent">
            
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="2" fill="none"
              stroke="currentColor" className="my-1.5 inline-block size-4 font-bold">
              <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
              <path d="M9 4v16"></path>
              <path d="M14 10l2 2l-2 2"></path>
            </svg>
          </label>
          <div className="px-4 text-4xl text-accent font-bold">My Dashboard</div>
        </nav>

       
        <div className="p-4">{children}</div>
      </div>

     
      <div className="drawer-side is-drawer-close:overflow-visible">
        <label htmlFor="my-drawer-4" className="drawer-overlay"></label>

        <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
          <ul className="menu w-full grow">
            <li>
              <button onClick={() => router.push("/")} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Homepage">
                <House size={17} className="text-accent" />
                <span className="is-drawer-close:hidden text-accent">Homepage</span>
              </button>
            </li>

            <li>
              <button onClick={() => router.push("/customer/dashboard/bookings")} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Booking">
                <BookOpenText size={17} className="text-accent" />
                <span className="is-drawer-close:hidden text-accent">My Booking</span>
              </button>
            </li>

            <li>
              <button onClick={goMyProfile} className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Profile">
                <ShieldUser size={20} className="text-accent" />
                <span className="is-drawer-close:hidden text-accent">Profile</span>
              </button>
            </li>

            <li>
              <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Settings">
                <Settings size={18} className="text-accent" />
                <span className="is-drawer-close:hidden text-accent">Settings</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
