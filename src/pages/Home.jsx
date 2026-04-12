import { useState, useMemo, useContext } from "react";
import { useGetProperties, useMyProperties } from "../hooks/useProperties";
import useDebounce from "../hooks/useDebounce";
import PropertyCard from "../components/PropertyCard";
import SkeletonCard from "../components/SkeletonCard";
import { useLocations } from "../hooks/useLocations";
import FilterSidebar from "../components/FilterSidebar";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
  const { user } = useContext(AuthContext);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [location, setLocation] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const isOwner = user?.role === "owner";
  const userId = user?.id;

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useGetProperties(
    isOwner ? "" : debouncedSearch,
    page,
    isOwner ? "" : location,
    limit
  );

  const {
    data: myProperties,
    isLoading: myPropertiesLoading,
  } = useMyProperties(userId);

  const { data: locations } = useLocations();

  const filteredProperties = useMemo(() => {
    return data?.properties || [];
  }, [data]);

  const ownerFilteredProperties = useMemo(() => {
    let props = myProperties || [];

    if (search) {
      props = props.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (location) {
      props = props.filter((p) =>
        p.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    return props;
  }, [myProperties, search, location]);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">

      <div className="max-w-5xl mx-auto px-4 mt-4">
        <div className="bg-white shadow-md rounded-2xl p-3 flex flex-col md:flex-row gap-3">

          <input
            className="w-full md:flex-1 px-4 py-3 border rounded-xl outline-none text-sm md:text-base"
            placeholder="Search properties..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="w-full md:w-48 px-4 py-3 border rounded-xl outline-none text-sm md:text-base"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">All Locations</option>
            {locations?.map((loc) => (
              <option key={loc._id} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>

          {/* <button className="w-full md:w-auto bg-black text-white px-6 py-3 rounded-xl text-sm md:text-base">
            Search
          </button> */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6">

        {isOwner ? (
          myPropertiesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : ownerFilteredProperties?.length > 0 ? (
            <>
              <h2 className="text-lg font-semibold mb-4">My Properties</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {ownerFilteredProperties.map((p) => (
                  <PropertyCard key={p._id} property={p} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20 text-gray-500">
              No properties posted
            </div>
          )
        ) : (
          <>
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredProperties?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProperties.map((p) => (
                  <PropertyCard key={p._id} property={p} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-500">
                No properties found
              </div>
            )}

            <div className="mt-10 flex flex-col items-center gap-4">

              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="border px-3 py-2 rounded-lg text-sm"
              >
                <option value={8}>8 / page</option>
                <option value={16}>16 / page</option>
                <option value={24}>24 / page</option>
              </select>

              <div className="flex gap-2 flex-wrap justify-center">
                {[...Array(data?.pages || 1)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-4 py-2 rounded-full text-sm ${
                      page === i + 1
                        ? "bg-black text-white"
                        : "bg-white border hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {!isOwner && (
        <button
          onClick={() => setShowFilters(true)}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-3 rounded-full shadow-lg md:hidden"
        >
          Filters
        </button>
      )}

      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex">
          <div className="bg-white w-80 p-4 shadow-lg">
            <FilterSidebar />
            <button
              className="mt-4 w-full bg-black text-white py-2 rounded"
              onClick={() => setShowFilters(false)}
            >
              Close
            </button>
          </div>

          <div className="flex-1" onClick={() => setShowFilters(false)} />
        </div>
      )}
    </div>
  );
}