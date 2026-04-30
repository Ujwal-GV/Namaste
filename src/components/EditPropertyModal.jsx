import { Modal, Input, Select } from "antd";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useLocations } from "../hooks/useLocations";

export default function EditPropertyModal({ open, onClose, property }) {
  const queryClient = useQueryClient();
  const { data: locations } = useLocations();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [form, setForm] = useState({
    title: "",
    location: "",
    rent: "",
    deposit: "",
    description: "",
  });

  useEffect(() => {
    if (property) {
      setForm({
        title: property.title || "",
        location: property.location || "",
        rent: property.rent || "",
        deposit: property.deposit || "",
        description: property.description || "",
      });
    }
  }, [property]);

  const updateMutation = useMutation({
    mutationFn: async () => {
      const res = await API.put(`/property/${property._id}`, form);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Property updated");
      queryClient.invalidateQueries(["property", property._id]);
      queryClient.invalidateQueries(["properties"]);
      queryClient.invalidateQueries(["my-properties"]);
      onClose();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Update failed");
    },
  });

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={isMobile ? "100%" : "720px"}
      style={isMobile ? { top: 0, padding: 0 } : { top: 40 }}
      bodyStyle={{
        padding: 0,
        height: isMobile ? "100vh" : "auto",
      }}
    >
      <div className="flex flex-col h-full bg-white">

        {/* HEADER */}
        <div className="sticky top-0 bg-white z-10 px-5 py-4 border-b">
          <h2 className="text-xl font-semibold text-[#222]">
            Edit property
          </h2>
          <p className="text-sm text-gray-500">
            Update your listing details
          </p>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-8">

          {/* BASIC */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Basic information
            </h3>

            <div className="space-y-4">

              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Title
                </label>
                <Input
                  size="large"
                  value={form.title}
                  className="rounded-xl bg-gray-50 border-none"
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Location
                </label>
                <Select
                  size="large"
                  value={form.location || undefined}
                  onChange={(value) =>
                    setForm({ ...form, location: value })
                  }
                  className="w-full"
                  popupClassName="rounded-xl"
                >
                  {locations?.map((loc) => (
                    <Select.Option key={loc._id} value={loc.name}>
                      {loc.name}
                    </Select.Option>
                  ))}
                </Select>
              </div>

            </div>
          </div>

          {/* PRICING */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Pricing
            </h3>

            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Rent (₹)
                </label>
                <Input
                  size="large"
                  type="number"
                  value={form.rent}
                  className="rounded-xl bg-gray-50 border-none"
                  onChange={(e) =>
                    setForm({ ...form, rent: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Deposit (₹)
                </label>
                <Input
                  size="large"
                  type="number"
                  value={form.deposit}
                  className="rounded-xl bg-gray-50 border-none"
                  onChange={(e) =>
                    setForm({ ...form, deposit: e.target.value })
                  }
                />
              </div>

            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Description
            </h3>

            <Input.TextArea
              rows={4}
              value={form.description}
              className="rounded-xl bg-gray-50 border-none"
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

        </div>

        {/* FOOTER */}
        <div className="sticky bottom-0 bg-white px-5 py-4 border-t flex gap-3">

          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={() => updateMutation.mutate()}
            className="flex-1 py-2 rounded-xl bg-[#FF5A5F] text-white font-medium hover:opacity-90 transition"
          >
            {updateMutation.isPending ? "Saving..." : "Save changes"}
          </button>

        </div>
      </div>
    </Modal>
  );
}