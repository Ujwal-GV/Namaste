import { useState } from "react";
import { Modal, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useApplyOwner } from "../hooks/useRequests";
import toast from "react-hot-toast";
import API from "../api/axios";
import { useQuery } from "@tanstack/react-query";
import { FaRegSmileBeam } from "react-icons/fa";

export default function ApplyOwner() {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useApplyOwner();

  const { data } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await API.get("/user/profile");
      return res.data;
    },
  });

  const userVerificationStatus = data?.verificationStatus;

  const [files, setFiles] = useState({
    idProof: null,
    propertyProof: null,
  });

  const handleSubmit = () => {
    if (!files.idProof || !files.propertyProof) {
      toast.error("Please upload both documents");
      return;
    }

    const formData = new FormData();
    formData.append("idProof", files.idProof);
    formData.append("propertyProof", files.propertyProof);

    mutate(formData, {
      onSuccess: () => setOpen(false),
    });
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto flex justify-center">

      {/* 🟡 PENDING STATE */}
      {userVerificationStatus === "pending" && (
        <div className="text-center space-y-4">
          <img
            className="h-[30vh] md:h-[40vh] mx-auto"
            src="waiting.png"
            alt="waiting"
          />

          <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6">
            <h2 className="text-xl font-semibold flex items-center justify-center gap-2 text-gray-800">
              Thank you for your patience
              <FaRegSmileBeam className="text-yellow-500" />
            </h2>

            <p className="text-gray-500 mt-2">
              Your documents are under review. We'll notify you soon.
            </p>
          </div>
        </div>
      )}

      {/* 🟢 APPLY STATE */}
      {(userVerificationStatus === "none" ||
        userVerificationStatus === undefined) && (
        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-6 text-center space-y-4 w-full">

          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            Become an Owner
          </h2>

          <p className="text-gray-500 text-sm">
            Submit your documents and start listing your properties.
          </p>

          <button
            onClick={() => setOpen(true)}
            className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-full transition shadow-sm"
          >
            Apply Now
          </button>
        </div>
      )}

      {/* 📄 MODAL */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        okText="Submit"
        confirmLoading={isPending}
        width="95%"
        style={{ maxWidth: 500, top: 40 }}
        bodyStyle={{ padding: "20px" }}
        okButtonProps={{
          className: "!bg-rose-500 hover:!bg-rose-600 border-none rounded-full",
        }}
      >
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          Upload Documents
        </h2>

        <div className="space-y-5">

          {/* ID PROOF */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              ID Proof
            </p>

            {files.idProof ? (
              <div className="flex justify-between items-center bg-gray-50 border rounded-xl px-3 py-2">
                <span className="text-sm truncate">
                  {files.idProof.name}
                </span>
                <button
                  onClick={() =>
                    setFiles((prev) => ({ ...prev, idProof: null }))
                  }
                  className="text-rose-500 text-xs"
                >
                  Remove
                </button>
              </div>
            ) : (
              <Upload
                beforeUpload={(file) => {
                  setFiles((prev) => ({ ...prev, idProof: file }));
                  return false;
                }}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />} block>
                  Upload ID Proof
                </Button>
              </Upload>
            )}
          </div>

          {/* PROPERTY PROOF */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">
              Property Proof
            </p>

            {files.propertyProof ? (
              <div className="flex justify-between items-center bg-gray-50 border rounded-xl px-3 py-2">
                <span className="text-sm truncate">
                  {files.propertyProof.name}
                </span>
                <button
                  onClick={() =>
                    setFiles((prev) => ({
                      ...prev,
                      propertyProof: null,
                    }))
                  }
                  className="text-rose-500 text-xs"
                >
                  Remove
                </button>
              </div>
            ) : (
              <Upload
                beforeUpload={(file) => {
                  setFiles((prev) => ({
                    ...prev,
                    propertyProof: file,
                  }));
                  return false;
                }}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />} block>
                  Upload Property Proof
                </Button>
              </Upload>
            )}
          </div>

        </div>
      </Modal>
    </div>
  );
}