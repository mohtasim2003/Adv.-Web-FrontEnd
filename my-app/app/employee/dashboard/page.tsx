import Navbar from "@/app/Component/Navbar";

export default function DashboardPage() {
  return (
    <div className="container">
      <div style={{ height: 14 }} />
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Dashboard</h3>
        <p style={{ color: "var(--muted)" }}>
          Use Bookings to create, update, add passengers, payment, and check-in.
        </p>
      </div>
    </div>
  );
}
