// pages/dashboard.js
import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  if (!session) return <p>Please log in to view this page</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Welcome, {session.user.email}</h1>
      <p>Your role: {session.user.role}</p>
      <button onClick={() => signOut()} className="mt-4 bg-red-500 text-white p-2 rounded">
        Logout
      </button>
    </div>
  );
}
