import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div>
      <div className="grid-background"></div>
      <main className="min-h-screen pr-14 pl-14">
        <Header />
        <Outlet />
      </main>

      <div className="p-10 mt-10 text-center bg-gray-800">
        made with love by Arshad
      </div>
    </div>
  );
};

export default AppLayout;
