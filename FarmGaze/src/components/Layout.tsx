import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <main className="flex-1 container mx-auto px-4 py-8 lg:py-12">
          <Outlet />
        </main>
      </div>
    </div>
  );
}; 