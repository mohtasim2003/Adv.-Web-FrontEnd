// import ProfileClient from "./ProfileClient";

import ProfileClient from "../../myprofile/[id]/ProfileClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProfileClient id={id} />;
}
