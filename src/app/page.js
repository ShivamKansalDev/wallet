"use client";

import { ConnectWallet } from "@/components/ConnectWallet";
import SetTokenPrice from "@/components/SetTokenPrice";
import { useState } from "react";
export default function Home({ children }) {
  const [signer, setSigner] = useState(null);
  return (
    <>
      <div class="relative bg-black h-screen text-white overflow-hidden">
        <div class="absolute inset-0">
          <div class="absolute inset-0 bg-black opacity-50"></div>
        </div>

        <div class="relative z-10 flex flex-col justify-center items-center h-full text-center">
          <h1 class="text-5xl font-bold leading-tight mb-4">
            Welcome to Fipo Admin Panel
          </h1>

          {/* <a
            href="#"
            class="bg-yellow-400 text-gray-900 hover:bg-yellow-300 py-2 px-6 rounded-full text-lg font-semibold transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
          >
            Connect Wallet
          </a> */}

          <ConnectWallet setSigner={setSigner} />
          {signer && <SetTokenPrice signer={signer} />}
        </div>
      </div>
    </>
  );
}
