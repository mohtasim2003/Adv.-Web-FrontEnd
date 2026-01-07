// import { Link } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Page() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col w-full">
        
        {/* Title */}
        <div className="text-center">
          <h1 className="text-4xl font-bold">Register Now!</h1>
          <p className="mt-2 text-gray-400">
            Create your account to get started
          </p>
        </div>

        {/* Wider Card */}
        <div className="card bg-base-100 w-full max-w-xl shadow-2xl">
          <div className="card-body px-8 py-10">
            
            <fieldset className="fieldset">
              
              <div>
                <label className="label font-medium">Full Name</label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Enter your name"
                />
              </div>

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
                  placeholder="Create a password"
                />
              </div>

              <div>
                <label className="label font-medium">Confirm Password</label>
                <input
                  type="password"
                  className="input input-bordered w-full"
                  placeholder="Confirm password"
                />
              </div>

              <button className="btn btn-soft w-full mt-6">
                Register
              </button>

              <p className="text-center text-sm mt-4">
                Already have an account?{" "}
                <Link href={"/login"} className="link link-primary">Login</Link>
              </p>

            </fieldset>

          </div>
        </div>
      </div>
    </div>
  );
}
