"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/apiClient";

type Product = { _id: string; name: string; description: string; category: string; images?: string[] };

export default function SearchProductPage() {
  const searchParams = useSearchParams();
  const query = (searchParams.get("q") || "").trim().toLowerCase();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get("/api/products").then((response) => setProducts(response.data || [])).finally(() => setLoading(false)); }, []);
  const matches = products.filter((product) => `${product.name} ${product.description} ${product.category}`.toLowerCase().includes(query));

  return <main className="min-h-screen bg-gradient-to-b from-[#ffd3b6] via-rose-100 to-rose-300 px-4 py-12 sm:px-8"><div className="mx-auto max-w-6xl">
    <h1 className="text-3xl font-bold text-rose-900">{query ? `Search results for “${query}”` : "Search products"}</h1>
    {loading ? <p className="mt-8 text-rose-800">Searching products...</p> : !query ? <p className="mt-8 text-rose-800">Enter a product name in the search bar.</p> : matches.length === 0 ? <p className="mt-8 text-rose-800">No products matched your search.</p> : <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {matches.map((product) => <Link key={product._id} href={`/productdetail/${product._id}`} className="overflow-hidden rounded-2xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"><div className="h-52 bg-rose-100">{product.images?.[0] && <img src={`/uploads/${product.images[0]}`} alt={product.name} className="h-full w-full object-cover" />}</div><div className="p-5"><h2 className="text-xl font-bold text-gray-900">{product.name}</h2><p className="mt-2 line-clamp-2 text-sm text-gray-600">{product.description}</p><p className="mt-4 text-sm font-semibold text-rose-600">View details →</p></div></Link>)}
    </div>}
  </div></main>;
}
