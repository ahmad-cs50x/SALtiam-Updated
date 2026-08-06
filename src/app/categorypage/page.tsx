"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/apiClient";

type Product = { _id: string; name: string; description: string; category: string; availability?: string; images?: string[] };

const categoryName = (category: string) => category.split("-").map((word) => word[0]?.toUpperCase() + word.slice(1)).join(" ");

export default function CategoryPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/products")
      .then((response) => setProducts((response.data || []).filter((product: Product) => !category || product.category === category)))
      .finally(() => setLoading(false));
  }, [category]);

  return <main className="min-h-screen bg-gradient-to-b from-[#ffd3b6] via-rose-100 to-rose-300 px-4 py-12 sm:px-8">
    <div className="mx-auto max-w-6xl">
      <Link href="/catalog" className="text-sm font-semibold text-rose-700 hover:underline">← Back to catalog</Link>
      <h1 className="mt-5 text-3xl font-bold text-rose-900 sm:text-4xl">{category ? categoryName(category) : "All Products"}</h1>
      {loading ? <p className="mt-10 text-rose-800">Loading products...</p> : products.length === 0 ? <p className="mt-10 text-rose-800">No products are available in this category yet.</p> :
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => <Link key={product._id} href={`/productdetail/${product._id}`} className="overflow-hidden rounded-2xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
            <div className="h-56 bg-rose-100">{product.images?.[0] && <img src={`/uploads/${product.images[0]}`} alt={product.name} className="h-full w-full object-cover" />}</div>
            <div className="p-5"><h2 className="text-xl font-bold text-gray-900">{product.name}</h2><p className="mt-2 line-clamp-2 text-sm text-gray-600">{product.description}</p><p className="mt-4 text-sm font-semibold text-rose-600">{product.availability || "In Stock"} · View details →</p></div>
          </Link>)}
        </div>}
    </div>
  </main>;
}
