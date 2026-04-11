import { useApply } from "../hooks/useRequests";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { FaRupeeSign, FaEye } from "react-icons/fa";
import { MdDeleteOutline, MdModeEditOutline } from "react-icons/md";

export default function PropertyCard({ property }) {
  const { token, user } = useContext(AuthContext);
  const { mutate } = useApply();

  const handleApply = () => {
    mutate({
      propertyId: property._id,
      message: "Interested in this property",
    });
  };

  return (
    <Link to={`/property/${property._id}`}>
        <div className="bg-white p-4 rounded-xl shadow-gray-600 shadow-md hover:shadow-gray-100 hover:cursor-pointer bg-transition">
        <h3 className="text-xl font-semibold mb-2 chicle-regular flex items-center gap-1"><IoHome />{property.title}</h3>
        <p className="geo-regular flex gap-2 items-center"><FaLocationDot className="text-red-600" />{property.location}</p>
        <p className="grechen-fuemen-regular text-green-600 flex gap-2 items-center"><FaRupeeSign className="text-green-600" />{property.rent}</p>

        {user?.role === "owner" ? (
            <div className="flex justify-end gap-2">
              {/* <button className="mt-4 bg-modified text-white p-2 rounded hover:bg-gray-700">
                <MdModeEditOutline />
              </button>
              <button className="mt-4 bg-red-600 text-white p-2 rounded hover:bg-red-800">
                <MdDeleteOutline />
              </button> */}

              <button className="mt-4 bg-modified text-white p-2 rounded hover:bg-gray-700 flex items-center gap-2 text-xsm">View <FaEye /></button>
            </div>
            ) : (
            <button
                className={`mt-4 w-full py-2 rounded ${
                token
                    ? "bg-modified text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
                View
            </button>
            )}
        </div>
    </Link>
  );
}