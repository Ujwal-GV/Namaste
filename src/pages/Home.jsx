import { useState, useMemo, useContext } from "react";
import { useGetProperties, useMyProperties, usePreferredProperties } from "../hooks/useProperties";
import useDebounce from "../hooks/useDebounce";
import PropertyCard from "../components/PropertyCard";
import SkeletonCard from "../components/SkeletonCard";
import { useLocations } from "../hooks/useLocations";
import FilterSidebar from "../components/FilterSidebar";
import { AuthContext } from "../context/AuthContext";
import { FaSort } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { user } = useContext(AuthContext);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [location, setLocation] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");

  const { t } = useTranslation();

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

  const {
    data: preferredProperties,
    isLoading: preferredPropertiesLoading,
  } = usePreferredProperties();

  const { data: locations } = useLocations();

  const filteredProperties = useMemo(() => {
    let props = data?.properties || [];

    if (maxPrice) {
      props = props.filter((p) => p.rent <= Number(maxPrice));
    }

    if (minPrice) {
      props = props.filter((p) => p.rent >= Number(minPrice));
    }

    if (location) {
      props = props.filter((p) =>
        p.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (sort === "low-high") {
      props = [...props].sort((a, b) => a.rent - b.rent);
    }

    if (sort === "high-low") {
      props = [...props].sort((a, b) => b.rent - a.rent);
    }

    return props;
  }, [data, maxPrice, minPrice, sort, location]);

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
    <div className="bg-[#f7f7f7] min-h-screen pb-24">

      {/* 🔍 SEARCH BAR */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <div className="bg-white border border-gray-200 shadow-sm rounded-full px-4 py-2 flex flex-row gap-2 items-center">

          <input
            className="w-full md:flex-1 px-4 py-2 rounded-full outline-none text-sm bg-transparent"
            placeholder={t("search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="w-30 px-3 py-2 rounded-full outline-none text-sm bg-transparent"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">Anywhere</option>
            {locations?.map((loc) => (
              <option key={loc._id} value={loc.name}>
                {loc.name}
              </option>
            ))}
          </select>

          {!isOwner && (
            <span
            title="Sort"
            className="rounded-full p-2 bg-[#FF5A5F] cursor-pointer"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaSort />
          </span>
          )}
        </div>
      </div>

      {/* 🏡 MAIN LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 mt-8 flex gap-8">

        {/* 🏘 CONTENT */}
        <div className="flex-1 space-y-10">

          {isOwner ? (
            <>
              {/* OWNER */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-[#222]">
                  {t("my_properties")}
                </h2>

                <span className="text-sm text-gray-500">
                  {ownerFilteredProperties?.length || 0} listings
                </span>
              </div>

              {myPropertiesLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : ownerFilteredProperties?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {ownerFilteredProperties.map((p) => (
                    <PropertyCard key={p._id} property={p} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 text-gray-400">
                  No properties posted yet
                </div>
              )}
            </>
          ) : (
            <>
              {/* TENANT */}

              {/* Nearby */}
              {preferredProperties?.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-[#222] mb-3">
                    Nearby stays
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {preferredProperties.map((p) => (
                      <PropertyCard key={p._id} property={p} />
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200" />

              {/* Explore */}
              <div>
                <h2 className="text-lg font-semibold text-[#222] mb-3">
                  Explore all stays
                </h2>

                {isLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                ) : filteredProperties?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProperties.map((p) => (
                      <PropertyCard key={p._id} property={p} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 text-gray-400">
                    No properties found
                  </div>
                )}
              </div>

              {/* PAGINATION */}
              <div className="mt-10 flex flex-col items-center gap-4">

                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  className="border border-gray-200 px-4 py-2 rounded-lg text-sm bg-white"
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
                      className={`px-4 py-2 rounded-full text-sm transition ${
                        page === i + 1
                          ? "bg-[#FF5A5F] text-white"
                          : "bg-white border border-gray-200 hover:bg-gray-100"
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
      </div>

      {/* 📱 MOBILE FILTER BUTTON */}
      {!isOwner && (
        <button
          onClick={() => setShowFilters(true)}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#FF5A5F] text-white px-6 py-3 rounded-full shadow-lg md:hidden"
        >
          {t("filters")}
        </button>
      )}

      {/* 📱 FILTER DRAWER */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex">

          {/* OVERLAY */}
          <div
            className="flex-1 bg-black/40"
            onClick={() => setShowFilters(false)}
          />

          {/* DRAWER */}
          <div className="w-full bg-transparent h-full shadow-xl animate">
            <FilterSidebar
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              sort={sort}
              setSort={setSort}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              onClose={() => setShowFilters(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}