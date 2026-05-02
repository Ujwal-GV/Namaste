import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import API from "../api/axios";
import { Progress, Tag } from "antd";
import ProfileModal from "../components/ProfileModal";
import ProfileAvatar from "../components/ProfileAvatar";
import SkeletonCard from "../components/SkeletonCard";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt, FaHome } from "react-icons/fa";
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";
import { useFavorites, useMyProperties } from "../hooks/useProperties";
import { TbError404 } from "react-icons/tb";
import MyPropertyCard from "../components/MyPropertyCard";
import { ProfileSkeleton } from "../components/ProfileSkeleton";
import ProfileBadges from "../components/ProfileBadges";
import { RxCrossCircled } from "react-icons/rx";
import { SlLocationPin } from "react-icons/sl";
import { Link } from "react-router-dom";
import { DocumentPreview } from "../components/DocumentPreview";
import { IoIosHeart } from "react-icons/io";
import PropertyCard from "../components/PropertyCard";
import { CgClose } from "react-icons/cg";


export default function Profile() {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [openFavs, setOpenFavs] = useState(false);
  const { data: favorites } = useFavorites();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const res = await API.get("/user/profile");
      return res.data;
    },
  });

  const userId = data?._id;
  const isOwner = data?.role === "owner";

  const {
    data: propertyData,
    isLoading: propertyLoading,
  } = useMyProperties(userId);

  // ✅ Role Config (clean pattern)
  const roleConfig = {
    owner: {
      cta: "Add Property",
      subtitle: `${propertyData?.length || 0} Properties Listed`,
      completionHint: "Required to publish listings",
    },
    tenant: {
      cta: "Explore",
      subtitle:
        data?.verificationStatus === "verified"
          ? "Verified User"
          : "Complete your profile",
      completionHint: "Helps build trust with owners",
    },
  };

  const config = roleConfig[data?.role] || roleConfig.tenant;

  const getProfileCompletion = (user) => {
    let total = isOwner ? 5 : 4;
    let completed = 0;

    if (user?.name) completed++;
    if (user?.mobile) completed++;
    if (user?.profilePic) completed++;
    if (user?.documents?.idProof) completed++;
    if (isOwner && user?.documents?.propertyProof) completed++;

    return Math.round((completed / total) * 100);
  };

  if (isLoading) return <ProfileSkeleton />;

  const completion = getProfileCompletion(data);

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">

      {/* 🔥 HERO SECTION */}
      <div className="bg-white shadow rounded-2xl p-6 flex flex-col md:flex-row md:items-center gap-6">

        <ProfileAvatar image={data?.profilePic} size={80} />

        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-bold">
              {data?.name || "User"}
            </h2>

            {data?.verificationStatus === "verified" && (
              <Tag color="green">Verified</Tag>
            )}
          </div>

          <p className="text-gray-600 text-sm mt-1">
            {config.subtitle}
          </p>

          <p className="flex items-center gap-2 text-gray-500 text-sm mt-1">
            <SlLocationPin />
            {data?.location || "No location added"}
          </p>

          <button
            onClick={() => setOpen(true)}
            className="mt-3 text-sm bg-black text-white px-4 py-1.5 rounded-lg"
          >
            Edit Profile
          </button>
        </div>

        {/* Completion */}
        <div className="w-full md:w-52">
          <p className="text-sm font-medium mb-1">
            Profile Completion
          </p>

          <Progress percent={completion} showInfo={false} strokeColor="black" />

          <p className="text-xs text-gray-500 mt-1 flex justify-between">
            <span>{completion}%</span>
            <span>{config.completionHint}</span>
          </p>
        </div>
      </div>

      {/* 🔥 GRID SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LEFT */}
        <div className="space-y-6">

          {/* CONTACT */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h3 className="font-semibold mb-4 text-[#222]">Contact Info</h3>

            <div className="space-y-3">
              <ProfileBadges icon={<MdEmail />} label="Email" value={data?.email} />
              <ProfileBadges icon={<FaPhoneAlt />} label="Mobile" value={data?.mobile || "Not Added"} />
            </div>
          </div>

          {/* ACCOUNT */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h3 className="font-semibold mb-4 text-[#222]">Account</h3>

            <div className="space-y-3">

              <ProfileBadges
                icon={
                  data?.accountStatus === "active"
                    ? <CiCircleCheck className="text-green-500" />
                    : <CiCircleRemove className="text-red-500" />
                }
                label="Status"
                value={data?.accountStatus}
              />

              {isOwner ? (
                <ProfileBadges
                  icon={<MdEmail />}
                  label="Verification"
                  value={data?.verificationStatus}
                />
              ) : (
                <button
                  onClick={() => setOpenFavs(true)}
                  className="w-full text-left"
                >
                  <ProfileBadges
                    icon={<IoIosHeart className="text-[#FF5A5F]" />}
                    label="Favorites"
                    value={data?.favorites?.length || 0}
                  />
                </button>
              )}

              {isOwner && (
                <ProfileBadges
                  icon={<FaHome />}
                  label="Properties"
                  value={propertyData?.length || 0}
                />
              )}

            </div>
          </div>

          {/* FAVORITES MODAL */}
          {!isOwner && openFavs && (
            <div className="fixed inset-0 z-50">

              {/* overlay */}
              <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setOpenFavs(false)}
              />

              {/* modal */}
              <div className="absolute inset-0 flex items-center justify-center p-4">

                <div
                  className="bg-white w-full max-w-5xl rounded-2xl shadow-xl flex flex-col max-h-[90vh]"
                  onClick={(e) => e.stopPropagation()}
                >

                  {/* header */}
                  <div className="flex justify-between items-center p-5 border-b">
                    <h2 className="text-lg font-semibold text-[#222]">
                      Saved Properties
                    </h2>

                    <CgClose
                      className="cursor-pointer text-gray-500 hover:text-black"
                      size={20}
                      onClick={() => setOpenFavs(false)}
                    />
                  </div>

                  {/* content (scrollable) */}
                  <div className="p-5 overflow-y-auto">

                    {favorites?.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {favorites.map((p) => (
                          <PropertyCard key={p._id} property={p} />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16 text-gray-400">
                        No saved properties yet
                      </div>
                    )}

                  </div>

                </div>
              </div>
            </div>
          )}

        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          <div className="bg-white shadow rounded-2xl p-5">
            <h3 className="font-semibold mb-4">
              {isOwner ? "Verification Documents" : "Identity Verification"}
            </h3>

            <div className="space-y-3">
              <DocumentPreview
                label="ID Proof"
                file={data?.documents?.idProof}
              />

              {isOwner && (
                <DocumentPreview
                  label="Property Proof"
                  file={data?.documents?.propertyProof}
                />
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 🔥 MAIN SECTION (ROLE BASED) */}
      {isOwner ? (
        <div className="bg-white shadow rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h3 className="font-semibold">My Properties</h3>

            <Link to={"/add-property"} className="text-sm bg-black text-white px-3 py-1 rounded-lg">
              {config.cta}
            </Link>
          </div>

          {propertyLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : propertyData?.length > 0 ? (
            <div className="grid grid-cols-1 py-1 px-2 sm:grid-cols-2 md:grid-cols-3 gap-4 h-[40vh] overflow-y-auto">
              {propertyData.map((p) => (
                <MyPropertyCard key={p._id} property={p} />
              ))}
            </div>
          ) : (
            <p className="flex justify-center items-center text-gray-500 gap-2">
              No Properties <TbError404 />
            </p>
          )}
        </div>
      ) : (
        <div className="bg-white shadow rounded-2xl p-5 text-center">
          <h3 className="font-semibold mb-2">Get Started</h3>
          <p className="text-sm text-gray-500 mb-4">
            Complete your profile to start connecting with owners
          </p>

          <Link to={"/"} className="bg-black text-white px-4 py-2 rounded-lg">
            {config.cta}
          </Link>
        </div>
      )}

      {/* REVIEWS */}
      <div className="bg-white shadow rounded-2xl p-5">
        <h3 className="font-semibold mb-3">My Reviews</h3>
        <p className="text-gray-500 text-sm">
          Review system coming soon...
        </p>
      </div>

      {/* MODAL */}
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