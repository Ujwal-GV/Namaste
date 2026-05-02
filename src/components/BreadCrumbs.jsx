import { Link, useLocation } from "react-router-dom";
import { useBreadcrumb } from "../context/BreadcrumbContext";

const routeMap = {
  admin: "Admin",
  dashboard: "Dashboard",
  owners: "Owner Requests",
  list: "Users",
  user: "User",
  profile: "Profile",
  "my-properties": "My Properties",
  "add-property": "Add Property",
  "owner-requests": "Applications",
  "user-applications": "My Requests",
  property: "Property",
  "apply-owner": "Become Owner",
  "property-requests": "Requests",
  chat: "Chat",
};

const validRoutes = [
  "/",
  "/admin/dashboard",
  "/admin/owners",
  "/admin/list",
  "/profile",
  "/add-property",
  "/owner-requests",
  "/user-applications",
  "/apply-owner",
];

export default function Breadcrumbs() {
  const location = useLocation();
  const { dynamicLabels } = useBreadcrumb();

  const segments = location.pathname.split("/").filter(Boolean);

  return (
    <div className="text-sm text-gray-500 flex items-center justify-start ml-5 flex-wrap gap-2 mb-4">

      <Link to="/" className="font-medium hover:text-black">
        Home
      </Link>

      {segments.map((seg, index) => {
        const path = "/" + segments.slice(0, index + 1).join("/");

        const isDynamicRoute =
            path.includes("/my-properties/") ||
            path.includes("/admin/user/") ||
            path.includes("/property/");

        const isLast = index === segments.length - 1;

        const isValid =
            validRoutes.includes(path) || isDynamicRoute;

        const isId = seg.length > 20;

        const label =
            dynamicLabels[seg] ||
            (isId ? "Details" : routeMap[seg] || seg);

        return (
            <span key={path} className="flex items-center gap-2">
            <span>&gt;</span>

            {isLast || !isValid ? (
                <span className="text-black font-semibold cursor-default">
                {label}
                </span>
            ) : (
                <Link
                to={path}
                className="hover:text-black capitalize"
                >
                {label}
                </Link>
            )}
            </span>
        );
        })}
    </div>
  );
}