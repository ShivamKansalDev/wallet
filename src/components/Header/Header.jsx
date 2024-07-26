"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ConnectWallet } from "../ConnectWallet";
import { useRouter } from "next/navigation";

export default function Header() {
  const [pathName, setPathName] = useState("");
  const address = usePathname();
  const router = useRouter();

  const allPaths = {
    home: "Home",
    manage: "Manage",
    "transaction-history": "Transaction History"
  };

  useEffect(() => {
    const path = address.split("/");
    if (path.length > 0) {
      const currentPage = path[path.length - 1];
      setPathName(allPaths[currentPage]);
    }
  }, [address]);

  return (
    <>
      <nav
        class="flex justify-between bg-white p-5 shadow-sm border-b-2 ml-5 md:ml-0"
        aria-label="Breadcrumb"
      >
        <ol class="inline-flex items-center  space-x-1 md:space-x-2">
          <li class="inline-flex items-center">
            <a
              href="#"
              class="text-gray-700 hover:text-gray-900 inline-flex items-center"
            >
              Dashboard
            </a>
          </li>
          <li>
            <div class="flex items-center">
              <svg
                class="w-6 h-6 text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
              <a
                href="#"
                className="text-gray-700 hover:text-gray-900 ml-1 md:ml-2 text-sm font-medium "
              >
                {pathName}
              </a>
            </div>
          </li>
        </ol>
        <div>
          <ConnectWallet
            navigate={() => {
              if (address.includes("/dashboard")) {
                // window.location.replace("/");
                router.push("/");
              }
            }}
          />
        </div>
      </nav>
    </>
  );
}
