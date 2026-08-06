"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/apiClient";

type Product = { _id: string; name: string; description: string; category: string; availability?: string; images?: string[] };

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params?.id) return;
    api.get(`/api/products/${params.id}`).then((response) => setProduct(response.data)).catch((err) => setError(err?.response?.data?.error || "Product could not be loaded."));
  }, [params?.id]);

  if (error) return <main className="min-h-screen bg-rose-100 p-12 text-center"><p className="text-xl text-rose-900">{error}</p><Link href="/catalog" className="mt-5 inline-block text-rose-700 underline">Back to catalog</Link></main>;
  if (!product) return <main className="min-h-screen bg-rose-100 p-12 text-center text-rose-900">Loading product...</main>;

  return <main className="min-h-screen bg-gradient-to-b from-[#ffd3b6] via-rose-100 to-rose-300 px-4 py-12 sm:px-8"><article className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl">
    <div className="grid md:grid-cols-2"><div className="min-h-80 bg-rose-100">{product.images?.[0] && <img src={`/uploads/${product.images[0]}`} alt={product.name} className="h-full w-full object-cover" />}</div>
      <div className="p-7 sm:p-10"><p className="text-sm font-semibold uppercase tracking-wider text-rose-600">{product.category.replaceAll("-", " ")}</p><h1 className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">{product.name}</h1><p className="mt-5 whitespace-pre-line leading-7 text-gray-700">{product.description}</p><p className="mt-7 font-semibold text-emerald-700">{product.availability || "In Stock"}</p><Link href="/catalog" className="mt-8 inline-block rounded-lg bg-rose-600 px-5 py-3 font-semibold text-white hover:bg-rose-700">Back to catalog</Link></div>
    </div>
  </article></main>;
}
