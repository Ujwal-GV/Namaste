import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useLocations } from "../hooks/useLocations";
import { Upload } from "antd";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import API from "../api/axios";
import { MdDelete } from "react-icons/md";

export default function AddProperty() {
  const [form, setForm] = useState({});
  const { data: locations, isLoading } = useLocations();
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  const qClient = useQueryClient();
  const navigate = useNavigate();

  const addPropertyMutation = useMutation({
    mutationFn: async (data) => {
      const res = await API.post("/property", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Property added successfully");
      qClient.invalidateQueries(["get-properties"]);
      navigate("/");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to add property");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    images.forEach((img) => {
      formData.append("images", img);
    });

    addPropertyMutation.mutate(formData);
  };

  const removeImage = (index) => {
    const newImgs = [...images];
    const newPrev = [...preview];

    newImgs.splice(index, 1);
    newPrev.splice(index, 1);

    setImages(newImgs);
    setPreview(newPrev);
  };

  return (
    <div className="bg-[#f7f7f7] min-h-screen py-6">
      <div className="max-w-6xl mx-auto px-4">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-[#222]">
            List your property
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Fill in the details to publish your listing
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-2 gap-6"
        >

          {/* LEFT: DETAILS */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-5 shadow-sm">

            <h2 className="font-semibold text-lg text-[#222]">
              Property Details
            </h2>

            {/* Title */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Title
              </label>
              <input
                className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:bg-white transition"
                placeholder="e.g. 2BHK near city center"
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />
            </div>

            {/* Location */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Location
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none"
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
              >
                <option value="">Select Location</option>
                {isLoading ? (
                  <option>Loading...</option>
                ) : (
                  locations?.map((loc) => (
                    <option key={loc._id} value={loc.name}>
                      {loc.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Rent (₹)
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none"
                  placeholder="₹ 10,000"
                  onChange={(e) =>
                    setForm({ ...form, rent: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 mb-1 block">
                  Deposit (₹)
                </label>
                <input
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none"
                  placeholder="₹ 50,000"
                  onChange={(e) =>
                    setForm({ ...form, deposit: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Full Address
              </label>
              <textarea
                className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none"
                rows={3}
                onChange={(e) =>
                  setForm({
                    ...form,
                    detailedAddress: e.target.value,
                  })
                }
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Description
              </label>
              <textarea
                className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none"
                rows={3}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
              />
            </div>
          </div>

          {/* RIGHT: IMAGES */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

            <h2 className="font-semibold text-lg text-[#222] mb-4">
              Photos
            </h2>

            {/* Upload Box */}
            <Upload
              multiple
              showUploadList={false}
              beforeUpload={(file) => {
                setImages((prev) => [...prev, file]);
                setPreview((prev) => [
                  ...prev,
                  URL.createObjectURL(file),
                ]);
                return false;
              }}
            >
              <div className="border-2 border-dashed border-gray-300 rounded-2xl h-32 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-50 transition">
                <p className="text-sm">Click or drag images</p>
                <p className="text-xs text-gray-400">
                  JPG, PNG supported
                </p>
              </div>
            </Upload>

            {/* Preview Grid */}
            {preview.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-5">
                {preview.map((img, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={img}
                      className="w-full h-28 object-cover rounded-xl"
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <MdDelete size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SUBMIT */}
          <div className="md:col-span-2">
            <button
              className="w-full bg-[#FF5A5F] text-white py-3 rounded-xl text-lg hover:opacity-90 transition"
            >
              {addPropertyMutation.isPending
                ? "Publishing..."
                : "Publish Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}