"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../hook/api";
import { z } from "zod";


const registerSchema = z
  .object({
    name: z.string().min(1, "Full Name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email"),
   password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),

    confirmPassword: z.string().min(1, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FieldErrors = Partial<Record<"name" | "email" | "password" | "confirmPassword", string>>;

export default function Page() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

 
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const handleRegister = async () => {
    setError("");
    setFieldErrors({});

    
    const result = registerSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!result.success) {
      const errs: FieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (key && !errs[key]) errs[key] = issue.message;
      }
      setFieldErrors(errs);
      return;
    }

    try {
      const res = await api.post("/customer/register", {
        name,
        email,
        password,
      });

      const newName = res.data?.user?.name || name;
      sessionStorage.setItem(
        "loginToast",
        `Registration successful${newName ? `, ${newName}` : ""}! Please login.`
      );

      router.push("/login");
    } catch (error: any) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="hero min-h-screen bg-base-100">
      <div className="hero-content flex-col w-full">
        <div className="text-center">
          <h1 className="text-4xl text-accent font-bold">Register Now!</h1>
          <p className="mt-2 text-accent font-bold">
            Create your account to get started
          </p>
        </div>

        <div className="card bg-base-300 w-full max-w-xl shadow-2xl">
          <div className="card-body px-8 py-10">
            <fieldset className="fieldset">
              <div>
                <label className="label font-bold text-accent">Full Name</label>
                <input
                  type="text"
                  className="input input-bordered w-full bg-accent-content/10"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {fieldErrors.name && (
                  <p className="text-red-500 mt-1 text-sm">{fieldErrors.name}</p>
                )}
              </div>

              <div>
                <label className="label font-bold text-accent">Email</label>
                <input
                  type="email"
                  className="input input-bordered w-full bg-accent-content/10"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {fieldErrors.email && (
                  <p className="text-red-500 mt-1 text-sm">{fieldErrors.email}</p>
                )}
              </div>

              <div>
                <label className="label font-bold text-accent">Password</label>
                <input
                  type="password"
                  className="input input-bordered w-full bg-accent-content/10"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {fieldErrors.password && (
                  <p className="text-red-500 mt-1 text-sm">{fieldErrors.password}</p>
                )}
              </div>

              <div>
                <label className="label font-bold text-accent">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="input input-bordered w-full bg-accent-content/10"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {fieldErrors.confirmPassword && (
                  <p className="text-red-500 mt-1 text-sm">
                    {fieldErrors.confirmPassword}
                  </p>
                )}
              </div>

              {error && <p className="text-red-500 mt-2">{error}</p>}

              <button
                onClick={handleRegister}
                className="btn btn-accent w-full mt-6"
              >
                Register
              </button>

              <p className="text-center text-sm mt-4">
                Already have an account?{" "}
                <Link href="/login" className="link text-accent">
                  Login
                </Link>
              </p>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  );
}
