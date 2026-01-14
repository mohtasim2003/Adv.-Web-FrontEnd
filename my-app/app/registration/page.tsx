// import { Link } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Page() {
  return (
    <div className="hero min-h-screen bg-base-100">
      <div className="hero-content flex-col w-full">
        
        {/* Title */}
        <div className="text-center">
          <h1 className="text-4xl text-accent font-bold">Register Now!</h1>
          <p className="mt-2 text-accent font-bold">
            Create your account to get started
          </p>
        </div>
        
        {/* Wider Card */}
        <div className="card bg-neutral w-full max-w-xl shadow-2xl">
          <div className="card-body px-8 py-10">
            
            <fieldset className="fieldset">
              
              <div>
                <label className="label font-bold text-accent">Full Name</label>
                <input
                  type="text"
                  className="input input-bordered w-full bg-accent-content/10"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="label font-bold text-accent">Email</label>
                <input
                  type="email"
                  className="input input-bordered w-full bg-accent-content/10"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="label font-bold text-accent">Password</label>
                <input
                  type="password"
                  className="input input-bordered w-full bg-accent-content/10"
                  placeholder="Create a password"
                />
              </div>

              <div>
                <label className="label font-bold text-accent">Confirm Password</label>
                <input
                  type="password"
                  className="input input-bordered w-full bg-accent-content/10"
                  placeholder="Confirm password"
                />
              </div>

              <button className="btn btn-accent w-full mt-6">
                Register
              </button>

              <p className="text-center text-sm mt-4">
                Already have an account?{" "}
                <Link href={"/login"} className="link text-accent">Login</Link>
              </p>

            </fieldset>

          </div>
        </div>
      </div>
    </div>
  );
}
