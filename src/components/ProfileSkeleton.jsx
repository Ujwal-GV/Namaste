export function ProfileSkeleton() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-pulse">

      <div className="bg-white shadow rounded-2xl p-6 flex items-center gap-6">
        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>

        <div className="flex-1">
          <div className="h-4 bg-gray-300 w-1/3 mb-2 rounded"></div>
          <div className="h-3 bg-gray-200 w-1/4 rounded"></div>
        </div>
      </div>

      <div className="bg-white shadow rounded-2xl p-6">
        <div className="h-4 bg-gray-300 w-1/4 mb-3 rounded"></div>
        <div className="h-3 bg-gray-200 w-full rounded"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl shadow">
            <div className="h-4 bg-gray-300 w-2/3 rounded"></div>
          </div>
        ))}
      </div>

      <div className="bg-white shadow rounded-2xl p-6">
        <div className="h-4 bg-gray-300 w-1/4 mb-4 rounded"></div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-24 rounded-xl"></div>
          ))}
        </div>
      </div>
    </div>
  );
}