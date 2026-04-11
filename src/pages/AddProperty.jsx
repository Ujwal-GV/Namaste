import { useContext, useState } from "react";
import { useAddProperty } from "../hooks/useProperties";
import { AuthContext } from "../context/AuthContext";
import { useLocations } from "../hooks/useLocations";
import { Upload } from "antd";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import API from "../api/axios";

export default function AddProperty() {
  const [form, setForm] = useState({});
  const { mutate } = useAddProperty();
  const { data: locations, isLoading } = useLocations();
  const { token } = useContext(AuthContext);
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  const qClient = useQueryClient();
    const navigate = useNavigate();

  const addPropertyMutation = useMutation({
    mutationKey: ["add-property"],
    mutationFn: async (data) => {
        const res = await API.post("/property", data);

    console.log("Add property result", res.data);
        
      return res.data;
    },
    onSuccess: () => {
        navigate("/");
        toast.success("Property added successfully");
        qClient.invalidateQueries(["get-properties"]);
    },
    onError: (error) => {
        console.log("Add property error", error?.response?.data?.message);
        toast.error(error.response?.data?.message || "Failed to add property");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", form.title);
    formData.append("location", form.location);
    formData.append("rent", form.rent);
    formData.append("deposit", form.deposit);
    formData.append("detailedAddress", form.detailedAddress);

    images.forEach((img) => {
      formData.append("images", img);
    });

    for(let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
      
    }

    addPropertyMutation.mutate(formData);
  };

  return (
    <div className="p-6 w-full flex flex-col md:flex-row lg:flex-row gap-2 m-3">
      <div className="w-full bg-gray-200 rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">Add Property</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full p-3 border rounded-xl"
            placeholder="Title"
            onChange={(e) => setForm({ ...form, title: e.target.value })}
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

          <input
            className="w-full p-3 border rounded-xl"
            placeholder="Rent"
            onChange={(e) => setForm({ ...form, rent: e.target.value })}
          />

          <input
            className="w-full p-3 border rounded-xl"
            placeholder="Deposit"
            onChange={(e) => setForm({ ...form, deposit: e.target.value })}
          />

          <textarea
            className="w-full p-3 border rounded-xl"
            placeholder="Full Address" 
            onChange={(e) => setForm({...form, detailedAddress: e.target.value})} 
          />

          <button className="w-full bg-black text-white py-3 rounded-xl">
            {
              addPropertyMutation.isPending ? 
              "Adding" :
              "Add Property"
            }
          </button>
        </form>
      </div>

      <div className="w-full bg-gray-200 rounded-lg p-4">
         <h2 className="text-xl font-bold mb-4">Property Images</h2>

         <Upload
          multiple
          listType="picture-card"
          beforeUpload={(file) => {
            setImages((prev) => [...prev, file]);

            const url = URL.createObjectURL(file);
            setPreview((prev) => [...prev, url]);

            return false;
          }}
         >
          Upload +
         </Upload>

         <div className="flex gap-3 flex-wrap mt-3">
          {preview.map((img, i) => (
            <img
              key={i}
              src={img}
              alt="preview"
              className="w-24 h-24 object-cover rounded"
            />
          ))}
        </div>
      </div>
    </div>
  );
}