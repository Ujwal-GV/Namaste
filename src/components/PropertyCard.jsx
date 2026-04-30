import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { FaRupeeSign, FaEye } from "react-icons/fa";
import { getTimeAgo } from "../utils/TimeAgo";

export default function PropertyCard({ property }) {
  const { token, user } = useContext(AuthContext);

  const isNew = getTimeAgo(property.createdAt) === "New";

  return (
    <Link to={`/property/${property._id}`}>
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer">

        {/* IMAGE */}
        <div className="relative w-full h-44 bg-gray-100 overflow-hidden">

          {/* BADGE */}
          <span
            className={`absolute top-3 left-3 text-xs px-2 py-1 rounded-full font-medium backdrop-blur-sm ${
              isNew
                ? "bg-[#FF5A5F] text-white"
                : "bg-white/80 text-gray-700 border border-gray-200"
            }`}
          >
            {getTimeAgo(property.createdAt)}
          </span>

          {property?.images?.[0] ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              No Image
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-4 flex flex-col gap-2">

          {/* TITLE */}
          <h3 className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2 truncate">
            <IoHome className="text-gray-400" />
            {property.title}
          </h3>

          {/* LOCATION */}
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <FaLocationDot className="text-[#FF5A5F]" />
            <span className="truncate">{property.location}</span>
          </p>

          {/* PRICE */}
          <p className="text-[#FF5A5F] font-semibold flex items-center gap-1 text-base">
            <FaRupeeSign />
            {property.rent}
          </p>

          {/* CTA */}
          <button
            disabled={!token && user?.role !== "owner"}
            className={`mt-2 w-full py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition ${
              token || user?.role === "owner"
                ? "bg-[#FF5A5F]/10 text-[#FF5A5F] hover:bg-[#FF5A5F]/20"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            View <FaEye />
          </button>

        </div>
      </div>
    </Link>
  );
}