'use client'
import * as z from "zod";
import React, { useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/app/admin/Component/Navbar";
import Navbar2 from "@/app/admin/Component/Navbar";

function CreateFlight() {
    const router = useRouter()
    const [flightNumber, setFlightNumber] = React.useState("");
    const [departureTime, setDepartureTime] = React.useState("");
    const [arrivalTime, setArrivalTime] = React.useState("");
    const [route, setRoute] = React.useState("");
    const [status, setStatus] = React.useState("");
    const [price, setPrice] = React.useState("");
    // aircraftId is not needed in the payload, only for display
    const [rendered, setRendered] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);
    const { id } = useParams();

    const formatDateTimeLocal = (dateStr: any) => {
        if (!dateStr) return "";
        const d = new Date(dateStr);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const hh = String(d.getHours()).padStart(2, '0');
        const min = String(d.getMinutes()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                let res = await axios.get(process.env.NEXT_PUBLIC_API_ENDPOINT + "/admin/checkauth", {
                    withCredentials: true,
                });
                if(res.status === 200){
                    setRendered(true);
                }
            } catch (err) {
                router.push('/login');
            }
        };
        checkAuth();
    }, []);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
        const errorElement = document.getElementById('error');
        if (errorElement) errorElement.innerHTML = "";

        const flightSchema = z.object({
            flightNumber: z.string().min(1, "Flight number is required"),
            departureTime: z.string().min(1, "Departure time is required"),
            arrivalTime: z.string().min(1, "Arrival time is required"),
            route: z.string().min(1, "Route is required"),
            status: z.string().min(1, "Status is required"),
            price: z.number().min(0, "Price must be a positive number"),
        });
        const payload = { flightNumber, departureTime, arrivalTime, route, status, price: Number(price), aircraftId: id };
        const res = flightSchema.safeParse(payload);
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
            const resp = await axios.post(
                process.env.NEXT_PUBLIC_API_ENDPOINT + "/admin/aircraft/" + id + "/addflight",
                payload,
                { withCredentials: true }
            );
            console.log(resp);
            if (resp.status === 201 || resp.status === 200) {
                if (errorElement) {
                    errorElement.textContent = "Flight created successfully!";
                    errorElement.style.color = "green";
                }
            }
            else {
                if (errorElement) {
                    errorElement.textContent = "Failed to create flight.";
                    errorElement.style.color = "red";
                }
            }
        } catch (err: any) {
            if (errorElement) {
                if (err.response && err.response.data && err.response.data.message) {
                    errorElement.textContent = err.response.data.message;
                } else {
                    errorElement.textContent = "Failed to create flight.";
                }
                errorElement.style.color = "red";
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `Create Flight`;
            }
            setSubmitting(false);
        }
    };

    {
        return (
            <>
                <Navbar2/>
                {!rendered ? (
                    <div className="min-h-screen bg-base-100">
                        <h1 className="text-4xl font-bold text-center pt-10 text-base-content">Loading...</h1>
                    </div>
                ) : (
                    <div className="min-h-screen bg-base-100">
                        <h1 className="text-4xl font-bold text-center pt-10 text-base-content">Create Flight</h1>
                        <div className="mt-8 flex flex-col items-center">
                            <table className="table-auto border-collapse border border-base-300 bg-base-200">
                                <thead>
                                    <tr>
                                        <th className="border border-base-300 px-4 py-2 text-base-content">Field name</th>
                                        <th className="border border-base-300 px-4 py-2 text-base-content">Field input</th>
                                    </tr>
                                    <tr>
                                        <td className="border border-base-300 px-4 py-2 text-base-content">Aircraft ID</td>
                                        <td className="border border-base-300 px-4 py-2">
                                            <input
                                                type="text"
                                                value={id}
                                                disabled
                                                className="input input-bordered w-full bg-base-100 text-base-content opacity-60 cursor-not-allowed"
                                            />
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border border-base-300 px-4 py-2 text-base-content">Flight Number</td>
                                        <td className="border border-base-300 px-4 py-2">
                                            <input
                                                type="text"
                                                value={flightNumber}
                                                onChange={(e) => setFlightNumber(e.target.value)}
                                                className="input input-bordered w-full bg-base-100 text-base-content"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-base-300 px-4 py-2 text-base-content">Departure Time</td>
                                        <td className="border border-base-300 px-4 py-2">
                                            <input
                                                type="datetime-local"
                                                value={departureTime}
                                                onChange={(e) => setDepartureTime(e.target.value)}
                                                className="input input-bordered w-full bg-base-100 text-base-content"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-base-300 px-4 py-2 text-base-content">Arrival Time</td>
                                        <td className="border border-base-300 px-4 py-2">
                                            <input
                                                type="datetime-local"
                                                value={arrivalTime}
                                                onChange={(e) => setArrivalTime(e.target.value)}
                                                className="input input-bordered w-full bg-base-100 text-base-content"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-base-300 px-4 py-2 text-base-content">Route</td>
                                        <td className="border border-base-300 px-4 py-2">
                                            <input
                                                type="text"
                                                value={route}
                                                onChange={(e) => setRoute(e.target.value)}
                                                className="input input-bordered w-full bg-base-100 text-base-content"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-base-300 px-4 py-2 text-base-content">Status</td>
                                        <td className="border border-base-300 px-4 py-2">
                                            <select value={status} className="select select-ghost w-full bg-base-100 text-base-content"
                                                onChange={(e) => setStatus(e.target.value)}
                                            >
                                                <option value="" disabled>Pick a status</option>
                                                <option>Active</option>
                                                <option>Inactive</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-base-300 px-4 py-2 text-base-content">Price</td>
                                        <td className="border border-base-300 px-4 py-2">
                                            <input
                                                type="number"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                                className="input input-bordered w-full bg-base-100 text-base-content"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-base-300 px-4 py-2" colSpan={2}>
                                            <button
                                                id="submitBtn"
                                                onClick={handleSubmit}
                                                className="btn btn-primary w-full"
                                                disabled={submitting}
                                            >
                                                Create Flight
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="border border-base-300 px-4 py-2" colSpan={2}>
                                            <div id="error" className="text-center mt-4"></div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                <div style={{ bottom: "0%", position: "relative", width: "100%" }}>{/* <Foot /> */}</div>
            </>
        );
    }
}

export default CreateFlight;
