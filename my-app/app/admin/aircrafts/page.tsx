'use client'
//import Head from '../components/header'
//import Foot from '../components/footer'
import { useEffect, useState } from 'react';
import axios from 'axios';
import {useRouter} from 'next/navigation';
import Navbar from '../../Component/Navbar';
//import Head2 from '../components/header2';

function Home() {
    let router = useRouter();
    const [aircraft, setAircraft] = useState<any[]>([]);
    const [authStatus, setAuthStatus] = useState<string>("");
    useEffect(() => {
        const fetchAircraft = async () => {
            try {
                const res = await axios.get(
                    process.env.NEXT_PUBLIC_API_ENDPOINT + "/admin/getallaircraft",
                    {
                        withCredentials: true,
                    }
                );
                setAircraft(res.data);
                setAuthStatus("Authenticated as admin");
            } catch (err: any) {
                if (err.response && err.response.status === 401) {
                    setAuthStatus("Not authenticated or token expired");
                } else if (err.response && err.response.status === 403) {
                    setAuthStatus("Not authorized: Not an admin");
                } else {
                    setAuthStatus("Error fetching data");
                }
                if(authStatus !== "Authenticated as admin")
                {
                    router.push('/login');
                }
                setAircraft([]);
            }
        };
        fetchAircraft();
    }, []);

    return (
        <>
            <Navbar/>
            <div>
                <h1 className="text-4xl font-bold text-center mt-10">Welcome to the Dashboard</h1>
                <p className="text-center mt-4">Auth status: {authStatus}</p>
                <div className="mt-8 flex flex-col items-center">
                    <h2 className="text-2xl font-semibold mb-2">Aircraft List</h2>
                    {aircraft.length > 0 ? (
                        <table className="table-auto border-collapse border border-gray-400">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2">Model</th>
                                    <th className="border px-4 py-2">Registration</th>
                                    <th className="border px-4 py-2">Capacity</th>
                                    <th className="border px-4 py-2">Status</th>
                                    <th className="border px-4 py-2">Change Status</th>
                                    <th className="border px-4 py-2">Edit</th>
                                    <th className="border px-4 py-2">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {aircraft.map((a, idx) => (
                                    <tr key={idx}>
                                        <td className="border px-4 py-2">{a.model}</td>
                                        <td className="border px-4 py-2">{a.registration}</td>
                                        <td className="border px-4 py-2">{a.capacity}</td>
                                        <td className="border px-4 py-2">{a.status}</td>
                                        <td className="border px-8 py-2">
                                            <button className="btn btn-accent"
                                            onClick={() => {
                                                const newStatus = a.status === 'Active' ? 'Inactive' : 'Active';
                                                const updateStatus = async () => {
                                                    try {
                                                        await axios.patch(process.env.NEXT_PUBLIC_API_ENDPOINT + `/admin/aircraft/status/${a.id}`,
                                                            { status: newStatus },
                                                            { withCredentials: true }
                                                        );
                                                    } catch (err) {
                                                        console.error(err);
                                                    }
                                                };
                                                updateStatus().then(() => {
                                                    setAircraft((prevAircraft) =>
                                                        prevAircraft.map((aircraft) =>
                                                            aircraft.id === a.id ? { ...aircraft, status: newStatus } : aircraft
                                                        )
                                                    );
                                                });
                                                
                                            }}
                                            >
                                                Switch
                                            </button>
                                        </td>
                                        <td className="border px-4 py-4">
                                            <button className="btn btn-accent"
                                            onClick={() => router.push('aircrafts/edit/' + a.id)}
                                            >
                                                Edit
                                            </button>
                                        </td>
                                        <td className="border px-4 py-2">
                                            <button className="btn btn-accent"
                                            onClick={async () => {
                                                try {
                                                    await axios.delete(process.env.NEXT_PUBLIC_API_ENDPOINT + `/admin/aircraft/${a.id}`,
                                                        { withCredentials: true }
                                                    );
                                                    setAircraft((prevAircraft) =>
                                                        prevAircraft.filter((aircraft) => aircraft.id !== a.id)
                                                    );
                                                } catch (err) {
                                                    console.error(err);
                                                }
                                            }}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                        <td className="border px-4 py-2">
                                            
                                            <button className="btn btn-accent"
                                            onClick={() => router.push('flights/aircraft/' + a.id)}
                                            >
                                                See Flights
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="mt-4">No aircraft data available.</p>
                    )}
                </div>
            </div>
        </>
    )
}

export default Home
