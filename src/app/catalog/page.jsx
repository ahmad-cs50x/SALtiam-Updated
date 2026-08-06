"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

const Catalog = () => {
  const catalogItems = [
    { title: "Food Salt", img: "/1.png", link: "/categories/food-salt" },
    { title: "Sea Salt", img: "/2.png", link: "/categories/sea-salt" },
    { title: "Animal Salt", img: "/3.png", link: "/categories/animal-salt" },
    { title: "Home & Decor", img: "/4.png", link: "/categories/home-decor" },
    { title: "Rock Salt", img: "/5.png", link: "/categories/rock-salt" },
    { title: "Salt Brick", img: "/6.png", link: "/categories/salt-brick" },
    { title: "Salt Lamps", img: "/7.png", link: "/categories/salt-lamps" },
    { title: "Salt & Beauty", img: "/8.png", link: "/categories/salt-beauty" },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden -mt-10 bg-gradient-to-b from-[#ffd3b6] via-rose-200 to-rose-300 pt-24 pb-20">
      {/* Soft decorative blobs */}
      <div className="pointer-events-none absolute  -left-24 h-72 w-72 rounded-full bg-rose-300/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-orange-200/50 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center sm:mb-12">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-rose-600/80">
            Our Collection
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-rose-800 sm:text-4xl">
            Explore Our Products
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-rose-700/70 sm:text-base">
            Discover pure, natural salt products crafted for every need.
          </p>
        </div>

        {/* Grid — tighter gaps + smaller cards */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {catalogItems.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="group relative block focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2 focus-visible:ring-offset-rose-100"
            >
              <div className="relative overflow-hidden rounded-xl bg-rose-300 p-2.5 shadow-md backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg sm:p-3">
                {/* Image container — smaller */}
                <div className="relative mb-2.5 aspect-square overflow-hidden rounded-lg">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="h-full w-full object-contain p-2"
                  />
                </div>

                {/* Title */}
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-rose-900 transition-colors duration-300 group-hover:text-rose-700 sm:text-lg">
                    {item.title}
                  </h3>
                  <span className="mt-0.5 inline-block text-[10px] font-medium text-rose-500 opacity-0 transition-all duration-300 group-hover:opacity-100 sm:text-xs">
                    View products →
                  </span>
                </div>

                {/* Subtle bottom accent on hover */}
                <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-rose-400 to-orange-400 transition-transform duration-300 group-hover:scale-x-100" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Catalog;




// 'use client';
// import React from 'react';
// import Link from 'next/link';

// const Catalog = () => {
//   const catalogItems = [
//     { title: "Food Salt",     img: "https://i.imghippo.com/files/QBx7963BM.png",    link: "/categories/food-salt" },
//     { title: "Sea Salt",      img: "https://i.imghippo.com/files/huH2145GFk.png",    link: "/categories/sea-salt" },
//     { title: "Animal Salt",   img: "https://i.imghippo.com/files/aWSv2641tLQ.png",   link: "/categories/animal-salt" },
//     { title: "Home & Decor",  img: "https://i.imghippo.com/files/oWZb1584OXM.png",   link: "/categories/home-decor" },
//     { title: "Rock Salt",     img: "https://i.imghippo.com/files/xCe7830mVo.png",    link: "/categories/rock-salt" },
//     { title: "Salt Brick",    img: "https://i.imghippo.com/files/xoa8660yg.png",     link: "/categories/salt-brick" },
//     { title: "Salt Lamps",    img: "https://i.imghippo.com/files/LLkb6315tqY.png",   link: "/categories/salt-lamps" },
//     { title: "Salt & Beauty", img: "https://i.imghippo.com/files/SQ8074ULo.png",     link: "/categories/salt-beauty" }
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-[#ffd3b6] via-rose-300 to-rose-300 text-gray-800 pt-20 pb-16">

//       {/* Title */}
//       <h2 className="text-3xl sm:text-4xl font-bold text-center text-rose-700 mb-10 sm:mb-16">
//         Explore Our Products
//       </h2>

//       {/* Responsive Grid */}
//       <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-16 mb-16">
//         <div className="
//           grid 
//           grid-cols-2 
//           gap-5
//           sm:gap-6
//           lg:gap-12
//           sm:grid-cols-3 
//           lg:grid-cols-4 
//           place-items-center 
//         ">
//           {catalogItems.map((item, index) => (
//             <Link
//               key={index}
//               href={item.link}
//               className="w-full block md:w-auto" >
//               {/* Fixed width ONLY on mobile, full width on desktop */}
//               <div className="w-40 h-40 mx-auto md:w-52 md:h-36  bg-rose-400 rounded-xl p-4 hover:scale-105 transition duration-300 hover:shadow-2xl shadow-lg flex flex-col items-center justify-center">
//                 <img
//                   src={item.img}
//                   alt={item.title}
//                   className="w-20 h-20 mb-3 object-contain"
//                 />
//                 <p className="text-white font-semibold hover:scale-110 transition duration-300 hover:text-pink-800 text-lg text-center leading-tight px-2">
//                   {item.title}
//                 </p>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Catalog;
