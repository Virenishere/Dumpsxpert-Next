import { Button } from "@/components/ui/button"

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
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul className="space-y-6">
          {orders.map((order) => (
            <li key={order._id} className="border p-4 rounded-md">
              <p><strong>Email:</strong> {order.user?.email ?? '—'}</p>
              <p><strong>Payment ID:</strong> {order.paymentId}</p>
              <p><strong>Total:</strong> ₹{order.totalAmount}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <div>
                <strong>Courses:</strong>
                <ul className="list-disc ml-6">
                  {order.courseDetails.map((c) => (
                    <li key={c._id}>{c.name} – ₹{c.price}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
