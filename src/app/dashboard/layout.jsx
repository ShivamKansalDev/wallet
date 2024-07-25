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
        <div className="w-[96%] bg-gray-300">
          <Header />
          <div className="p-5">{children}</div>
        </div>
      </div>
    </>
  );
}
