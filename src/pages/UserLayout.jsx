import Breadcrumbs from "../components/BreadCrumbs";
import Navbar from "../pages/Navbar";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
  return (
    <>
      <Navbar />
      <div className="pt-2">
        <Breadcrumbs />
        <Outlet />
      </div>
    </>
  );
}