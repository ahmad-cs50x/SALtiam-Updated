'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const DeliverModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-lg w-[90%] max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}>
        <button className="absolute right-3 top-3" onClick={onClose}>
        <Image src="/close.png" alt="Close" width={24} height={24} />
        </button>

        <h2 className="text-lg text-black text-center font-semibold mb-6">
          Choose your location
        </h2>
        <p className="text-sm text-gray-600 mb-4 text-center">
          Enter your address or select a saved location to see availability and delivery options.
        </p>

        <input
          type="text"
          placeholder="Country"
          className="w-full border border-gray-300 rounded-md text-black px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-rose-500"/>
        <input
          type="text"
          placeholder="Zip / Postal Code"
          className="w-full border border-gray-300 rounded-md text-black px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-rose-500"/>
        <input
          type="text"
          placeholder="Enter address"
          className="w-full border border-gray-300 rounded-md text-black px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-rose-500"/>

        <button
          onClick={onClose}
          className="w-full bg-rose-600 text-white py-2 rounded-md hover:bg-rose-700">
          Done
        </button>
      </div>
    </div>
  );
};

export default DeliverModal;
