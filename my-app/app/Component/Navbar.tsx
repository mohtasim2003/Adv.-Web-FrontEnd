
"use client";


import { LogIn, Plus } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import Image from "next/image";
import logo from '../../public/Logo.png'
import { usePathname } from "next/navigation";


export default function Navbar() {
    const pathname = usePathname();

const linkClass = (path: string) =>
  `relative px-2 py-1 transition-all ${
    pathname === path
      ? "after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-info"
      : ""
  }`;

   const links = (
  <>
    <li>
      <Link href="/" className={linkClass("/")}>
        Home
      </Link>
    </li>
    <li>
      <Link href="/about" className={linkClass("/about")}>
        About
      </Link>
    </li>
    <li>
      <Link href="/contact" className={linkClass("/contact")}>
        Contact
      </Link>
    </li>
  </>
);

  return (
  <div className="navbar bg-base-100 shadow-sm">
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
<Link href="/" className="flex items-center gap-0">
  <Image
    src={logo}
    alt="SkyPhoenix Logo"
    width={64}
    height={64}
    className="rounded"
  />
  <span className="text-xl font-semibold -ml-4">
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
    <a className="btn rounded-2xl btn-outline btn-info"><LogIn size={15} />Login</a>
    <a className="btn rounded-2xl btn-outline btn-info"><Plus size={15} />Sign up</a>
  </div>
</div>
  )
}
