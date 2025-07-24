
"use client"
import { Button } from "@/components/ui/button"
import Login from "./auth/signin/page.jsx"
export default async function HomePage() {
  const res = await fetch('https://dumpsexpert.vercel.app/api/orders/all', {
    next: { revalidate: 60 },
  });

  const json = await res.json();
  const orders = Array.isArray(json.data) ? json.data : []; 

  return (
    <div className="p-6 ">
       <Button>Click me</Button>
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>
<Login/>
    </div>
  );
}
