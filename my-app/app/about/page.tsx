// import { Link } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function AboutPage() {
  return (
    <main className="bg-base-100">
      {/* HERO */}
      <section className="bg-base-300 py-28">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-base-content">
            About <span className="bg-gradient-to-r from-[#9130f1] to-[#d79a50] bg-clip-text text-transparent">SkyPhonix</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-base-content/70">
            Redefining airline management with flexibility, affordability,
            and world-class service.
          </p>
        </div>
      </section>

      {/* ABOUT CONTENT */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          
          {/* Text */}
          <div>
            <h2 className="text-3xl text-base-content font-bold mb-6">
              Who We Are
            </h2>
            <p className="text-base-content/70 leading-relaxed mb-6">
              <span className="font-semibold text-base-content">SkyPhonix</span>{" "}
              is a next-generation airline management platform designed to make
              air travel smarter, more affordable, and highly flexible. We
              empower travelers to book flights with discounted rates while
              maintaining premium safety and comfort standards.
            </p>
            <p className="text-base-content/70 leading-relaxed">
              Whether you are planning a business trip or a vacation, SkyPhonix
              ensures a seamless booking experience backed by modern technology
              and reliable airline partnerships.
            </p>
          </div>

          {/* Stats / Cards */}
          <div className="grid grid-cols-2 gap-6">
            <div className="card bg-base-200 p-6 text-center shadow-md">
              <h3 className="text-3xl font-bold text-accent">50+</h3>
              <p className="mt-2 text-sm text-base-content/70">
                Global Destinations
              </p>
            </div>
            <div className="card bg-base-200 p-6 text-center shadow-md">
              <h3 className="text-3xl font-bold text-accent">30%</h3>
              <p className="mt-2 text-sm text-base-content/70">
                Average Discounts
              </p>
            </div>
            <div className="card bg-base-200 p-6 text-center shadow-md">
              <h3 className="text-3xl font-bold text-accent">24/7</h3>
              <p className="mt-2 text-sm text-base-content/70">
                Customer Support
              </p>
            </div>
            <div className="card bg-base-200 p-6 text-center shadow-md">
              <h3 className="text-3xl font-bold text-accent">100%</h3>
              <p className="mt-2 text-sm text-base-content/70">
                Secure Booking
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 bg-base-200">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl text-base-content font-bold mb-12">
            Why Choose SkyPhonix?
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="card bg-base-100 p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-base-content">
                Flexible Bookings
              </h3>
              <p className="text-base-content/70">
                Modify, reschedule, or cancel flights with minimal hassle.
                Travel plans should adapt to your life.
              </p>
            </div>

            <div className="card bg-base-100 text-base-content p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">
                Discounted Tickets
              </h3>
              <p className="text-base-content/70">
                Access exclusive deals and competitive pricing without
                compromising on comfort or safety.
              </p>
            </div>

            <div className="card bg-base-100 p-8 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-base-content">
                Premium Experience
              </h3>
              <p className="text-base-content/70">
                Enjoy a modern, intuitive platform backed by trusted airline
                partners worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl text-base-content font-bold mb-6">
            Fly Smarter with SkyPhonix
          </h2>
          <p className="text-base-content/70 mb-10">
            Book your next journey with confidence, flexibility, and unbeatable
            value.
          </p>
          <Link href={"/flights"} className="btn btn-accent rounded-2xl px-10">
            Explore Flights
          </Link>
        </div>
      </section>
    </main>
  );
}
