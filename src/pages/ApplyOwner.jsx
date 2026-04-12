import { useState } from "react";
import { Modal, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useApplyOwner } from "../hooks/useRequests";
import toast from "react-hot-toast";

export default function ApplyOwner() {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useApplyOwner();

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
      onSuccess: () => {
        toast.success("Request submitted");
        setOpen(false);
      },
    });
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">

      <div className="bg-white shadow rounded-2xl p-5 md:p-6 text-center space-y-4">
        <h2 className="text-xl md:text-2xl font-bold">
          Become an Owner
        </h2>

        <p className="text-gray-500 text-sm md:text-base">
          Submit your documents to request ownership access.
        </p>

        <button
          onClick={() => setOpen(true)}
          className="bg-black text-white px-6 py-2 rounded-xl hover:bg-gray-800 transition"
        >
          Apply Now
        </button>
      </div>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        okText="Submit Request"
        confirmLoading={isPending}
        width="95%"
        style={{ maxWidth: 500, top: 40 }}
        bodyStyle={{ padding: "16px" }}
      >
        <h2 className="text-lg md:text-xl font-semibold mb-4">
          Upload Documents
        </h2>

        <div className="space-y-4">

          <div>
            <p className="text-sm font-medium mb-1">
              ID Proof
            </p>

            {files.idProof ? (
              <div className="flex justify-between items-center bg-gray-100 p-2 rounded">
                <span className="text-sm truncate">
                  {files.idProof.name}
                </span>
                <button
                  onClick={() =>
                    setFiles((prev) => ({ ...prev, idProof: null }))
                  }
                  className="text-red-500 text-xs"
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

          <div>
            <p className="text-sm font-medium mb-1">
              Property Proof
            </p>

            {files.propertyProof ? (
              <div className="flex justify-between items-center bg-gray-100 p-2 rounded">
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
                  className="text-red-500 text-xs"
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