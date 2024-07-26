"use client";

import { ConnectWallet } from "@/components/ConnectWallet";
import SetTokenPrice from "@/components/SetTokenPrice";
import { useRouter } from "next/router";
export default function Home({ children }) {
  // const router = useRouter();

  // function navigate(){
  //   router.push("/dashboard/home");
  // }

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

          <ConnectWallet />
          {/* {signer && <SetTokenPrice signer={signer} />} */}
        </div>
      </div>
    </>
  );
}
