import { IoIosCloseCircle } from "react-icons/io";

export default function FilterSidebar({
  maxPrice,
  setMaxPrice,
  minPrice,
  setMinPrice,
  sort,
  setSort,
  onClose,
}) {

  const handleClear = () => {
    setMinPrice("");
    setMaxPrice("");
    setSort("");
    onClose();
  };

  return (
    <div className="w-80 h-full bg-white shadow-xl p-4">

      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">Filters</h2>

        <button onClick={onClose}>
          <IoIosCloseCircle className="text-2xl text-gray-600" />
        </button>
      </div>

      <hr className="mb-2" />

      <div className="mb-5">
        <label className="text-sm font-semibold">Rent Max Price</label>
        <input
          type="number"
          placeholder="e.g. 20000"
          className="w-full mt-1 p-2 border rounded"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      <div className="mb-5">
        <label className="text-sm font-semibold">Rent Min Price</label>
        <input
          type="number"
          placeholder="e.g. 20000"
          className="w-full mt-1 p-2 border rounded"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
      </div>

      <div className="mb-5">
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

      <span className="flex items-center gap-2">
        <button
        onClick={onClose}
        className="w-full bg-[#FF5A5F] text-white py-2 rounded-lg"
      >
        Apply Filters
      </button>
      <button
        onClick={handleClear}
        className="w-full bg-[#FF5A5F] text-white py-2 rounded-lg"
      >
        Clear Filters
      </button>
      </span>
    </div>
  );
}