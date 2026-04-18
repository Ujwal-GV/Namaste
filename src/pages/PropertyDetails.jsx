import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import API from "../api/axios";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useApply, useMyRequest } from "../hooks/useRequests";
import Map from "../components/Map";
import { FaLocationArrow, FaStar, FaStarHalf } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6"
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { MdDeleteOutline, MdModeEditOutline } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import toast from "react-hot-toast";
import { FiAlertOctagon } from "react-icons/fi";
import EditPropertyModal from "../components/EditPropertyModal";
import { IoIosHourglass } from "react-icons/io";
import { GiNotebook } from "react-icons/gi";
import ImageCarousel from "../components/ImageCarousel";
import SkeletonCard from "../components/SkeletonCard";
import SkeletonPropertyDetails from "../components/SkeletonPropertyDetails";
import { IoIosCheckmarkCircle, IoMdCloseCircle  } from "react-icons/io";
import { Loader2Icon } from "lucide-react";


export default function PropertyDetails() {
  const { id } = useParams();
  const { token, user } = useContext(AuthContext);
  const { mutate, isPending } = useApply();
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

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

  const { data, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const res = await API.get(`/property/${id}`);
      return res.data;
    },
  });

  if (isLoading) return <SkeletonPropertyDetails />;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">

      <div className="bg-white rounded-2xl shadow p-4">
        <ImageCarousel images={data?.images || []} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <div className="space-y-6">

          <div className="bg-white shadow rounded-2xl p-5 space-y-3">
{console.log("Data", data.createdBy._id, "PripertyId", id, "usEr", user.id)
                    }
            <h1 className="text-2xl font-bold">{data.title}</h1>

            <p className="flex items-center gap-2 text-gray-600">
              <FaLocationDot className="text-red-500" />
              {data.location}
            </p>

            <p className="text-sm text-gray-500">
              {data.detailedAddress}
            </p>

            <div className="flex items-center gap-6 mt-3">
              <span className="flex items-center gap-1 text-green-600 font-bold text-xl">
                <RiMoneyRupeeCircleFill />
                {data.rent}
              </span>

              <span className="text-gray-500">
                Deposit: ₹{data.deposit}
              </span>
            </div>

            <div className="flex items-center gap-1 text-yellow-400">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStarHalf />
              <span className="text-gray-500 ml-2">(4.5)</span>
            </div>

            <p className="text-sm text-gray-700 mt-3">
              {data.description}
            </p>
          </div>

          <div className="bg-white shadow rounded-2xl p-5">

            {user?.role !== "owner" ? (
              <>
                {!token ? (
                  <button className="w-full py-3 rounded-xl bg-gray-300 text-gray-500">
                    Login to Apply
                  </button>
                ) : !myRequest ? (
                  <button
                    onClick={() =>
                      mutate({
                        propertyId: id,
                        message: "Interested in this property",
                      })
                    }
                    className="w-full py-3 rounded-xl bg-black text-white flex justify-center"
                  >
                    {isPending ? <Loader2Icon className="animatespin-slow-reverse" /> : "Apply"}
                  </button>
                ) : myRequest.status === "pending" ? (
                  <button className="w-full py-3 rounded-xl bg-yellow-400 text-white flex items-center justify-center gap-2 cursor-not-allowed">
                    Pending <IoIosHourglass />
                  </button>
                ) : myRequest?.status === "accepted" ? (
                    <button
                      onClick={async () => {
                        const res = await API.post("/conversations", {
                          propertyId: id,
                          userId: user.id,
                          ownerId: data.createdBy._id,
                      });

                      console.log(res.data, "ID");
                      
                        navigate(`/chat/${res.data._id}`);
                      }}
                      className="w-full py-3 mt-3 rounded-xl bg-black text-white"
                    >
                      Chat with Owner
                    </button>
                  ) : (
                  <button className="w-full py-3 rounded-xl bg-red-500 text-white flex items-center justify-center gap-2 cursor-not-allowed">
                    Rejected <IoMdCloseCircle />
                  </button>
                )}
              </>
            ) : (
              <div className="flex gap-3">
                <Link
                  to={`/property-requests/${id}`}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-xl flex justify-center"
                >
                  <GiNotebook />
                </Link>

                <button
                  onClick={() => setEditOpen(true)}
                  className="flex-1 bg-black text-white py-2 rounded-xl flex justify-center"
                >
                  <MdModeEditOutline />
                </button>

                <button
                  onClick={() => setConfirmDeleteModal(true)}
                  className="flex-1 bg-red-500 text-white py-2 rounded-xl flex justify-center"
                >
                  {deleteMutation.isPending ? (
                    <AiOutlineLoading3Quarters className="animate-spin mx-auto" />
                  ) : (
                    <MdDeleteOutline />
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="bg-white shadow rounded-2xl p-5">
            <h3 className="font-semibold mb-3">Reviews</h3>

            <div className="space-y-3">
              <div className="p-3 border rounded-xl text-sm">
                "Great place, good water supply"
              </div>
              <div className="p-3 border rounded-xl text-sm">
                "Owner is responsive"
              </div>
            </div>
          </div>
        </div>

        <div className="h-[400px] md:h-full rounded-2xl overflow-hidden shadow">
          <Map properties={[data]} />
        </div>
      </div>

      {confirmDeleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-sm text-center">
            <FiAlertOctagon className="text-red-500 text-3xl mx-auto mb-3" />
            <p className="mb-4">
              Delete this property permanently?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => deleteMutation.mutate()}
                className="flex-1 bg-black text-white py-2 rounded"
              >
                Confirm
              </button>

              <button
                onClick={() => setConfirmDeleteModal(false)}
                className="flex-1 bg-red-500 text-white py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <EditPropertyModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        property={data}
      />
    </div>
  );
}