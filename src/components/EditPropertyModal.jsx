import { Modal, Input, Button } from "antd";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../api/axios";
import toast from "react-hot-toast";
import { Select } from "antd";
import { useLocations } from "../hooks/useLocations";

export default function EditPropertyModal({ open, onClose, property }) {
  const queryClient = useQueryClient();

  const { data: locations } = useLocations();

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

  const handleSubmit = () => {
    updateMutation.mutate();
  };

  return (
    <Modal
        open={open}
        onCancel={onClose}
        onOk={handleSubmit}
        confirmLoading={updateMutation.isPending}
        width="80%"
        style={{ top: 150 }}
        bodyStyle={{ padding: "24px 32px" }}
        >
        <h2 className="text-2xl font-bold mb-6">Edit Property</h2>

        <div className="grid md:grid-cols-2 gap-6">

            <div>
            <label className="block text-sm font-semibold mb-1">
                Property Title
            </label>
            <Input
                placeholder="Enter title"
                value={form.title}
                onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                }
            />
            </div>

            <div>
            <label className="block text-sm font-semibold mb-1">
                Location
            </label>
            <Select
                placeholder="Select Location"
                value={form.location || undefined}
                onChange={(value) =>
                    setForm({ ...form, location: value })
                }
                className="w-full"
                showSearch
                optionFilterProp="children"
            >
                {locations?.map((loc) => (
                <Select.Option key={loc._id} value={loc.name}>
                    {loc.name}
                </Select.Option>
                ))}
            </Select>
            </div>

            <div>
            <label className="block text-sm font-semibold mb-1">
                Rent (₹)
            </label>
            <Input
                type="number"
                placeholder="Enter rent"
                value={form.rent}
                onChange={(e) =>
                    setForm({ ...form, rent: e.target.value })
                }
            />
            </div>

            <div>
            <label className="block text-sm font-semibold mb-1">
                Deposit (₹)
            </label>
            <Input
                type="number"
                placeholder="Enter deposit"
                value={form.deposit}
                onChange={(e) =>
                    setForm({ ...form, deposit: e.target.value })
                }
            />
            </div>

        </div>

        <div className="mt-6">
            <label className="block text-sm font-semibold mb-1">
            Description
            </label>
            <Input.TextArea
                rows={4}
                placeholder="Enter property details"
                value={form.description}
                onChange={(e) =>
                setForm({ ...form, description: e.target.value })
            }
            />
        </div>
        </Modal>
  );
}