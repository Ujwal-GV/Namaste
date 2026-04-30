import React from "react";

export default function ProfileBadges({
  icon,
  label,
  value,
}) {
  const isActive = value === "active";
  const isVerified = value === "approved";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">

      {/* LEFT */}
      <div className="flex items-center gap-2 text-gray-600 text-sm">
        <span className="text-lg">{icon}</span>
        <span className="font-medium">{label}</span>
      </div>

      {/* RIGHT VALUE */}
      <span
        className={`text-sm font-semibold px-2 py-1 rounded-full ${
          isActive || isVerified
            ? "bg-green-100 text-green-600 capitalize"
            : "text-gray-600"
        }`}
      >
        {value}
      </span>

    </div>
  );
}