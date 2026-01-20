"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/app/admin/Component/Navbar";
import Navbar2 from "@/app/admin/Component/Navbar";

function AssignCrew() {
	const router = useRouter();
	const { id } = useParams(); 
	const [crew, setCrew] = useState<any[]>([]);
	const [employees, setEmployees] = useState<any[]>([]);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const crewRes = await axios.get(
					process.env.NEXT_PUBLIC_API_ENDPOINT + `/admin/flights/${id}/crew`,
					{ withCredentials: true }
				);
				setCrew(crewRes.data);
				const empRes = await axios.get(
					process.env.NEXT_PUBLIC_API_ENDPOINT + "/admin/getallemployee",
					{ withCredentials: true }
				);
				setEmployees(empRes.data);
			} catch (err) {
				setError("Failed to fetch data.");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [id]);

	const handleAssign = async (employeeId: string) => {
		setError("");
		try {
			await axios.post(
				process.env.NEXT_PUBLIC_API_ENDPOINT + `/admin/flights/${id}/crew/${employeeId}`,
				{},
				{ withCredentials: true }
			);
			setCrew((prev) => [...prev, employees.find((e) => e.id === employeeId)]);
		} catch (err) {
			setError("Failed to assign crew member.");
		}
	};

	const handleRemove = async (employeeId: string) => {
		setError("");
		try {
			await axios.delete(
				process.env.NEXT_PUBLIC_API_ENDPOINT + `/admin/flights/${id}/crew/${employeeId}`,
				{ withCredentials: true }
			);
			setCrew((prev) => prev.filter((c) => c.id !== employeeId));
		} catch (err) {
			setError("Failed to remove crew member.");
		}
	};

	return (
		<>
			<Navbar2 />
			<div>
				<h1 className="text-4xl font-bold text-center mt-10">Assign Crew to Flight</h1>
				<div className="mt-8 flex flex-col items-center">
					<h2 className="text-2xl font-semibold mb-2">Current Crew</h2>
					{loading ? (
						<p>Loading...</p>
					) : crew.length > 0 ? (
						<table className="table-auto border-collapse border border-base-300 bg-base-200 mb-6">
							<thead>
								<tr>
									<th className="border border-base-300 px-4 py-2">Email</th>
									<th className="border border-base-300 px-4 py-2">Remove</th>
								</tr>
							</thead>
							<tbody>
								{crew.map((member, idx) => (
									<tr key={idx}>
										<td className="border border-base-300 px-4 py-2">{member.email}</td>
										<td className="border border-base-300 px-4 py-2">
											<button
												className="btn btn-accent"
												onClick={() => handleRemove(member.id)}
											>
												Remove
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<p className="mb-6">No crew assigned yet.</p>
					)}

					<h2 className="text-2xl font-semibold mb-2">All Employees</h2>
					{loading ? (
						<p>Loading...</p>
					) : employees.length > 0 ? (
						<table className="table-auto border-collapse border border-base-300 bg-base-200">
							<thead>
								<tr>
									<th className="border border-base-300 px-4 py-2">Email</th>
									<th className="border border-base-300 px-4 py-2">Assign</th>
								</tr>
							</thead>
							<tbody>
								{employees.map((emp, idx) => (
									<tr key={idx}>
										<td className="border border-base-300 px-4 py-2">{emp.email}</td>
										<td className="border border-base-300 px-4 py-2">
											<button
												className="btn btn-secondary"
												onClick={() => handleAssign(emp.id)}
												disabled={crew.some((c) => c.id === emp.id)}
											>
												{crew.some((c) => c.id === emp.id) ? "Assigned" : "Assign"}
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<p>No employees found.</p>
					)}
					{error && <div className="text-red-500 mt-4">{error}</div>}
				</div>
			</div>
		</>
	);
}

export default AssignCrew;
