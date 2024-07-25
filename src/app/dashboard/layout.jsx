import Header from "@/components/Header/Header";
import SideBar from "@/components/sidebar/Sidebar";


export const metadata = {
  title: 'Next Shadcn Dashboard Starter',
  description: 'Basic dashboard with Next.js and Shadcn'
};

export default function DashboardLayout({children}) {
  return (
    <>
      <Header />
      <div className="flex h-screen overflow-hidden">
        <SideBar />
        <main className="flex-1 overflow-hidden pt-16">{children}</main>
      </div>
    </>
  );
}