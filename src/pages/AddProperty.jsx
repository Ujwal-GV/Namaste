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
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Add New Property
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-2 gap-6"
      >
        <div className="bg-white shadow rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold text-lg">Property Details</h2>

          <input
            className="w-full p-3 border rounded-xl"
            placeholder="Title"
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <select
            className="w-full p-3 border rounded-xl"
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

          <div className="grid grid-cols-2 gap-3">
            <input
              className="p-3 border rounded-xl"
              placeholder="Rent ₹"
              onChange={(e) =>
                setForm({ ...form, rent: e.target.value })
              }
            />

            <input
              className="p-3 border rounded-xl"
              placeholder="Deposit ₹"
              onChange={(e) =>
                setForm({ ...form, deposit: e.target.value })
              }
            />
          </div>

          <textarea
            className="w-full p-3 border rounded-xl"
            placeholder="Full Address"
            rows={4}
            onChange={(e) =>
              setForm({
                ...form,
                detailedAddress: e.target.value,
              })
            }
          />
        </div>

        <div className="bg-white shadow rounded-2xl p-5">
          <h2 className="font-semibold text-lg mb-4">
            Property Images
          </h2>

          <Upload
            multiple
            listType="picture-card"
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
            <div className="text-sm">Upload</div>
          </Upload>

          <div className="grid grid-cols-3 gap-3 mt-4">
            {preview.map((img, i) => (
              <div key={i} className="relative group">
                <img
                  src={img}
                  className="w-full h-24 object-cover rounded-xl"
                />

                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100"
                >
                  <MdDelete size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <button
            className="w-full bg-black text-white py-3 rounded-xl text-lg hover:bg-gray-800 transition"
          >
            {addPropertyMutation.isPending
              ? "Adding..."
              : "Add Property"}
          </button>
        </div>
      </form>
    </div>
  );
}