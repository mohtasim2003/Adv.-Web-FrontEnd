import Link from "next/link";
import React from "react";

export default function Page() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col w-full">
        
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Welcome Back!</h1>
          <p className="mt-2 text-gray-400">
            Login to your account
          </p>
        </div>

        {/* Card */}
        <div className="card bg-base-100 w-full max-w-xl">
          <div className="card-body px-8 py-10">
            
            <fieldset className="fieldset space-y-4">

              <div>
                <label className="label font-medium">Email</label>
                <input
                  type="email"
                  className="input input-bordered w-full"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="label font-medium">Password</label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  placeholder="Enter your password"
                />
              </div>

              <div className="text-right">
                <a className="link link-hover text-sm">
                  Forgot password?
                </a>
              </div>

              <button className="btn btn-soft btn-accent w-full mt-6">
                Login
              </button>

              <p className="text-center text-sm mt-4">
                Don’t have an account?{" "}
                <Link href={"/registration"} className="link link-primary">Register</Link>
              </p>

            </fieldset>

          </div>
        </div>
      </div>
    </div>
  );
}
