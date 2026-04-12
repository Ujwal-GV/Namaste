import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import API from "../api/axios";
import { Progress, Tag } from "antd";
import ProfileModal from "../components/ProfileModal";
import ProfileAvatar from "../components/ProfileAvatar";
import SkeletonCard from "../components/SkeletonCard";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";
import { useMyProperties } from "../hooks/useProperties";
import { TbError404 } from "react-icons/tb";
import MyPropertyCard from "../components/MyPropertyCard";
import { motion } from "framer-motion";
import { ProfileSkeleton } from "../components/ProfileSkeleton";
import ProfileBadges from "../components/ProfileBadges";
import { RxCrossCircled } from "react-icons/rx";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await API.get("/user/profile");
      return res.data;
    },
  });

  const userId = data?._id;

  const {
    data: propertyData,
    isLoading: propertyLoading,
  } = useMyProperties(userId);

  const getProfileCompletion = (user) => {
    let total = user?.role === "owner" ? 5 : 4;
    let completed = 0;

    if (user?.name) completed++;
    if (user?.mobile) completed++;
    if (user?.profilePic) completed++;
    if (user?.documents?.idProof) completed++;
    if (user?.role === "owner" && user?.documents?.propertyProof)
      completed++;

    return Math.round((completed / total) * 100);
  };

  if (isLoading) return <ProfileSkeleton />;

  const completion = getProfileCompletion(data);

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">

      <div className="bg-white shadow rounded-2xl p-5 flex items-center gap-5">
        <ProfileAvatar image={data?.profilePic} />

        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl md:text-2xl font-bold">
              {data?.name || "User"}
            </h2>

            {data?.verificationStatus === "verified" && (
              <Tag color="green">Verified</Tag>
            )}
          </div>

          <p className="text-gray-500 text-sm">
            ID: {user?.id}
          </p>

          <button
            onClick={() => setOpen(true)}
            className="mt-2 text-sm bg-black text-white px-3 py-1 rounded-lg"
          >
            Edit Profile
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-2xl p-5">
        <h3 className="font-semibold mb-3">
          Profile Completion
        </h3>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${completion}%` }}
          transition={{ duration: 0.8 }}
          className="h-1 bg-black rounded-full"
        />

        <p className="text-sm text-gray-500 mt-2">
          {completion}% completed
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ProfileBadges icon={<MdEmail />} label="Email" value={data?.email} />
        <ProfileBadges icon={<FaPhoneAlt />} label="Mobile" value={data?.mobile || "Not Added"} />
        <ProfileBadges
          icon={
            data?.accountStatus === "active" ? (
              <CiCircleCheck className="text-green-500" />
            ) : (
              <CiCircleRemove className="text-red-500" />
            )
          }
          label="Account Status"
          value={data?.accountStatus}
        />
        <ProfileBadges
          icon={<MdEmail />}
          label="Verification"
          value={data?.verificationStatus}
        />
      </div>

      <div className="bg-white shadow rounded-2xl p-5">
        <h3 className="font-semibold mb-3">Documents</h3>

        <div className="space-y-2 text-sm">
          <p className="flex gap-2">
            ID Proof:{" "}
            {data?.documents?.idProof ? <span className="flex gap-1 items-center">Uploaded<CiCircleCheck className="text-green-500" /></span> : <span className="flex gap-1 items-center">Missing<RxCrossCircled className="text-red-500" /></span>}
          </p>

          {data?.role === "owner" && (
            <p className="flex gap-2">
              Property Proof:{" "}
              {data?.documents?.propertyProof
                ? <span className="flex gap-1 items-center">Uploaded<CiCircleCheck className="text-green-500" /></span>
                : <span className="flex gap-2 items-center"><RxCrossCircled /></span>}
            </p>
          )}
        </div>
      </div>

      <div className="bg-white shadow rounded-2xl p-5 h-[40vh] overflow-y-auto custom-scroll">
        <h3 className="font-semibold mb-4 border-b pb-2">
          My Properties
        </h3>

        {propertyLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : propertyData?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {propertyData.map((p) => (
              <MyPropertyCard key={p._id} property={p} />
            ))}
          </div>
        ) : (
          <p className="flex items-center justify-center gap-2 text-gray-500">
            No Properties <TbError404 />
          </p>
        )}
      </div>

      <div className="bg-white shadow rounded-2xl p-5">
        <h3 className="font-semibold mb-3">My Reviews</h3>
        <p className="text-gray-500 text-sm">
          Review system coming soon...
        </p>
      </div>

      <ProfileModal
        open={open}
        onClose={() => {
          setOpen(false);
          refetch();
        }}
        userData={data}
      />
    </div>
  );
}