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
      width={isMobile ? "100%" : "800px"}
      style={isMobile ? { top: 0, padding: 0 } : { top: 40 }}
      bodyStyle={{
        padding: isMobile ? "16px" : "24px",
        height: isMobile ? "100vh" : "auto",
      }}
    >
      <div className="mb-4 sticky top-0 bg-white z-10 pb-2 border-b">
        <h2 className="text-xl md:text-2xl font-bold">
          Edit Property
        </h2>
        <p className="text-gray-500 text-xs md:text-sm">
          Update your property details
        </p>
      </div>

      <div className="space-y-6 overflow-y-auto max-h-[75vh] md:max-h-none pr-1">

        <div>
          <h3 className="text-base md:text-lg font-semibold mb-3">
            Basic Info
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs md:text-sm font-medium">
                Title
              </label>
              <Input
                size="large"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs md:text-sm font-medium">
                Location
              </label>
              <Select
                size="large"
                value={form.location || undefined}
                onChange={(value) =>
                  setForm({ ...form, location: value })
                }
                className="w-full"
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

        <div>
          <h3 className="text-base md:text-lg font-semibold mb-3">
            Pricing
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-xs md:text-sm font-medium">
                Rent (₹)
              </label>
              <Input
                size="large"
                type="number"
                value={form.rent}
                onChange={(e) =>
                  setForm({ ...form, rent: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-xs md:text-sm font-medium">
                Deposit (₹)
              </label>
              <Input
                size="large"
                type="number"
                value={form.deposit}
                onChange={(e) =>
                  setForm({ ...form, deposit: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-base md:text-lg font-semibold mb-3">
            Description
          </h3>

          <Input.TextArea
            rows={isMobile ? 4 : 5}
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>
      </div>

      <div className="sticky bottom-0 bg-white pt-3 mt-4 border-t flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={() => updateMutation.mutate()}
          className="flex-1 py-2 bg-black text-white rounded-lg"
        >
          {updateMutation.isPending ? "Saving..." : "Save"}
        </button>
      </div>
    </Modal>
  );
}