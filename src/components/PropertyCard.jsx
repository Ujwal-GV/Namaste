import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { FaRupeeSign, FaEye } from "react-icons/fa";

export default function PropertyCard({ property }) {
  const { token, user } = useContext(AuthContext);

  return (
    <Link to={`/property/${property._id}`}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300">

        <div className="w-full h-40 bg-gray-200">
          {property?.images?.[0] ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col gap-2">

          <h3 className="text-lg md:text-xl font-semibold flex items-center gap-2 truncate">
            <IoHome />
            {property.title}
          </h3>

          <p className="text-sm text-gray-600 flex items-center gap-2">
            <FaLocationDot className="text-red-500" />
            {property.location}
          </p>

          <p className="text-green-600 font-bold flex items-center gap-2 text-base md:text-lg">
            <FaRupeeSign />
            {property.rent}
          </p>

          <button
            disabled={!token && user?.role !== "owner"}
            className={`mt-2 w-full py-2 rounded-lg flex items-center justify-center gap-2 text-sm md:text-base transition ${
              token || user?.role === "owner"
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            View <FaEye />
          </button>

        </div>
      </div>
    </Link>
  );
}