import Header from "@/components/Header/Header";
import SideBar from "@/components/sidebar/Sidebar";

export const metadata = {
  title: "Next Shadcn Dashboard Starter",
  description: "Basic dashboard with Next.js and Shadcn",
};

export default function DashboardLayout({ children }) {
  return (
    <>
      <div className="flex">
        <div className="w-[4%] h-screen">
          <SideBar />
        </div>
        <div className="w-[96%] bg-[#f1f5f966]">
          <Header />
          <div className="m-14 md:m-16 xl:m-5">{children}</div>
        </div>
      </div>
    </>
  );
}
