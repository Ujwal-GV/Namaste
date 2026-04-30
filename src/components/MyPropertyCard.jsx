import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";

export default function MyPropertyCard({ property }) {
  const { token, user } = useContext(AuthContext);

  return (
    <Link to={`/property/${property._id}`}>
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">

        {/* TITLE */}
        <h3 className="text-base font-semibold text-gray-800 line-clamp-1">
          {property.title}
        </h3>

        {/* LOCATION */}
        <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
          <FaLocationDot className="text-[#FF5A5F] text-sm" />
          <span className="truncate">{property.location}</span>
        </p>

      </div>
    </Link>
  );
}