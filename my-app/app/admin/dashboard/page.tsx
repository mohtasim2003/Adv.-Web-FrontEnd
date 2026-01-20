
'use client';
import * as PusherPushNotifications from "@pusher/push-notifications-web";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Navbar2 from '../Component/Navbar';


function Home() {
    const router = useRouter();
    const [aircraft, setAircraft] = useState<any[]>([]);
    const [authStatus, setAuthStatus] = useState<string>("");

    useEffect(() => {
        // Pusher Beams push notification setup (admin dashboard)
        const beamsClient = new PusherPushNotifications.Client({
            instanceId: process.env.NEXT_PUBLIC_PUSHER_BEAMS_INSTANCE_ID || '',
        });
        beamsClient.start()
            .then(() => beamsClient.addDeviceInterest("admin-notifications"))
            .then(() => console.log("Successfully registered and subscribed to admin-notifications!"))
            .catch((e:any) => console.error("Error registering for push notifications", e));
    }, []);

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
                if (authStatus !== "Authenticated as admin") {
                    router.push('/login');
                }
                setAircraft([]);
            }
        };
        fetchAircraft();
    }, []);

    return (
        <>
            <Navbar2/>
            <div>
                <h1 className="text-4xl font-bold text-center mt-10">Admin Dashboard</h1>
                <div className="mt-12 flex flex-col items-center gap-6">
                    <table className="table-auto border-separate" style={{ borderSpacing: '0 24px' }}>
                        <tbody>
                            <tr>
                                <td>
                                    <button className="btn btn-primary px-8 py-4 text-lg font-semibold w-full" onClick={() => router.push('/admin/aircrafts/view')}>
                                        View Aircraft
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <button className="btn btn-primary px-8 py-4 text-lg font-semibold w-full" onClick={() => router.push('/admin/aircrafts')}>
                                        Modify Aircraft
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <button className="btn btn-primary px-8 py-4 text-lg font-semibold w-full" onClick={() => router.push('/admin/flights')}>
                                        Flights
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <button className="btn btn-primary px-8 py-4 text-lg font-semibold w-full" onClick={() => router.push('/admin/employees')}>
                                        Employees
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <button className="btn btn-warning px-8 py-4 text-lg font-semibold w-full" onClick={() => router.push('/login')}>
                                        Logout
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default Home
