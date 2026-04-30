import { useMyProperties } from "../hooks/useProperties";
import PropertyCard from "../components/PropertyCard";
import { useParams } from "react-router-dom";
import SkeletonCard from "../components/SkeletonCard";

export default function MyProperties() {
  const { id } = useParams();
  const { data, isLoading } = useMyProperties(id);

  return (
    <div className="bg-[#f7f7f7] min-h-screen py-6">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-semibold text-[#222]">
            Your listings
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {data?.length || 0} properties listed
          </p>
        </div>

        {/* CONTENT */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : data?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <h3 className="text-lg font-semibold text-[#222] mb-2">
              No properties yet
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              Start by adding your first property
            </p>

            <button
              onClick={() => window.location.href = "/add-property"}
              className="bg-[#FF5A5F] text-white px-5 py-2 rounded-xl text-sm hover:opacity-90 transition"
            >
              Add Property
            </button>
          </div>
        )}

      </div>
    </div>
  );
}