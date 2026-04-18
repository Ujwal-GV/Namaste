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

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await API.get("/user/profile");
      return res.data;
    },
  });

  const userVerificationStatus = data?.verificationStatus;
  console.log("Verifcation STatus", userVerificationStatus);
  

  const [files, setFiles] = useState({
    idProof: null,
    propertyProof: null,
  });

  const [remove, setRemove] = useState({
    idProof: false,
    propertyProof: false,
  });

  const handleSubmit = () => {
    console.log("IDPROOF", files.idProof, "PROPERTY FILE", files.propertyProof);
    
    if (!files.idProof || !files.propertyProof) {
      toast.error("Please upload both documents");
      return;
    }

    const formData = new FormData();
    if (files.idProof) formData.append("idProof", files.idProof);
    if (files.propertyProof)
      formData.append("propertyProof", files.propertyProof);

    formData.append("removeProfilePic", remove.profilePic);
    formData.append("removeIdProof", remove.idProof);
    formData.append("removePropertyProof", remove.propertyProof);

    mutate(formData, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto flex justify-center">

      {userVerificationStatus === "pending" && (
      <span>
         <img className="md:h-[45vh] lg:h-[45vh] h-[30vh] bg-yellow-300" src="waiting.png" />
         <div className="bg-white shadow rounded-2xl p-5 md:p-6 text-center space-y-4">
            <h2 className="text-xl md:text-2xl font-bold mx-auto flex items-center gap-2 justify-center">
              Thank you for your patience <FaRegSmileBeam className="bg-yellow-300 rounded-full" />
            </h2>

            <p className="text-gray-500 text-sm md:text-base">
              Please wait till your documents get verified.
            </p>
          </div>  
      </ span>)}

      {(userVerificationStatus === "none" || userVerificationStatus === undefined) && (
        <>
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
        </>
      )}

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