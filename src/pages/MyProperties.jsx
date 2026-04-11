import { useMyProperties } from "../hooks/useProperties";
import PropertyCard from "../components/PropertyCard";
import { useParams } from "react-router-dom";

export default function MyProperties() {
  const { id } = useParams();
  const { data, isLoading } = useMyProperties(id);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">My Properties</h2>

      {isLoading ? (
        <p>Loading...</p>
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