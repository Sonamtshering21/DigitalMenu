// /app/dashboard/page.js
'use client';

import { useSession } from "next-auth/react";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter to redirect

export default function DashboardLanding() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If there's a session and the user ID exists, redirect to the user's specific dashboard
    if (session?.user?.id) {
      router.push(`/dashboard/${session.user.id}`);
    }
  }, [session, router]);

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      <p>Redirecting to your dashboard...</p>
    </div>
  );
}
