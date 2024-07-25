"use client";
import { useEffect, useState } from "react";

export default function Page2() {
  const [signer, setSigner] = useState(null);
  useEffect(() => {
    const data = localStorage.getItem("signer");
    console.log(data);
    if (data) {
      setSigner(JSON.parse(data));
    }
  }, []);

  return (
    <>
      <section class="text-gray-700 body-font border rounded-[16px] border-gray-400 h-screen ">
        <div class="container mx-auto mt-20 ">
          <div class="flex flex-wrap -m-4 text-center justify-center">
            <div class="p-4 md:w-1/4 sm:w-1/2 w-full">
              <div class="relative h-full ml-0 mr-0 sm:mr-10">
                <span class="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-gray-500 rounded-lg"></span>
                <div class="relative h-full p-5 bg-white border-2 border-gray-500 rounded-lg">
                  <div class="flex items-center -mt-1">
                    <h3 class="my-2 ml-3 text-lg font-bold text-gray-800">
                      {" "}
                      Tokens Left for Sale
                    </h3>
                  </div>
                  <p class="mb-2 text-gray-600">500000.</p>
                </div>
              </div>
            </div>
            <div class="p-4 md:w-1/4 sm:w-1/2 w-full">
              <div class="relative h-full ml-0 mr-0 sm:mr-10">
                <span class="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-gray-500 rounded-lg"></span>
                <div class="relative h-full p-5 bg-white border-2 border-gray-500 rounded-lg">
                  <div class="flex items-center -mt-1">
                    <h3 class="my-2 ml-3 text-lg font-bold text-gray-800">
                      {" "}
                      Tokens sold
                    </h3>
                  </div>
                  <p class="mb-2 text-gray-600">5000.</p>
                </div>
              </div>
            </div>
            <div class="p-4 md:w-1/4 sm:w-1/2 w-full">
              <div class="relative h-full ml-0 mr-0 sm:mr-10">
                <span class="absolute top-0 left-0 w-full h-full mt-1 ml-1 bg-gray-500 rounded-lg"></span>
                <div class="relative h-full p-5 bg-white border-2 border-gray-500 rounded-lg">
                  <div class="flex items-center -mt-1">
                    <h3 class="my-2 ml-3 text-lg font-bold text-gray-800">
                      {" "}
                      Raised Amount(USD)
                    </h3>
                  </div>
                  <p class="mb-2 text-gray-600">72000.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
