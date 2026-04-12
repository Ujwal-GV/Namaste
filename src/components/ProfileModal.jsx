import { Modal, Input, Upload, Button } from "antd";
import { useState, useEffect } from "react";
import API from "../api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import { Loader2Icon } from "lucide-react";

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
      });

      setExisting({
        profilePic: userData.profilePic || "",
        idProof: userData?.documents?.idProof || "",
        propertyProof: userData?.documents?.propertyProof || "",
      });
    }
  }, [userData]);

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
      <div>
        <p className="text-sm font-medium mb-1">{label}</p>

        <Upload
          beforeUpload={(file) => handleFileChange(keyName, file)}
          showUploadList={false}
        >
          <Button size="small">Upload</Button>
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
      <div className="flex flex-col h-[90vh]">

        <div className="p-4 border-b flex justify-between">
          <h2 className="text-lg font-semibold">Edit Profile</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">

          <div>
            <h3 className="font-semibold mb-3">Personal Info</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                placeholder="Name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />

              <Input
                placeholder="Mobile"
                value={form.mobile}
                onChange={(e) =>
                  setForm({ ...form, mobile: e.target.value })
                }
              />
            </div>
          </div>

          <RenderImageBlock
            label="Profile Picture"
            keyName="profilePic"
          />

          <div>
            <h3 className="font-semibold mb-3">Documents</h3>

            <div className="grid md:grid-cols-2 gap-4">
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

        <div className="p-4 border-t flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border rounded-lg py-2"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="flex-1 bg-black text-white rounded-lg py-2"
          >
            {updateProfileMutation.isPending
              ? <span className="flex justify-center items-center"><Loader2Icon className="animatespin-slow-reverse" />Saving</span>
              : "Save Changes"}
          </button>
        </div>
      </div>
    </Modal>
  );
}