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

function AllEmployees() {
    const router = useRouter();
    const [employees, setEmployees] = useState<any[]>([]);
    const [authStatus, setAuthStatus] = useState<string>("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await axios.get(
                    process.env.NEXT_PUBLIC_API_ENDPOINT + "/admin/getallemployee",
                    { withCredentials: true }
                );
                setEmployees(res.data);
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
                setEmployees([]);
            }
        };
        fetchEmployees();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setCreating(true);
        const employeeSchema = z.object({
            email: z.string().email({ message: "Invalid email format." }),
            password: z.string().min(8, "Password must be at least 8 characters.").max(20, "Password must be at most 20 characters.")
        });

        const result = employeeSchema.safeParse({ email, password });
        if (!result.success) {
            setError(result.error.issues.map(i => i.message).join(" "));
            setCreating(false);
            return;
        }
        try {
            await axios.post(
                process.env.NEXT_PUBLIC_API_ENDPOINT + "/admin/createemployee",
                { email, password },
                { withCredentials: true }
            );
            setEmail("");
            setPassword("");
            setError("");
            // Refresh list
            const res = await axios.get(
                process.env.NEXT_PUBLIC_API_ENDPOINT + "/admin/getallemployee",
                { withCredentials: true }
            );
            setEmployees(res.data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to create employee.");
        } finally {
            setCreating(false);
        }
    };

    const handleStatus = async (id: string, isActive: boolean) => {
        try {
            await axios.patch(
                process.env.NEXT_PUBLIC_API_ENDPOINT + `/admin/employee/status/${id}`,
                { isActive: !isActive },
                { withCredentials: true }
            );
            setEmployees((prev) => prev.map(emp => emp.id === id ? { ...emp, isActive: !isActive } : emp));
        } catch (err) {
            setError("Failed to update status.");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(
                process.env.NEXT_PUBLIC_API_ENDPOINT + `/admin/employee/${id}`,
                { withCredentials: true }
            );
            setEmployees((prev) => prev.filter(emp => emp.id !== id));
        } catch (err) {
            setError("Failed to delete employee.");
        }
    };

    return (
        <>
            <Navbar2 />
            <div>
                <h1 className="text-4xl font-bold text-center mt-10">Employee Dashboard</h1>
                
                    <h2 className="text-2xl font-semibold mt-12 mb-2 text-center">Create Employee</h2>
                    <form className="mb-6 flex flex-col gap-2 items-center" onSubmit={handleCreate}>
                        <input
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="input input-bordered w-full max-w-xs"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="input input-bordered w-full max-w-xs"
                        />
                        <button className="btn btn-primary w-full max-w-xs" type="submit" disabled={creating}>
                            {creating ? "Creating..." : "Create Employee"}
                        </button>
                        {error && <div className="text-red-500 text-center mt-2">{error}</div>}
                    </form>
                <div className="mt-8 flex flex-col items-center">
                    <h2 className="text-2xl font-semibold mb-2">Employee List</h2>
                    
                    {employees.length > 0 ? (
                        <table className="table-auto border-collapse border border-gray-400">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2">Email</th>
                                    <th className="border px-4 py-2">Status</th>
                                    <th className="border px-4 py-2">Change Status</th>
                                    <th className="border px-4 py-2">Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((emp, idx) => (
                                    <tr key={idx}>
                                        <td className="border px-4 py-2">{emp.email}</td>
                                        <td className="border px-4 py-2">{emp.isActive ? "Active" : "Inactive"}</td>
                                        <td className="border px-4 py-2">
                                            <button className="btn btn-accent"
                                                onClick={() => handleStatus(emp.id, emp.isActive)}>
                                                Switch
                                            </button>
                                        </td>
                                        <td className="border px-4 py-2">
                                            <button className="btn btn-accent"
                                                onClick={() => handleDelete(emp.id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="mt-4">No employee data available.</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default AllEmployees;
