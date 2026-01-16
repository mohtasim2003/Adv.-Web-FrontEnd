import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
    const body = await req.json();

    const backendRes = await axios.post(
        process.env.NEXT_PUBLIC_API_ENDPOINT + "/admin/login",
        { email: body.email, password: body.password }
    );


    if (backendRes.status === 401) {
        return NextResponse.json(
            { message: "Invalid email or password" },
            { status: 401 }
        );
    }

    const data = backendRes.data;
    (await cookies()).set({
        name: "accessToken",
        value: data.accessToken,
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24, 
    }
);
    (await cookies()).set({
        name: "userRole",
        value: data.role,
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24,
    }
);
    (await cookies()).set({
        name: "userId",
        value: data.id,
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24,
    }
);
    return NextResponse.json({ message: "Login successful", user: data });
}