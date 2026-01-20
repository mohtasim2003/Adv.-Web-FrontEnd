'use client'
import * as z from "zod";
import React, { useEffect } from "react";
//import Foot from '../../../components/footer';
//import Head from '../../../components/header';
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/app/admin/Component/Navbar";
import Navbar2 from "@/app/admin/Component/Navbar";

function SeeFlights() {
    /*
    export class CreateFlightDto {
  @IsString()
  flightNumber: string;

  @IsDateString()
  departureTime: string;

  @IsDateString()
  arrivalTime: string;

  @IsString()
  route: string;

  @IsUUID()
  aircraftId: string;
}

    */
    const router = useRouter()
    const [flights, setFlights] = React.useState<any[]>([]);
    const [model, setModel] = React.useState("");
    const [registration, setRegistration] = React.useState("");
    const [capacity, setCapacity] = React.useState("");
    const [status, setStatus] = React.useState("");
    const [flightNumber, setFlightNumber] = React.useState("");
    const [departureTime, setDepartureTime] = React.useState("");
    const [arrivalTime, setArrivalTime] = React.useState("");
    const [route, setRoute] = React.useState("");
    const [submitting, setSubmitting] = React.useState(false);
    const [rendered, setRendered] = React.useState(false);
    const { id } = useParams();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const endpoint = process.env.NEXT_PUBLIC_API_ENDPOINT + "/admin/checkauth";
                console.log("[AuthCheck] Endpoint:", endpoint);
                let res = await axios.get(endpoint, {
                    withCredentials: true,
                });
                console.log("[AuthCheck] Response:", res.status, res.data);
                if (res.status === 200) {
                    setRendered(true);
                }
            } catch (err) {
                console.error("[AuthCheck] Error:", err);
                router.push('/login');
                
            }
        };
        checkAuth();
        const getFlights = async () => {
            try {
                const res = await axios.get(
                    process.env.NEXT_PUBLIC_API_ENDPOINT + "/admin/aircraft/" + id + "/flights",
                    {
                        withCredentials: true,
                    }
                );
                setFlights(res.data);
                console.log(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        getFlights();
    }, []);
    /*const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
        const errorElement = document.getElementById('error');
        if (errorElement) errorElement.innerHTML = "";

        const res = aircraftSchema.safeParse({ model, registration, capacity, status });
        if (!res.success) {
            let errorMessages = res.error.issues.map(err => err.message).join(" <br />");
            if (errorElement) {
                errorElement.innerHTML = errorMessages;
                errorElement.style.color = "red";
            }
            return;
        }
        try {
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span class='loading loading-spinner'></span> Creating...`;
            }
            const resp = await axios.put(
                process.env.NEXT_PUBLIC_API_ENDPOINT + "/admin/aircraft" + "/" + id,
                {
                    model,
                    registration,
                    capacity: Number(capacity),
                    status,
                },
                { withCredentials: true }
            );
            console.log(resp);
            if (resp.status === 200) {
                if (errorElement) {
                    errorElement.textContent = "Aircraft updated successfully!";
                    errorElement.style.color = "green";
                }
            }
            else {
                if (errorElement) {
                    errorElement.textContent = "Failed to update aircraft.";
                    errorElement.style.color = "red";
                }
            }
        } catch (err: any) {
            if (errorElement) {
                if (err.response && err.response.data && err.response.data.message) {
                    errorElement.textContent = err.response.data.message;
                } else {
                    errorElement.textContent = "Failed to update aircraft.";
                }
                errorElement.style.color = "red";
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `Update Aircraft`;
            }
            setSubmitting(false);
        }
    };*/

    {
        return (
            <>
                {/*<Head />*/}
                <Navbar2/>
                {!rendered ?
                    (
                        <div className="min-h-screen">
                            <h1 className="text-4xl font-bold text-center mt-10">Loading...</h1>
                        </div>
                    ) :
                    (
                        <div className="min-h-screen">
                            <h1 className="text-4xl font-bold text-center mt-10">All flights</h1>
                            <div className="mt-8 flex flex-col items-center">
                                <table className="table-auto border-collapse border border-gray-400">
                                    <thead>
                                        <tr>
                                            <th className="border px-4 py-2">Flight Number</th>
                                            <th className="border px-4 py-2">Departure Time</th>
                                            <th className="border px-4 py-2">Arrival Time</th>
                                            <th className="border px-4 py-2">Route</th>
                                            <th className="border px-4 py-2">Status</th>
                                            <th className="border px-4 py-2">Price</th>
                                            <th className="border px-4 py-2">Edit</th>
                                            <th className="border px-4 py-2">Delete</th>
                                        </tr>
                                    </thead>
                                    
                            <tbody>
                                {flights.map((a, idx) => (
                                    <tr key={idx}>
                                        <td className="border px-4 py-2">{a.flightNumber}</td>
                                        <td className="border px-4 py-2">{a.departureTime ? new Date(a.departureTime).toLocaleString() : ''}</td>
                                        <td className="border px-4 py-2">{a.arrivalTime ? new Date(a.arrivalTime).toLocaleString() : ''}</td>
                                        <td className="border px-4 py-2">{a.route}</td>
                                        <td className="border px-4 py-2">{a.status}</td>
                                        <td className="border px-4 py-2">{a.price}</td>
                                        <td className="border px-4 py-4">
                                            <button className="btn btn-accent"
                                            onClick={() => router.push('/admin/flights/edit/' + a.id)}
                                            >
                                                Edit
                                            </button>
                                        </td>
                                        <td className="border px-4 py-2">
                                            <button className="btn btn-accent"
                                            onClick={async () => {
                                                try {
                                                    await axios.delete(process.env.NEXT_PUBLIC_API_ENDPOINT + `/admin/aircraft/${id}/flight/${a.id}`,
                                                        { withCredentials: true }
                                                    );
                                                    setFlights((prevFlights) =>
                                                        prevFlights.filter((flight) => flight.id !== a.id)
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
                                            onClick={() => router.push('/admin/flights/assign-crew/' + a.id)}
                                            >
                                                View crew
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                <div style={{ bottom: "0%", position: "relative", width: "100%" }}>{/*<Foot />*/}</div>
            </>
        );
    }
}

export default SeeFlights;
