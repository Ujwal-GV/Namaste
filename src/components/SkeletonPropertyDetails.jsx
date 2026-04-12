export default function SkeletonPropertyDetails() {
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 animate-pulse">

      <div className="bg-gray-300 rounded-2xl h-[220px] md:h-[400px]" />

      <div className="grid md:grid-cols-2 gap-6">

        <div className="space-y-6">

          <div className="bg-white shadow rounded-2xl p-5 space-y-3">

            <div className="h-6 w-2/3 bg-gray-300 rounded" />
            <div className="h-4 w-1/2 bg-gray-300 rounded" />
            <div className="h-3 w-3/4 bg-gray-300 rounded" />

            <div className="flex gap-4 mt-3">
              <div className="h-6 w-20 bg-gray-300 rounded" />
              <div className="h-6 w-24 bg-gray-300 rounded" />
            </div>

            <div className="h-4 w-1/3 bg-gray-300 rounded" />

            <div className="space-y-2 mt-3">
              <div className="h-3 w-full bg-gray-300 rounded" />
              <div className="h-3 w-full bg-gray-300 rounded" />
              <div className="h-3 w-2/3 bg-gray-300 rounded" />
            </div>
          </div>

          <div className="bg-white shadow rounded-2xl p-5">
            <div className="h-10 w-full bg-gray-300 rounded-xl" />
          </div>

          <div className="bg-white shadow rounded-2xl p-5 space-y-3">
            <div className="h-5 w-1/4 bg-gray-300 rounded" />
            <div className="h-12 bg-gray-300 rounded-xl" />
            <div className="h-12 bg-gray-300 rounded-xl" />
          </div>
        </div>

        <div className="bg-gray-300 rounded-2xl h-[350px] md:h-full shadow" />
      </div>
    </div>
  );
}