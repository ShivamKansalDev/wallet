"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideBar() {
  const pathname = usePathname();

  return (
    <>
      <div className="flex flex-col items-center h-full overflow-hidden text-gray-400 bg-white rounded fixed inset-y-0 left-0 z-10 w-14   border-r bg-background sm:flex">
        <div className="flex flex-col items-center mt-3">
          <Link
            className={`flex items-center justify-center w-8 h-8 mt-3 mb-3 rounded hover:bg-[#007bff] hover:text-[#fff] ${
              pathname === "/dashboard/home"
                ? "w-8 h-8 bg-[#007bff] text-[#fff]"
                : ""
            }`}
            href="/dashboard/home"
          >
            <span class="material-symbols-outlined">home</span>
          </Link>

          <Link
            className={`flex items-center justify-center w-8 h-8 rounded mb-3 hover:bg-[#007bff] hover:text-[#fff] ${
              pathname === "/dashboard/manage"
                ? "w-8 h-8 bg-[#007bff] text-[#fff]"
                : ""
            }`}
            href="/dashboard/manage"
          >
            <span class="material-symbols-outlined">manage_accounts</span>
          </Link>

          <Link
            className={`flex items-center justify-center w-8 h-8 rounded mb-3 hover:bg-[#007bff] hover:text-[#fff] ${
              pathname === "/dashboard/transaction-history"
                ? "w-8 h-8 bg-[#007bff] text-[#fff]"
                : ""
            }`}
            href="/dashboard/transaction-history"
          >
            <span class="material-symbols-outlined">contract_edit</span>
          </Link>
        </div>
      </div>
    </>
  );
}
