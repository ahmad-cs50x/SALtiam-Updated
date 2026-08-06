"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { api } from "@/lib/apiClient";

type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
};

type Product = {
  _id: string;
  name: string;
  description: string;
  category: string;
  availability?: string;
  images?: string[];
  rating?: number;
  numReviews?: number;
  stockCount?: number;
  reviews?: Review[];
};

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Zoom state
  const [isHovering, setIsHovering] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // New review form state
  const [reviewerName, setReviewerName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [userReviews, setUserReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (!params?.id) return;
    api.get(`/api/products/${params.id}`)
      .then((response) => {
        const prod = response.data;
        setProduct(prod);
        if (prod?.reviews) {
          setUserReviews(prod.reviews);
        }
        // Fetch similar products based on category
        if (prod?.category) {
          api.get("/api/products")
            .then((res) => {
              const all = res.data || [];
              setSimilarProducts(all.filter((p: Product) => p.category === prod.category && p._id !== prod._id));
            })
            .catch(() => { });
        }
      })
      .catch((err) => setError(err?.response?.data?.error || "Product could not be loaded."));
  }, [params?.id]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setCursorPosition({ x, y });
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) return;

    const newRev: Review = {
      id: Date.now().toString(),
      name: reviewerName,
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toLocaleDateString(),
    };

    setUserReviews([newRev, ...userReviews]);
    setReviewerName("");
    setReviewComment("");
    setReviewRating(5);
  };

  if (error) {
    return (
      <main className="min-h-screen bg-rose-100 p-12 text-center">
        <p className="text-xl text-rose-900">{error}</p>
        <Link href="/catalog" className="mt-5 inline-block text-rose-700 underline">Back to catalog</Link>
      </main>
    );
  }

  if (!product) {
    return <main className="min-h-screen bg-rose-100 p-12 text-center text-rose-900 font-medium">Loading product...</main>;
  }

  const images = product.images && product.images.length > 0 ? product.images : [];
  const currentImage = images[selectedImageIndex] ? `/uploads/${images[selectedImageIndex]}` : null;

  const stockCount = product.stockCount ?? (product.availability?.toLowerCase().includes("low") ? 4 : 18);
  const stockBadge = stockCount <= 5
    ? { label: `Low Stock (${stockCount} left)`, color: "bg-amber-100 text-amber-800 border-amber-300" }
    : { label: "In Stock", color: "bg-emerald-100 text-emerald-800 border-emerald-300" };

  const totalReviews = (product.numReviews || 12) + userReviews.length;
  const avgRating = product.rating || 4.6;

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#ffd3b6] via-rose-100 to-rose-300 px-4 py-12 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/catalog" className="inline-flex items-center text-sm font-semibold text-rose-800 transition-colors hover:text-rose-950">
          ← Back to catalog
        </Link>

        {/* Main Product Container */}
        <article className="mt-6 overflow-visible rounded-3xl bg-white p-6 sm:p-10 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left Column: Vertical Thumbnails + Large Image with Zoom */}
            <div className="lg:col-span-7 flex flex-col sm:flex-row gap-4">
              {/* Thumbnails (Top to bottom) */}
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[450px] scrollbar-thin">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${selectedImageIndex === idx ? "border-rose-600 ring-2 ring-rose-300" : "border-gray-200 hover:border-gray-400"
                      }`}
                  >
                    <img src={`/uploads/${img}`} alt={`${product.name} ${idx}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>

              {/* Large Image Box with Amazon Zoom Effect */}
              <div className="relative flex-1">
                <div
                  ref={imageContainerRef}
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  onMouseMove={handleMouseMove}
                  className="relative h-[420px] w-full cursor-crosshair overflow-hidden rounded-2xl bg-rose-50 border border-gray-100 shadow-inner"
                >
                  {currentImage ? (
                    <img src={currentImage} alt={product.name} className="h-full w-full object-contain p-4" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-rose-300">No Image Available</div>
                  )}

                  {/* Zoom Lens Indicator */}
                  {isHovering && currentImage && (
                    <div
                      className="absolute pointer-events-none border-2 border-rose-500 bg-rose-500/20 shadow-sm"
                      style={{
                        width: '120px',
                        height: '120px',
                        top: `calc(${cursorPosition.y}% - 60px)`,
                        left: `calc(${cursorPosition.x}% - 60px)`,
                      }}
                    />
                  )}
                </div>

                {/* Amazon Style Zoomed Hover Panel (Appears to the right on desktop) */}
                {isHovering && currentImage && (
                  <div className="hidden lg:block absolute left-full top-0 ml-6 h-[420px] w-[450px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl z-50">
                    <div
                      className="h-full w-full bg-no-repeat"
                      style={{
                        backgroundImage: `url(${currentImage})`,
                        backgroundPosition: `${cursorPosition.x}% ${cursorPosition.y}%`,
                        backgroundSize: '250%',
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Details, Status, Ratings */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-rose-600">
                    {product.category?.replaceAll("-", " ")}
                  </span>
                  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold shadow-sm ${stockBadge.color}`}>
                    {stockBadge.label}
                  </span>
                </div>

                <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-rose-800 tracking-tight">
                  {product.name}
                </h1>

                {/* Rating and Reviews Summary */}
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`h-4 w-4 ${i < Math.floor(avgRating) ? "fill-current" : "text-gray-300"}`} viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-900">{avgRating.toFixed(1)}</span>
                  <span className="text-xs text-gray-500">({totalReviews} customer reviews)</span>
                </div>

                <div className="my-5 border-t border-gray-100" />

                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-rose-700 uppercase tracking-wider">Description</h3>
                  <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Stock Status: <strong className="text-gray-800">{stockCount} units available</strong></span>
                  <span>Category: <strong className="text-gray-800">{product.category}</strong></span>
                </div>
                <Link
                  href="/sendaninquiry"
                  className="w-full text-center rounded-xl bg-gradient-to-r from-rose-600 to-rose-800 px-5 py-3.5 font-bold text-white shadow-md transition-all hover:bg-rose-700 hover:shadow-lg"
                >
                  Send an inquiry
                </Link>
              </div>

            </div>

          </div>
        </article>

        {/* Reviews Section & Add Review Form */}
        <section className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Customer Reviews List */}
          <div className="lg:col-span-7 bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews ({totalReviews})</h2>

            <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
              {userReviews.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No reviews yet. Be the first to add one!</p>
              ) : (
                userReviews.map((rev) => (
                  <div key={rev.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-gray-900">{rev.name}</h4>
                      <span className="text-xs text-gray-400">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 my-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`h-3.5 w-3.5 ${i < rev.rating ? "fill-current" : "text-gray-300"}`} viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Add Review Form */}
          <div className="lg:col-span-5 bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Add a Review</h2>
            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full rounded-xl text-black border border-gray-200 px-4 py-2.5 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Rating</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full text-black rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Very Good</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Poor</option>
                  <option value={1}>1 Star - Terrible</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">Comment</label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Write your review here..."
                  className="w-full text-black rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-rose-600 px-5 py-3 font-semibold text-white shadow-md transition-all hover:bg-rose-700"
              >
                Submit Review
              </button>
            </form>
          </div>

        </section>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-rose-950 mb-6">Similar Products in {product.category.replaceAll("-", " ")}</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similarProducts.slice(0, 3).map((item) => (
                <Link
                  key={item._id}
                  href={`/productdetail/${item._id}`}
                  className="group flex flex-col overflow-hidden rounded-2xl bg-white/90 shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="h-48 w-full bg-rose-50 overflow-hidden">
                    {item.images?.[0] && (
                      <img src={`/uploads/${item.images[0]}`} alt={item.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-rose-600 line-clamp-1">{item.name}</h3>
                      <p className="mt-1 text-xs text-gray-500 line-clamp-2">{item.description}</p>
                    </div>
                    <span className="mt-4 text-xs font-semibold uppercase text-rose-600">View details →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}