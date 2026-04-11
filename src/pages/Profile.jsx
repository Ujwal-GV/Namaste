import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import API from "../api/axios";
import { Button, Progress } from "antd";
import ProfileModal from "../components/ProfileModal";
import ProfileAvatar from "../components/ProfileAvatar";
import ProfileBadges from "../components/ProfileBadges";
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";
import { useGetProperties, useMyProperties } from "../hooks/useProperties";
import { TbError404 } from "react-icons/tb";
import MyPropertyCard from "../components/MyPropertyCard";


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

  console.log("User Id", userId);

  const { 
    data: propertyData,
    isLaoding: propertyDataIsLoading
  } = useMyProperties(userId);
  console.log("Property Data\t", propertyData)

  const getProfileCompletion = (user) => {
    let total = 5;
    let completed = 0;

    if (user?.name) completed++;
    if (user?.mobile) completed++;
    if (user?.profilePic) completed++;
    if (user?.documents?.idProof) completed++;
    if (user?.role === "owner" && user?.documents?.propertyProof)
      completed++;

    return Math.round((completed / total) * 100);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="bg-white shadow rounded-2xl p-6 flex items-center gap-6">

        <ProfileAvatar
          image={data?.profilePic}
          onUpload={(file) => {
            console.log("Upload avatar", file);
          }}
        />

        <div>
          <h2 className="text-2xl font-bold">
            {data?.name || "User"}
          </h2>
          <p className="text-gray-500 text-sm">
            ID: {user?.id}
          </p>

          <Button
            className="mt-2"
            onClick={() => setOpen(true)}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h3 className="font-semibold mb-2">Profile Completion</h3>
        <Progress percent={getProfileCompletion(data)} />
      </div>

      {/* DETAILS */}
      <div className="grid grid-cols-2 gap-4">
        <ProfileBadges icon = { <MdEmail /> } text = {"Email"} value = { data?.email }/>
        <ProfileBadges icon = { <FaPhoneAlt /> } text = {"Mobile"} value = { data?.mobile }/>
        <ProfileBadges icon = { data?.accountStatus === "active" ? <CiCircleCheck className="bg-green-500 rounded-full" /> : <CiCircleRemove className="bg-red-500 rounded-full" /> } text = {"Account Status"} value = { data?.accountStatus }/>
        <ProfileBadges icon = { <MdEmail /> } text = {"Verification Status"} value = { data?.verificationStatus }/>
      </div>

      {/* DOCUMENTS */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h3 className="font-semibold mb-3">Documents</h3>

        <p>
          ID Proof: {data?.documents?.idProof ? "✅ Uploaded" : "❌ Missing"}
        </p>

        {data?.role === "owner" && (
          <p>
            Property Proof:{" "}
            {data?.documents?.propertyProof ? "✅ Uploaded" : "❌ Missing"}
          </p>
        )}
      </div>

      {/* PROPERTIES */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h3 className="font-semibold mb-3 border-b-2">My Properties</h3>
        <div className="p-2 h-[120px] overflow-y-auto custom-scroll">
            {propertyDataIsLoading ? (
                    <div className="grid md:grid-cols-3 gap-6">
                      {[...Array(6)].map((_, i) => (
                        <SkeletonCard key={i} />
                      ))}
                    </div>
                  ) : (<>
                      {propertyData?.length > 0 ? (
                          <div className="grid md:grid-cols-3 gap-6">
                              {propertyData.map((p) => (
                                <MyPropertyCard key={p._id} property={p} />
                              ))}
                          </div>
                      ) : (
                          <p className="flex gap-2 mx-auto items-center justify-center w-full text-center p-2 bg-gray-100 rounded-md">Not Found <TbError404 /></p>
                      )}
                  </>
                  )}
        </div>
      </div>

      {/* REVIEWS */}
      <div className="bg-white shadow rounded-2xl p-6">
        <h3 className="font-semibold mb-3">My Reviews</h3>

        <p className="text-gray-500">
          (Will integrate with review system)
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