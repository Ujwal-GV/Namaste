import { useApply } from "../hooks/useRequests";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";

export default function MyPropertyCard({ property }) {
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
        <div className="bg-white p-4 rounded-xl shadow-black shadow-sm hover:shadow-gray-100 hover:cursor-pointer bg-transition">
            <p className="text-md font-semibold chicle-regular">{property.title}</p>
            <p className="geo-regular text-[16px] flex items-center gap-1"><FaLocationDot className="text-red-600" />{property.location}</p>
        </div>
    </Link>
  );
}