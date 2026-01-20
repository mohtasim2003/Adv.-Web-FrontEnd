'use client'
//import Head from '../components/header'
//import Foot from '../components/footer'
import { useEffect, useState } from 'react';
import axios from 'axios';
import {useRouter} from 'next/navigation';
import Navbar from '../../Component/Navbar';
//import Head2 from '../components/header2';
import * as z from 'zod';
import Navbar2 from '../Component/Navbar';

function AllFlights() {
    const router = useRouter();
    const [flights, setFlights] = useState<any[]>([]);
    const [authStatus, setAuthStatus] = useState<string>("");
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const res = await axios.get(
                    process.env.NEXT_PUBLIC_API_ENDPOINT + "/admin/getallflight",
                    { withCredentials: true }
                );
                setFlights(res.data);
                setAuthStatus("Authenticated as admin");
            } catch (err: any) {
                if (err.response && err.response.status === 401) {
                    setAuthStatus("Not authenticated or token expired");
                } else if (err.response && err.response.status === 403) {
                    setAuthStatus("Not authorized: Not an admin");
                } else {
                    setAuthStatus("Error fetching data");
                }
                if (authStatus !== "Authenticated as admin") {
                    router.push('/login');
                }
                setFlights([]);
            }
        };
        fetchFlights();
    }, []);

    const handleDelete = async (id: string, aircraftId?: string) => {
        try {
            if (aircraftId) {
                await axios.delete(
                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/aircraft/${aircraftId}/flight/${id}`,
                    { withCredentials: true }
                );
            } else {
                await axios.delete(
                    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/flight/${id}`,
                    { withCredentials: true }
                );
            }
            setFlights((prev) => prev.filter(flight => flight.id !== id));
        } catch (err) {
            setError("Failed to delete flight.");
        }
    };

    const handleViewCrew = async (flightId: string) => {
        try {
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_ENDPOINT}/admin/flights/${flightId}/crew`,
                { withCredentials: true }
            );
            alert(`Crew for flight ${flightId}:\n` + res.data.map((c: any) => c.email).join("\n"));
        } catch (err) {
            setError("Failed to fetch crew.");
        }
    };

    const handleAssignCrew = (flightId: string) => {
        router.push(`/admin/flights/assign-crew/${flightId}`);
    };

    return (
        <>
            <Navbar2 />
            <div>
                <h1 className="text-4xl font-bold text-center mt-10">Flights Dashboard</h1>
                
                <div className="mt-8 flex flex-col items-center">
                    <h2 className="text-2xl font-semibold mb-2">Flight List</h2>
                    {flights.length > 0 ? (
                        <table className="table-auto border-collapse border border-base-300 bg-base-200">
                            <thead>
                                <tr>
                                    <th className="border border-base-300 px-4 py-2">Flight Number</th>
                                    <th className="border border-base-300 px-4 py-2">Departure Time</th>
                                    <th className="border border-base-300 px-4 py-2">Arrival Time</th>
                                    <th className="border border-base-300 px-4 py-2">Route</th>
                                    <th className="border border-base-300 px-4 py-2">Aircraft ID</th>
                                    <th className="border border-base-300 px-4 py-2">Status</th>
                                    <th className="border border-base-300 px-4 py-2">Price</th>
                                    <th className="border border-base-300 px-4 py-2">Edit</th>
                                    <th className="border border-base-300 px-4 py-2">Delete</th>
                                    <th className="border border-base-300 px-4 py-2">View Crew</th>
                                </tr>
                            </thead>
                            <tbody>
                                {flights.map((flight, idx) => (
                                    <tr key={idx}>
                                        <td className="border border-base-300 px-4 py-2">{flight.flightNumber}</td>
                                        <td className="border border-base-300 px-4 py-2">{flight.departureTime ? new Date(flight.departureTime).toLocaleString() : '-'}</td>
                                        <td className="border border-base-300 px-4 py-2">{flight.arrivalTime ? new Date(flight.arrivalTime).toLocaleString() : '-'}</td>
                                        <td className="border border-base-300 px-4 py-2">{flight.route}</td>
                                        <td className="border border-base-300 px-4 py-2">{flight.aircraftId}</td>
                                        <td className="border border-base-300 px-4 py-2">{flight.status || "-"}</td>
                                        <td className="border border-base-300 px-4 py-2">{flight.price ?? "-"}</td>
                                        <td className="border border-base-300 px-4 py-2">
                                            <button className="btn btn-accent"
                                                onClick={() => router.push(`/admin/flights/edit/${flight.id}`)}>
                                                Edit
                                            </button>
                                        </td>
                                        <td className="border border-base-300 px-4 py-2">
                                            <button className="btn btn-accent"
                                                onClick={() => handleDelete(flight.id, flight.aircraftId)}>
                                                Delete
                                            </button>
                                        </td>
                                        <td className="border border-base-300 px-4 py-2">
                                            <button className="btn btn-secondary"
                                                onClick={() => handleAssignCrew(flight.id)}>
                                                View Crew
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="mt-4">No flight data available.</p>
                    )}
                    {error && <div className="text-red-500 mt-4">{error}</div>}
                </div>
            </div>
        </>
    );
}

export default AllFlights;
