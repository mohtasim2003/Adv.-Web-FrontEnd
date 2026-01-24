import axios from "axios";
import FlightsClient from "../flight/FlightsClient";


interface Flight {
  id: string;
  flightNumber: string;
  route: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
}

export default async function FlightsPage() {
  const { data: flights } = await axios.get<Flight[]>(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/customer/getallflight`
  );

  return (
    <div className="min-h-screen bg-base-300 px-10 py-20">
      <h1 className="text-4xl font-bold text-base-content mb-10">
        Available Flights
      </h1>

     
      <FlightsClient flights={flights} />
    </div>
  );
}
