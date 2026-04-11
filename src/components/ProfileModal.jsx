import { Modal, Input, Upload, Button } from "antd";
import { useState } from "react";
import API from "../api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function ProfileModal({ open, onClose, userData }) {
  const [form, setForm] = useState({
    name: userData?.name || "",
    mobile: userData?.mobile || "",
  });

  const [files, setFiles] = useState({});

  const queryClient = useQueryClient();

  const updateProfileMutation = useMutation({
    mutationKey: ["update-user-profile"],
    mutationFn: async (formData) => {
        const res = await API.put("/user/update-profile", formData);
        return res.data;
    },

    onSuccess: (data) => {
        toast.success("Update successful");
        queryClient.invalidateQueries(["user-profile"]);
        onClose();
    },

    onError: (error) => {
        toast.error(error?.response?.data?.message || "Update failed");
    }
  })

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("mobile", form.mobile);
    console.log("Usestate Files", formData);
    

    if (files.profilePic)
      formData.append("profilePic", files.profilePic);

    if (files.idProof)
      formData.append("idProof", files.idProof);

    if (files.propertyProof)
      formData.append("propertyProof", files.propertyProof);
    
    for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  console.log("ProfileModal", formData);
  
    
  updateProfileMutation.mutate(formData);
  };

  return (
    <Modal open={open} onCancel={onClose} onOk={handleSubmit} confirmLoading={updateProfileMutation.isPending}>
      <h2 className="text-lg font-bold mb-4">Update Profile</h2>

      <Input
        placeholder="Name"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
        className="mb-3"
      />

      <Input
        placeholder="Mobile"
        value={form.mobile}
        onChange={(e) =>
          setForm({ ...form, mobile: e.target.value })
        }
        className="mb-3"
      />

      {/* Profile Pic */}
      <Upload
        beforeUpload={(file) => {
            console.log("Profile file", file);
          setFiles((prev) => ({ ...prev, profilePic: file }));
          return false;
        }}
      >
        <Button>Upload Profile Pic</Button>
      </Upload>

      {/* ID Proof */}
      <Upload
        beforeUpload={(file) => {
          setFiles((prev) => ({ ...prev, idProof: file }));
          return false;
        }}
      >
        <Button className="mt-2">Upload ID Proof</Button>
      </Upload>

      {/* Owner Only */}
      {userData?.role === "owner" && (
        <Upload
          beforeUpload={(file) => {
            setFiles((prev) => ({
              ...prev,
              propertyProof: file,
            }));
            return false;
          }}
        >
          <Button className="mt-2">Upload Property Proof</Button>
        </Upload>
      )}
    </Modal>
  );
}