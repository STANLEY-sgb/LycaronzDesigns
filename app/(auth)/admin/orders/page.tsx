"use client";

import { useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface Order {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  product?: {
    name: string;
  };
}

export default function OrdersPage() {
  const { data, error, mutate } = useSWR<Order[]>('/api/orders', fetcher, { refreshInterval: 5000 });
  const [updating, setUpdating] = useState<string | null>(null);

  if (error) return <div>Error loading orders</div>;
  if (!data) return <div>Loading orders...</div>;

  async function markContacted(id: string) {
    setUpdating(id);
    await fetch(`/api/orders/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'contacted' }) });
    setUpdating(null);
    mutate();
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Orders & Enquiries</h1>
      <div className="space-y-4">
        {data.map((o) => (
          <div key={o.id} className="border rounded p-4 flex justify-between items-start">
            <div>
              <div className="font-semibold">{o.name} — {o.email}</div>
              <div className="text-sm text-muted">Product: {o.product?.name ?? '—'}</div>
              <div className="text-sm mt-2">Message: {o.message}</div>
              <div className="text-xs text-gray-500 mt-1">Status: {o.status}</div>
            </div>
            <div className="flex flex-col gap-2">
              <a href={`mailto:${o.email}`} className="btn">Reply</a>
              <button disabled={updating===o.id} onClick={()=>markContacted(o.id)} className="btn">{updating===o.id? 'Updating...' : 'Mark contacted'}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
