
"use client";
import { Contact, House, LayoutDashboard, LogIn, MessageCircleWarning, Plane, Plus } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import logo from '../../../public/Logo.png';
import logo2 from '../../../public/ll.png';
import logo3 from '../../../public/tt.png';
import logo4 from '../../../public/rr.png';
import { usePathname, useRouter } from "next/navigation";
import api from '../../customer/hook/api';
// import LoginToast from './LoginToast';
// import { useAuth } from '../auth/AuthContext';
// import api from '../customer/hook/api';


export default function Navbar() {
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
    const router = useRouter();

    const [toastMsg, setToastMsg] = useState<string | null>(null);


  
 useEffect(() => {
  const checkLogin = async () => {
    setLoading(true);
    try {
      const res = await api.get("/customer/me");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  checkLogin();
}, [pathname]); 

useEffect(() => {
  const msg = sessionStorage.getItem("loginToast");
  if (msg) {
    setToastMsg(msg);
    sessionStorage.removeItem("loginToast");
    setTimeout(() => setToastMsg(null), 2000); // 2 seconds
  }
}, [pathname]);



const logout = async () => {
  try {
    setUser(null);
    await api.post("/customer/logout");
    router.replace("/login");
  } catch (err) {
    console.error(err);
  }
};


const linkClass = (path: string) =>
  `relative px-2 py-1 transition-all ${
    pathname === path
      ? "after:absolute after:left-0 after:-bottom-4 after:h-[2px] after:w-full after:bg-accent"
      : ""
  }`;

   const links = (
  <div className='space-x-4'>
    <li className='text-accent font-semibold btn p-0 btn-outline'>
      <Link href="/" className={linkClass("/")}>
        <House size={15} />Home
      </Link>
    </li>
    <li className='text-accent font-semibold btn p-0 btn-outline'>
      <Link href="/about" className={linkClass("/about")}>
        <MessageCircleWarning size={15} />About
      </Link>
    </li>
    <li className='text-accent font-semibold btn p-0 btn-outline'>
      <Link href="/contact" className={linkClass("/contact")}>
        <Contact size={15} />Contact
      </Link>
    </li>
    <li className='text-accent font-semibold btn p-0 btn-outline'>
      <Link href="/customer/flights" className={linkClass("/customer/flights")}>
        <Plane size={15} />Flights
      </Link>
    </li>
    { user && (
        <li className="text-accent font-semibold btn p-0 btn-outline">
          <Link href="/customer/dashboard" className={linkClass("/customer/dashboard")}>
            <LayoutDashboard size={15} />Dashboard
          </Link>
        </li>
      )}
  </div>
);

  return (
  <div className="navbar bg-base-300 shadow-xl">
     {toastMsg && (
  <div className="toast toast-top toast-end z-50">
    <div className="alert alert-success shadow-lg">
      <span>{toastMsg}</span>
    </div>
  </div>
)}

  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
      </div>
      <ul
        tabIndex={-1}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        
        {links}
      </ul>
    </div>
<Link href="/" className="flex items-center gap-2">
  <Image
    src={logo4}
    alt="SkyPhoenix Logo"
    width={64}
    height={64}
    className="rounded"
  />
  <span className="text-xl font-semibold -ml-4 bg-gradient-to-r from-[#9130f1] to-[#d79a50] bg-clip-text text-transparent">
  SkyPhoenix
</span>

</Link>

  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1">
      {links}
    </ul>
  </div>
  
  <div className="navbar-end space-x-4">
    <label className="swap swap-rotate">
  {/* this hidden checkbox controls the state */}
  <input type="checkbox" className="theme-controller" value="sunset" />

  {/* sun icon */}
  <svg
    className="swap-on h-10 w-10 fill-current text-accent"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24">
    <path
      d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
  </svg>

  {/* moon icon */}
  <svg
    className="swap-off h-10 w-10 fill-current text-accent"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24">
    <path
      d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
  </svg>
</label>
     {!user && (
          <>
            <Link href="/login" className="btn rounded-2xl btn-outline btn-accent">
              <LogIn size={15} /> Login
            </Link>
            <Link href="/customer/registration" className="btn rounded-2xl btn-outline btn-accent">
              <Plus size={15} /> Sign up
            </Link>
          </>
        )}

        {user && (
          <button
            onClick={logout}
            className="btn rounded-2xl btn-outline btn-accent"
          >
            Logout
          </button>
        )}
  </div>
</div>
  )
}
