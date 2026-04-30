import { useState } from "react";
import { CiCircleCheck } from "react-icons/ci";
import { RxCrossCircled } from "react-icons/rx";

export const DocumentPreview = ({ label, file }) => {
  const [openPreview, setOpenPreview] = useState(false);

  return (
    <>
      <div className="border rounded-xl p-3 flex items-center gap-3 hover:shadow-sm transition">

        {/* Preview Thumbnail */}
        {file ? (
          <img
            src={file}
            alt={label}
            onClick={() => setOpenPreview(true)}
            className="w-14 h-14 object-cover rounded-lg cursor-pointer border"
          />
        ) : (
          <div className="w-14 h-14 flex items-center justify-center bg-gray-100 rounded-lg text-gray-400 text-xs">
            No File
          </div>
        )}

        {/* Info */}
        <div className="flex-1">
          <p className="text-sm font-medium">{label}</p>

          {file ? (
            <span className="text-green-600 text-xs flex items-center gap-1">
              Uploaded <CiCircleCheck/>
            </span>
          ) : (
            <span className="text-red-500 text-xs flex items-center gap-1">
              Missing <RxCrossCircled />
            </span>
          )}
        </div>

        {/* View Button */}
        {file && (
          <button
            onClick={() => setOpenPreview(true)}
            className="text-xs px-2 py-1 border rounded-md"
          >
            View
          </button>
        )}
      </div>

      {/* Full Preview Modal */}
      {openPreview && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setOpenPreview(false)}
        >
          <img
            src={file}
            alt="preview"
            className="max-h-[90%] max-w-[90%] rounded-lg shadow-lg"
          />
        </div>
      )}
    </>
  );
};