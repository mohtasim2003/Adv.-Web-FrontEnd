'use client'
import * as z from "zod";
import React, { useEffect } from "react";
//import Foot from '../../../components/footer';
//import Head from '../../../components/header';
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/app/admin/Component/Navbar";

function CreateAircraft() {
    const router = useRouter()
    const [model, setModel] = React.useState("");
    const [registration, setRegistration] = React.useState("");
    const [capacity, setCapacity] = React.useState("");
    const [status, setStatus] = React.useState("");
    const [submitting, setSubmitting] = React.useState(false);
    const [rendered, setRendered] = React.useState(false);
    const { id } = useParams();

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
        const getAircraft = async () => {
            try {
                const res = await axios.get(
                    process.env.NEXT_PUBLIC_API_ENDPOINT + "/admin/aircraft/" + id,
                    {
                        withCredentials: true,
                    }
                );
                setModel(res.data.model);
                setRegistration(res.data.registration);
                setCapacity(res.data.capacity.toString());
                setStatus(res.data.status);
            } catch (err) {
                router.push('/login');
            }
        };
        getAircraft();
    }, []);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
        const errorElement = document.getElementById('error');
        if (errorElement) errorElement.innerHTML = "";

        const aircraftSchema = z.object({
            model: z.string().min(1, "Model is required"),
            registration: z.string().min(1, "Registration is required"),
            capacity: z.string().min(1, "Capacity is required").refine(val => !isNaN(Number(val)) && Number(val) > 0, { message: "Capacity must be a positive integer" }),
            status: z.string().min(1, "Status is required"),
        });
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
    };

    {
        return (
            <>
                {/* <Head /> */}
                <Navbar/>
                {!rendered ?
                (
                <div className="min-h-screen bg-base-100">
                    <h1 className="text-4xl font-bold text-center pt-10 text-base-content">Loading...</h1>
                </div>
                ):
                (
                <div className="min-h-screen bg-base-100">
                    <h1 className="text-4xl font-bold text-center pt-10 text-base-content">Update Aircraft</h1>
                    <div className="mt-8 flex flex-col items-center">
                        <table className="table-auto border-collapse border border-base-300 bg-base-200">
                            <thead>
                                <tr>
                                    <th className="border border-base-300 px-4 py-2 text-base-content">Field name</th>
                                    <th className="border border-base-300 px-4 py-2 text-base-content">Field input</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border border-base-300 px-4 py-2 text-base-content">Model</td>
                                    <td className="border border-base-300 px-4 py-2">
                                        <input
                                            type="text"
                                            value={model}
                                            onChange={(e) => setModel(e.target.value)}
                                            className="input input-bordered w-full bg-base-100 text-base-content"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-base-300 px-4 py-2 text-base-content">Registration</td>
                                    <td className="border border-base-300 px-4 py-2">
                                        <input
                                            type="text"
                                            value={registration}
                                            onChange={(e) => setRegistration(e.target.value)}
                                            className="input input-bordered w-full bg-base-100 text-base-content"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-base-300 px-4 py-2 text-base-content">Capacity</td>
                                    <td className="border border-base-300 px-4 py-2">
                                        <input
                                            type="number"
                                            value={capacity}
                                            onChange={(e) => setCapacity(e.target.value)}
                                            className="input input-bordered w-full bg-base-100 text-base-content"
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td className="border border-base-300 px-4 py-2 text-base-content">Status</td>
                                    <td className="border border-base-300 px-4 py-2">
                                        <select defaultValue="Pick a status" className="select select-ghost w-full bg-base-100 text-base-content"
                                            onChange={(e) => setStatus(e.target.value)}
                                        >
                                            <option disabled={true}>Pick a status</option>
                                            <option>Active</option>
                                            <option>Inactive</option>
                                        </select>
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
                                            Update Aircraft
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

export default CreateAircraft;
