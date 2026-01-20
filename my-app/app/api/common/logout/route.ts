import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // No need to parse body for logout

  (await cookies()).set({
    name: "accessToken",
    value: "",
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  (await cookies()).set({
    name: "userRole",
    value: "",
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  (await cookies()).set({
    name: "userId",
    value: "",
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return NextResponse.json({ message: "Logout successful" });
}