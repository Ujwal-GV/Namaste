import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import API from "../api/axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useApply, useMyRequest } from "../hooks/useRequests";
import Map from "../components/Map";
import { FaLocationArrow, FaStar, FaStarHalf } from "react-icons/fa";
import { FaHeart, FaLocationDot, FaRegHeart } from "react-icons/fa6"
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { MdDeleteOutline, MdModeEditOutline } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import toast from "react-hot-toast";
import { FiAlertOctagon } from "react-icons/fi";
import EditPropertyModal from "../components/EditPropertyModal";
import { IoIosHeart, IoIosHourglass } from "react-icons/io";
import { GiNotebook } from "react-icons/gi";
import ImageCarousel from "../components/ImageCarousel";
import SkeletonCard from "../components/SkeletonCard";
import SkeletonPropertyDetails from "../components/SkeletonPropertyDetails";
import { IoIosCheckmarkCircle, IoMdCloseCircle  } from "react-icons/io";
import { Loader2Icon } from "lucide-react";
import { getFormattedDate } from "../utils/TimeAgo";
import { useBreadcrumb } from "../context/BreadcrumbContext";
import { useFavorites, useToggleFavorite } from "../hooks/useProperties";
import { LuLoader } from "react-icons/lu";


export default function PropertyDetails() {
  const { id } = useParams();
  const { token, user } = useContext(AuthContext);
  const { mutate, isPending } = useApply();
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const { setDynamicLabels } = useBreadcrumb();

  const { data: myRequest } = useMyRequest(id, token);
  const navigate = useNavigate();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const res = await API.delete(`/property/${id}`);
      return res.data;
    },
    onSuccess: (res) => {
      toast.success(res?.message);
      navigate("/");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Delete failed");
    },
  });

  const { data: propertyData, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const res = await API.get(`/property/${id}`);
      
      return res.data;
    },
  });

    const { data: favorites = [] } = useFavorites();
    const { mutate: toggleMutate, isPending: favLoading } = useToggleFavorite();

    const isFav = favorites.some((f) => f._id === propertyData?._id);

  useEffect(() => {
    if(propertyData?._id && propertyData?.title) {
      setDynamicLabels(prev => ({
        ...prev,
        [propertyData?._id]: propertyData?.title,
      }));
    }
  }, [propertyData]);

  if (isLoading) return <SkeletonPropertyDetails />;  

  return (
    <div className="bg-[#f7f7f7] min-h-screen pb-10">

      <div className="max-w-7xl mx-auto px-4 pt-6 space-y-6">

        {/* 🖼 IMAGE CAROUSEL */}
        <div className="rounded-3xl overflow-hidden">
          <ImageCarousel images={propertyData?.images || []} />
        </div>

        <div className="grid md:grid-cols-2 gap-8">

          {/* LEFT */}
          <div className="space-y-6">

            {/* MAIN INFO */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">

              <div className="flex justify-between items-start">
                <h1 className="text-2xl md:text-3xl font-semibold text-[#222]">
                  {propertyData.title}
                </h1>

                <span className="text-xs text-gray-400">
                  {getFormattedDate(propertyData.createdAt)}
                </span>
              </div>

              <div className="flex justify-between items-start">
                <p className="flex items-center gap-2 text-gray-600 text-sm">
                  <FaLocationDot className="text-[#FF5A5F]" />
                  {propertyData.location}
                </p>

                <span 
                  className="text-sm text-gray-400 p-1 border border-gray-400 rounded-full cursor-pointer"
                  onClick={() => toggleMutate(propertyData._id)}
                >  
                  {favLoading ? (
                    <LuLoader className="animate-spin text-gray-400 text-sm" />
                  ) : isFav ? (
                    <FaHeart className="text-red-500" />
                  ) : (
                    <FaRegHeart className="text-gray-600" />
                  )}
                </span>
              </div>

              <p className="text-sm text-gray-500">
                {propertyData.detailedAddress}
              </p>

              {/* PRICE */}
              <div className="flex items-center gap-6 mt-3">
                <span className="text-2xl font-semibold text-[#222]">
                  ₹{propertyData.rent}
                  <span className="text-sm text-gray-500 font-normal">
                    {" "} / month
                  </span>
                </span>

                <span className="text-sm text-gray-500">
                  Deposit ₹{propertyData.deposit}
                </span>
              </div>

              {/* RATING */}
              <div className="flex items-center gap-1 text-yellow-400 text-sm">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalf />
                <span className="text-gray-500 ml-2">(4.5)</span>
              </div>

              {/* DESCRIPTION */}
              <p className="text-sm text-gray-700 leading-relaxed">
                {propertyData.description}
              </p>
            </div>

            {/* ACTIONS */}
            {user?.role !== "admin" && (
              <div className="bg-white border border-gray-200 rounded-2xl p-5">

                {user?.role !== "owner" ? (
                  <>
                    {!token ? (
                      <button className="w-full py-3 rounded-xl bg-gray-200 text-gray-500">
                        Login to apply
                      </button>
                    ) : !myRequest ? (
                      <button
                        onClick={() =>
                          mutate({
                            propertyId: id,
                            message: "Interested in this property",
                          })
                        }
                        className="w-full py-3 rounded-xl bg-[#FF5A5F] text-white font-medium hover:opacity-90 transition flex justify-center"
                      >
                        {isPending ? (
                          <Loader2Icon className="animate-spin" />
                        ) : (
                          "Apply now"
                        )}
                      </button>
                    ) : myRequest.status === "pending" ? (
                      <button className="w-full py-3 rounded-xl bg-yellow-100 text-yellow-600 flex items-center justify-center gap-2 cursor-not-allowed">
                        Pending <IoIosHourglass />
                      </button>
                    ) : myRequest?.status === "accepted" ? (
                      <button
                        onClick={async () => {
                          const res = await API.post("/conversations", {
                            propertyId: id,
                            userId: user.id,
                            ownerId: propertyData.createdBy._id,
                          });

                          navigate(`/chat/${res.propertyData._id}`);
                        }}
                        className="w-full py-3 rounded-xl bg-[#FF5A5F] text-white"
                      >
                        Chat with owner
                      </button>
                    ) : (
                      <button className="w-full py-3 rounded-xl bg-red-100 text-red-500 flex items-center justify-center gap-2 cursor-not-allowed">
                        Rejected <IoMdCloseCircle />
                      </button>
                    )}
                  </>
                ) : (
                  <div className="flex gap-3">

                    <Link
                      to={`/property-requests/${id}`}
                      className="flex-1 border border-gray-200 py-2 rounded-xl flex justify-center hover:bg-gray-50"
                    >
                      <GiNotebook />
                    </Link>

                    <button
                      onClick={() => setEditOpen(true)}
                      className="flex-1 border border-gray-200 py-2 rounded-xl flex justify-center hover:bg-gray-50"
                    >
                      <MdModeEditOutline />
                    </button>

                    <button
                      onClick={() => setConfirmDeleteModal(true)}
                      className="flex-1 border border-red-200 text-red-500 py-2 rounded-xl flex justify-center hover:bg-red-50"
                    >
                      {deleteMutation.isPending ? (
                        <AiOutlineLoading3Quarters className="animate-spin" />
                      ) : (
                        <MdDeleteOutline />
                      )}
                    </button>

                  </div>
                )}
              </div>
            )}

            {/* REVIEWS */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5">
              <h3 className="font-semibold mb-3 text-[#222]">
                Reviews
              </h3>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="p-3 bg-gray-50 rounded-xl">
                  “Great place, good water supply”
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  “Owner is responsive”
                </div>
              </div>
            </div>
          </div>

          {confirmDeleteModal && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

              <div className="bg-white w-[90%] max-w-sm rounded-2xl p-6 shadow-xl">

                {/* ICON */}
                <div className="flex justify-center mb-3">
                  <div className="bg-red-100 p-3 rounded-full">
                    <FiAlertOctagon className="text-red-500 text-xl" />
                  </div>
                </div>

                {/* TEXT */}
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-[#222]">
                    Delete property
                  </h3>

                  <p className="text-sm text-gray-500 mt-2">
                    This action cannot be undone. This will permanently delete your property listing.
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="mt-6 flex gap-3">

                  <button
                    onClick={() => setConfirmDeleteModal(false)}
                    className="flex-1 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => deleteMutation.mutate()}
                    className="flex-1 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition flex justify-center"
                  >
                    {deleteMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <AiOutlineLoading3Quarters className="animate-spin" />
                        Deleting
                      </span>
                    ) : (
                      "Delete"
                    )}
                  </button>

                </div>
              </div>
            </div>
          )}

          <EditPropertyModal
            open={editOpen}
            onClose={() => setEditOpen(false)}
            property={propertyData}
          />

          {/* RIGHT MAP */}
          <div className="h-[350px] md:h-full rounded-2xl overflow-hidden border border-gray-200">
            <Map properties={[propertyData]} />
          </div>
        </div>
      </div>
    </div>
  );
}