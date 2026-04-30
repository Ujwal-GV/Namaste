import { Modal, Input, Upload, Button } from "antd";
import { useState, useEffect } from "react";
import API from "../api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import { Loader2Icon } from "lucide-react";
import { useLocations } from "../hooks/useLocations";
import { FaPen } from "react-icons/fa";

export default function ProfileModal({ open, onClose, userData }) {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
  });

  const [files, setFiles] = useState({});
  const [preview, setPreview] = useState({});

  const [existing, setExisting] = useState({
    profilePic: "",
    idProof: "",
    propertyProof: "",
  });

  const [remove, setRemove] = useState({
    profilePic: false,
    idProof: false,
    propertyProof: false,
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (userData) {
      setForm({
        name: userData.name || "",
        mobile: userData.mobile || "",
        location: userData.location || "",
      });

      setExisting({
        profilePic: userData.profilePic || "",
        idProof: userData?.documents?.idProof || "",
        propertyProof: userData?.documents?.propertyProof || "",
      });
    }
  }, [userData]);

  const { data: locations, isLoading } = useLocations();

  console.log("locat", locations);
  

  const updateProfileMutation = useMutation({
    mutationFn: async (formData) => {
      const res = await API.put("/user/update-profile", formData);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Profile updated");
      queryClient.invalidateQueries(["user-profile"]);
      onClose();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Update failed");
    },
  });

  const handleFileChange = (key, file) => {
    setFiles((prev) => ({ ...prev, [key]: file }));

    const url = URL.createObjectURL(file);
    setPreview((prev) => ({ ...prev, [key]: url }));

    setRemove((prev) => ({ ...prev, [key]: false }));

    return false;
  };

  const handleRemoveExisting = (key) => {
    setExisting((prev) => ({ ...prev, [key]: "" }));
    setRemove((prev) => ({ ...prev, [key]: true }));
  };

  const handleSubmit = () => {
    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("mobile", form.mobile);
    formData.append("location", form.location);

    if (files.profilePic) formData.append("profilePic", files.profilePic);
    if (files.idProof) formData.append("idProof", files.idProof);
    if (files.propertyProof)
      formData.append("propertyProof", files.propertyProof);

    formData.append("removeProfilePic", remove.profilePic);
    formData.append("removeIdProof", remove.idProof);
    formData.append("removePropertyProof", remove.propertyProof);

    updateProfileMutation.mutate(formData);
  };

  const RenderImageBlock = ({ label, keyName }) => {
    const currentImage = preview[keyName] || existing[keyName];

    return (
      <div  className="w-full lg:w-1/2 md:w-1/2">
        <p className="text-sm font-medium mb-1">{label}</p>

        <Upload
          beforeUpload={(file) => handleFileChange(keyName, file)}
          showUploadList={false}
        >
          <Button>Upload</Button>
        </Upload>

        {currentImage && (
          <div className="relative mt-2">
            <img
              src={currentImage}
              className="w-full h-32 object-cover rounded-lg border"
            />

            <button
              onClick={() => handleRemoveExisting(keyName)}
              className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full"
            >
              <MdDelete size={16} />
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width="100%"
      className="md:max-w-3xl mx-auto"
      style={{ top: 0 }}
      bodyStyle={{ padding: 0 }}
    >
      <div className="flex flex-col h-[90vh] bg-gray-50">
        {console.log("PROFIEL MODAL", userData)
        }

        {/* Header */}
        <div className="p-4 border-b bg-white sticky top-0 z-10">
          <h2 className="text-lg font-semibold">Edit Profile</h2>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-1 space-y-8">

          {/* Profile Section */}
          <div className="bg-white p-6 rounded-2xl shadow flex flex-col lg:flex-row md:flex-row items-center gap-6">
            <div className="w-24 h-24 relative">
              <img
                src={preview.profilePic || existing.profilePic}
                className="w-full h-full object-cover rounded-full border"
              />
              <Upload
                beforeUpload={(file) => handleFileChange("profilePic", file)}
                showUploadList={false}
              >
                <button className="absolute bottom-1 right-2 bg-black text-white p-1 rounded-full text-xs">
                  <FaPen />
                </button>
              </Upload>
            </div>

            <div className="flex-1">
              <Input
                placeholder="Your name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className="mb-2"
              />
              <Input
                placeholder="Mobile number"
                value={form.mobile}
                onChange={(e) =>
                  setForm({ ...form, mobile: e.target.value })
                }
              />
            </div>
          </div>

          {/* Personal Info */}
          <div className="bg-white p-6 rounded-2xl shadow space-y-4">
            <h3 className="font-semibold text-lg">Location</h3>

            <select
              className="w-full p-3 border rounded-xl"
              value={form.location}
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

          {/* Documents */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="font-semibold text-lg mb-4">Documents</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <RenderImageBlock
                label="ID Proof"
                keyName="idProof"
              />

              {userData?.role === "owner" && (
                <RenderImageBlock
                  label="Property Proof"
                  keyName="propertyProof"
                />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-white sticky bottom-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border rounded-xl py-2"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="flex-1 bg-black text-white rounded-xl py-2 flex justify-center items-center"
          >
            {updateProfileMutation.isPending
              ? <Loader2Icon className="animate-spin mr-2" />
              : null}
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
}