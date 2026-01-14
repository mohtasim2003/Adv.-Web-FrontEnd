"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../hook/api";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/customer/login", { email, password });
      if (res.data) {
        router.push("/"); 
      }
    } catch (err: any) {
      console.error(err.response?.data);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col w-full max-w-xl">
        <h1 className="text-4xl font-bold text-accent">Welcome Back!</h1>
        <p className="mt-2 text-accent">Login to your account</p>

        <div className="card bg-neutral w-full mt-6">
          <div className="card-body px-8 py-10">
            <div className="space-y-4">
              <div>
                <label className="label font-medium text-accent">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input input-bordered w-full bg-accent-content/10"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="label font-medium text-accent">Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="input input-bordered w-full bg-accent-content/10"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <p className="text-red-500">{error}</p>}

              <button
                className="btn btn-accent w-full mt-6"
                onClick={handleLogin}
              >
                Login
              </button>

              <p className="text-center text-sm mt-4">
                Don’t have an account?{" "}
                <a href="/customer/registration" className="link text-accent">
                  Register
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
