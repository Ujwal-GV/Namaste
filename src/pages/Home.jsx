import { useState, useMemo, useEffect, useContext } from "react";
import { useGetProperties, useMyProperties } from "../hooks/useProperties";
import useDebounce from "../hooks/useDebounce";
import PropertyCard from "../components/PropertyCard";
import SkeletonCard from "../components/SkeletonCard";
import { useLocations } from "../hooks/useLocations";
import FilterSidebar from "../components/FilterSidebar";
import { FaFilter } from "react-icons/fa";
import { TbError404 } from "react-icons/tb";
import { AuthContext } from "../context/AuthContext";
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa";

export default function Home() {
  const { user } = useContext(AuthContext);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [location, setLocation] = useState("");
  const [mobileView, setMobileView] = useState(false);

  const isOwner = user?.role === "owner";
  const userId = user?.id;

  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth >= 1024) {
        setShowFilters(false);
        }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    }, []);

  // UI Filters (frontend only)
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");

  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading } = useGetProperties(
    isOwner ? "" : debouncedSearch,
    page,
    isOwner ? "" : location,
    limit,
  );

  const {
    data: myProperties,
    isLoading: myPropertiesLoading
  } = useMyProperties(userId);  

  const { data: locations } = useLocations();

  // FRONTEND FILTERING + SORTING
  const filteredProperties = useMemo(() => {
    let props = data?.properties || [];

    // Price filter
    if (maxPrice) {
      props = props.filter((p) => p.rent <= Number(maxPrice));
    }

    // Sorting
    if (sort === "low-high") {
      props = [...props].sort((a, b) => a.rent - b.rent);
    } else if (sort === "high-low") {
      props = [...props].sort((a, b) => b.rent - a.rent);
    }

    return props;
  }, [data, maxPrice, sort]);

  const ownerFilteredProperties = useMemo(() => {
    let props = myProperties || [];

    // Search filter
    if (search) {
        props = props.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
        );
    }

    // Location filter
    if (location) {
        props = props.filter((p) =>
        p.location.toLowerCase().includes(location.toLowerCase())
        );
    }

    return props;
    }, [myProperties, search, location]);

  return (
    <div className="flex">
            {showFilters && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex">
                    <div className="relative inset-0 bg-white h-full bg-opacity-40 shadow-lg">
                        <FilterSidebar
                            maxPrice={maxPrice}
                            setMaxPrice={setMaxPrice}
                            sort={sort}
                            setSort={setSort}
                            setMobile={true}
                        />
                        <button
                            className="w-full absolute bottom-0 bg-black text-white py-2"
                            onClick={() => setShowFilters(false)}
                        >
                            Close
                        </button>
                    </div>
            
                    {/* Click outside to close */}
                    <div
                        className="flex-1"
                        onClick={() => setShowFilters(false)}
                    />
                </div>
            )}
      {/* 🔽 Main Content */}
      <div className="flex-1 p-6 max-w-full mx-auto">

        {/* Top Bar */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Explore Properties</h1>         
          {/* Mobile Filter Toggle */}
          <button
            className="md:hidden bg-gray-300 text-black px-2 py-1 rounded"
            onClick={() => setShowFilters(true)}
          >
            <FaFilter className="text-xsm" />
          </button>
        </div>

        {/* Search + Location */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            className="w-full p-3 border rounded-xl"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="p-3 border rounded-xl"
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
        </div>

        {/* Grid */}
        {isOwner ? (
        // OWNER VIEW
        myPropertiesLoading ? (
            <div className="grid md:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
            ))}
            </div>
        ) : (
            <>
            {ownerFilteredProperties?.length > 0 ? (
                //<div className="grid md:grid-cols-4 gap-6 p-5 shadow-sm shadow-gray-600 rounded-full max-h-[50vh] custom-scroll overflow-y-auto">

                <div className="grid md:grid-cols-4 gap-6 p-5 shadow-sm shadow-gray-600 rounded-lg h-[70vh] custom-scroll overflow-y-auto">
                {ownerFilteredProperties.map((p) => (
                    <PropertyCard key={p._id} property={p} />
                ))}
                </div>
            ) : (
                <p className="flex gap-2 mx-auto items-center justify-center w-full text-center p-2 bg-gray-100 rounded-md">
                    No Properties Posted <TbError404 />
                </p>
            )}
            </>
        )
        ) : (
        // USER VIEW
        isLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
            ))}
            </div>
        ) : (
            <>
            {filteredProperties?.length > 0 ? (
                <div className="grid md:grid-cols-3 p-5 gap-6 h-[52vh] custom-scroll overflow-y-auto">
                {filteredProperties.map((p) => (
                    <PropertyCard key={p._id} property={p} />
                ))}
                </div>
            ) : (
                <p className="flex gap-2 mx-auto items-center justify-center w-full text-center p-2 bg-gray-100 rounded-md">
                    No Poperties Found <TbError404 />
                </p>
            )}
            </>
        )
        )}

        {/* Pagination */}
        {!isOwner && 
        <>
            <div className="flex justify-end mt-4">
            <select
                value={limit}
                onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1); // reset page
                }}
                className="border p-2 rounded"
            >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
            </select>
            </div>
            <div className="flex justify-between items-center mt-6 bg-gray-100 rounded-full p-2">
                <button
                    disabled={page === 1}
                    className={`px-4 py-4 bg-gray-200 rounded-full border-2 border-gray-400 hover:bg-gray-400 ${page === 1 ? 'opacity-0' : 'bg-gray-200 cursor-pointer'}`}
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                >
                    <FaLongArrowAltLeft />
                </button>

                {/* Page Numbers */}
                    <div className="flex gap-2">
                        {[...Array(data?.pages || 1)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={`px-3 py-1 rounded ${
                            page === i + 1
                                ? "bg-black text-white"
                                : "bg-gray-200"
                            }`}
                        >
                            {i + 1}
                        </button>
                        ))}
                    </div>

                <button
                    disabled={page === data?.pages}
                    className={`px-4 py-4 bg-gray-200 rounded-full border-2 border-gray-400 hover:bg-gray-400 ${page === data?.pages ? 'opacity-0' : 'bg-gray-200 cursor-pointer'}`}
                    onClick={() => setPage((p) => p + 1)}
                >
                    <FaLongArrowAltRight />
                </button>
            </div>
        </>
        }
      </div>

      

      {/* Sidebar Filters */}
      {!isOwner && 
        <div className="hidden lg:block">
            <FilterSidebar
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                sort={sort}
                setSort={setSort}
            />
        </div>
      }
    </div>
  );
}