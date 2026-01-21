import Navbar from '../../../Component/Navbar';
import axios from 'axios';
import Navbar2 from '../../Component/Navbar';

async function getAircraft() {
    try {
        const res = await axios.get(
            process.env.NEXT_PUBLIC_API_ENDPOINT + '/admin/getallaircrafts'
        );
        if (res.status === 401) {
            return [];
        }
        return res.data;
    } catch (err: any) {
        if (err.response && err.response.status === 401) {
            return [];
        }
        return [];
    }
}

export default async function AircraftPage() {
    const aircraft = await getAircraft();
    return (
        <>
            <Navbar2 />
            <div>
                <h1 className="text-4xl font-bold text-center mt-10">Welcome to the Dashboard</h1>
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
                                </tr>
                            </thead>
                            <tbody>
                                {aircraft.map((a: any, idx: number) => (
                                    <tr key={idx}>
                                        <td className="border px-4 py-2">{a.model}</td>
                                        <td className="border px-4 py-2">{a.registration}</td>
                                        <td className="border px-4 py-2">{a.capacity}</td>
                                        <td className="border px-4 py-2">{a.status}</td>
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
    );
}
