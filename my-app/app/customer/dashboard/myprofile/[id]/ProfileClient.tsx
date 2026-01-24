"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/app/customer/hook/api";
import Pusher from "pusher-js";

type Profile = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
};

export default function ProfileClient({ id }: { id: string }) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  
  const [msg, setMsg] = useState("");

 
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setMsg(""); 

      const res = await api.get("/customer/me");
      const me = res.data as Profile;

      
      if (me?.id && id !== me.id) {
        router.replace(`/customer/dashboard/profile/${me.id}`);
        return;
      }

      setProfile(me);
      setPhone(me.phone || "");
      setAddress(me.address || "");
    } catch (e: any) {
      setProfile(null);
      setMsg("Unauthorized / Please login again.");
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    if (!profile?.id) return;

   

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channelName = `user-${profile.id}`;
    const channel = pusher.subscribe(channelName);

    const handler = (data: any) => {
     
      setToastMsg(data?.message || "Updated");
      setTimeout(() => setToastMsg(null), 2500);
    };

    channel.bind("profile-updated", handler);

    return () => {
      channel.unbind("profile-updated", handler);
      pusher.unsubscribe(channelName);
      pusher.disconnect();
    };
  }, [profile?.id]);

  useEffect(() => {
    load();
   
  }, [id]);

  const save = async () => {
    try {
      setMsg("");
      await api.put("/customer/me", { phone, address });

     
      setMsg("Profile updated");

      setEditing(false);
      load();
    } catch (e: any) {
      setMsg(e?.response?.data?.message || "Update failed");
    }
  };

  const remove = async () => {
    if (!profile?.id) return;
    if (!confirm("Delete your profile?")) return;

    try {
      setMsg("");
      await api.delete(`/customer/me/${profile.id}`);
      router.replace("/login");
    } catch (e: any) {
      setMsg(e?.response?.data?.message || "Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-base-200 p-6">
        <div className="alert alert-warning">
          <span>{msg || "No profile found."}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent p-6 lg:p-10">
     
      {toastMsg && (
        <div className="toast toast-bottom toast-end z-50">
          <div className="alert alert-info shadow-lg">
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto bg-base-100 rounded-2xl border border-accent/15 p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-accent">My Profile</h1>
          </div>

          <div className="flex gap-2">
            {!editing ? (
              <button
                className="btn btn-sm btn-outline btn-accent"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
            ) : (
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            )}

          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-base-200 rounded-2xl p-4 border border-accent/10">
            <p className="text-xs text-base-content/60">Email</p>
            <p className="font-semibold text-accent">{profile.email || "-"}</p>
          </div>

          <div className="bg-base-200 rounded-2xl p-4 border border-accent/10">
            <p className="text-xs text-base-content/60">Name</p>
            <p className="font-semibold text-accent">{profile.name || "-"}</p>
          </div>
        </div>

        <div className="mt-4 bg-base-200 rounded-2xl p-4 border border-accent/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="input input-bordered bg-base-100 border-accent/20 text-accent"
              placeholder="Phone"
              value={editing ? phone : profile.phone || ""}
              onChange={(e) => setPhone(e.target.value)}
              disabled={!editing}
            />
            <input
              className="input input-bordered bg-base-100 border-accent/20 text-accent"
              placeholder="Address"
              value={editing ? address : profile.address || ""}
              onChange={(e) => setAddress(e.target.value)}
              disabled={!editing}
            />
          </div>

          {editing && (
            <div className="mt-4 flex justify-end">
              <button
                className="btn btn-accent text-base-100 rounded-full"
                onClick={save}
              >
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* keep your original msg alert */}
        {msg && (
          <div className="mt-4 alert alert-info">
            <span>{msg}</span>
          </div>
        )}
      </div>
    </div>
  );
}
