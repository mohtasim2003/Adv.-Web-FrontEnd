"use client";

import { useEffect, useState } from "react";
import Pusher from "pusher-js";

export default function LoginToast({ customerId }: { customerId: string }) {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!customerId) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(`customer-${customerId}`);

    channel.bind("logged-in", (data: any) => {
      setMessage(data.message);

      // auto-hide after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [customerId]);

  if (!message) return null;

  return (
    <div className="toast toast-top toast-end z-50">
      <div className="alert alert-success shadow-lg">
        <span>{message}</span>
      </div>
    </div>
  );
}
