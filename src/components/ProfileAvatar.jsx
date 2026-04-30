import { Upload } from "antd";
import { useState } from "react";
import { MdModeEditOutline } from "react-icons/md";

export default function ProfileAvatar({ image, onUpload }) {
  const [file, setFile] = useState(null);

  return (
    <div className="relative w-24 h-24">

      <img
        src={
          image ||
          "https://ui-avatars.com/api/?name=User"
        }
        className="w-24 h-24 rounded-full object-cover border"
      />

      {/* Edit Icon */}
      <Upload
        showUploadList={false}
        beforeUpload={(file) => {
          setFile(file);
          onUpload(file);
          return false;
        }}
      >
      </Upload>
    </div>
  );
}