import { useMyProperties } from "../hooks/useProperties";
import PropertyCard from "../components/PropertyCard";
import { useParams } from "react-router-dom";
import SkeletonCard from "../components/SkeletonCard";

export default function MyProperties() {
  const { id } = useParams();
  const { data, isLoading } = useMyProperties(id);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Properties</h2>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {data?.map((p) => (
            <PropertyCard key={p._id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}