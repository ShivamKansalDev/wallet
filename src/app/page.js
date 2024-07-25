"use client";

import { ConnectWallet } from "@/components/ConnectWallet";
import SetTokenPrice from "@/components/SetTokenPrice";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
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

          <ConnectWallet
            setSigner={(data) => {
              console.log("&&&***data dd: ", data);
              if (data) {
                setSigner(data);
                // localStorage.setItem("signer", JSON.stringify(data));
                redirect("/dashboard/home");
              }
            }}
          />
          {/* {signer && <SetTokenPrice signer={signer} />} */}
        </div>
      </div>
    </>
  );
}
