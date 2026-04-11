import { useState } from "react";
import { FaFilter } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";

export default function FilterSidebar({
  maxPrice,
  setMaxPrice,
  sort,
  setSort,
  setMobile
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`h-screen bg-white shadow-lg transition-all duration-300 ${
        collapsed ? "w-16" : "w-72"
      }`}
    >
      {/* Toggle Button */}
      <div className="flex justify-between items-center p-4 border-b">
        {!collapsed && <h2 className="font-bold text-lg">Filters</h2>}

        {!setMobile ? (
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="text-sm bg-gray-200 px-2 py-1 rounded"
                >
                {collapsed ? <FaFilter /> : <IoIosCloseCircle />}
                </button>) : " "}
        
      </div>

      {/* Content */}
      {!collapsed && (
        <div className="p-4 space-y-6">

          {/* Price Filter */}
          <div>
            <label className="text-sm font-semibold">Max Price</label>
            <input
              type="number"
              placeholder="e.g. 20000"
              className="w-full mt-1 p-2 border rounded"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          {/* Sorting */}
          <div>
            <label className="text-sm font-semibold">Sort By</label>
            <select
              className="w-full mt-1 p-2 border rounded"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">None</option>
              <option value="low-high">Price: Low → High</option>
              <option value="high-low">Price: High → Low</option>
            </select>
          </div>

          {/* Future filters (extensible) */}
          <div>
            <p className="text-xs text-gray-400">
              More filters coming soon...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}