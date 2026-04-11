import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import API from "../api/axios";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useApply, useMyRequest } from "../hooks/useRequests";
import Map from "../components/Map";
import { FaLocationDot } from "react-icons/fa6";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { MdDeleteOutline, MdModeEditOutline } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import toast from "react-hot-toast";
import { FiAlertOctagon } from "react-icons/fi";
import EditPropertyModal from "../components/EditPropertyModal";
import { FaStar, FaStarHalf  } from "react-icons/fa";
import ProfileAvatar from "../components/ProfileAvatar";
import ImageCarousel from "../components/ImageCarousel";
import { GiNotebook } from "react-icons/gi";
import { IoIosHourglass } from "react-icons/io";

// import Reviews from "../components/Reviews"; // later

export default function PropertyDetails() {
  const { id } = useParams();
  const { token, user } = useContext(AuthContext);
  const { mutate } = useApply();
  const [confirmDeletModal, setconfirmDeletModal] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const { data: myRequest } = useMyRequest(id, token);

  const navigate = useNavigate();

  const deleteResults = useMutation({
    mutationKey: ["edit-property"],
    mutationFn: async (id) => {
      const res = await API.delete(`/property/${id}`);
      return res.data;
    },

    onSuccess: (res) => {
      navigate("/");
      toast.success(res?.message);
    }, 

    onError: (error) => {
      toast.error(error?.response?.data?.message || "Update failed");
    }
  });
  
  const deleteProperty = () => {
    setconfirmDeletModal(true);
  };

  const handleApply = () => {
    mutate({
      propertyId: id,
      message: "Interested in this property",
    });
  };

  const { data, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const res = await API.get(`/property/${id}`);
      return res.data;
    },
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 min-h-screen">

      {/* LEFT SIDE */}
      <div className="md:w-1/2 w-full flex flex-col gap-6">

        {/* Property Card */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          {console.log("Property dd: ", data)}
          <h2 className="text-2xl font-bold">{data.title}</h2>

          <p className="text-gray-600 mt-2 flex items-center gap-2"><FaLocationDot className="text-red-600" />{data.location}</p>
          <p className="text-gray-500 text-sm mt-1">
            {data.detailedAddress}
          </p>

            
            <span className="text-gray-500">
              Deposit: ₹{data.deposit}
            </span>
            <span className="flex items-center gap-2">
              <span className="text-gray-500">Rent:</span>
              <RiMoneyRupeeCircleFill className="text-green-600" />
              <span className="text-green-600 font-bold text-xl">{data.rent}</span>
            </span>

            <span className="text-gray-500 flex items-center gap-2">
              Ratings: <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStar className="text-yellow-400" />
              <FaStarHalf className="text-yellow-400" />
              <span className="text-gray-500">(4.5)</span>
            </span>

          <p className="mt-4 text-[13px]">{data.description}</p>

          {
            confirmDeletModal && (
              <div 
                className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
                onClick={() => setconfirmDeletModal(false)}
              >
                <div 
                  className="bg-white lg:text-md md:text-md mx-4 p-4 rounded-lg shadow-lg max-w-sm w-[80%]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-lg center flex gap-2 items-center font-semibold text-gray-800 mb-4">
                    Alert 
                    <FiAlertOctagon className="text-red-500" />
                  </h3>
                  <hr className='w-[90%] mx-auto mb-2' />
                  <p className="text-sm text-gray-600 mb-4 text-center">
                    Do you wish to permanently delete this property?</p>
                  <hr className='w-[90%] mx-auto mb-2' />
                  <div className="flex gap-3 items-center justify-center">
                    <button 
                      className="bg-black text-white px-2 py-1 rounded-lg hover:bg-gray-700 text-sm"
                      onClick={() => deleteResults.mutate(id)}
                    >
                      Confirm
                    </button>
                    <button 
                      className="bg-red-600 text-white px-2 py-1 rounded-lg hover:bg-red-700 text-sm"
                      onClick={() => setconfirmDeletModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )
          }

          {/* CTA */}
          {user?.role !== "owner" ? (
            <>
              {!token ? (
                <button className="mt-4 w-full py-2 rounded-xl bg-gray-300 text-gray-500 cursor-not-allowed">
                  Login to Apply
                </button>
              ) : !myRequest ? (
                <button
                  onClick={handleApply}
                  className="mt-4 w-full py-2 rounded-xl bg-black text-white"
                >
                  Apply
                </button>
              ) : myRequest.status === "pending" ? (
                <button className="mt-4 w-full py-2 rounded-xl bg-yellow-400 opacity-70 text-white cursor-not-allowed flex items-center gap-1 justify-center">
                  Applied • Pending <IoIosHourglass />
                </button>
              ) : myRequest.status === "accepted" ? (
                <button className="mt-4 w-full py-2 rounded-xl bg-green-500 text-white cursor-not-allowed">
                  Approved ✅
                </button>
              ) : (
                <button className="mt-4 w-full py-2 rounded-xl bg-red-500 text-white cursor-not-allowed">
                  Rejected ❌
                </button>
              )}
            </>
          ) : (
            <span className="flex gap-2 rounded-lg w-1/2">
              <Link to={`/property-requests/${id}`}
                title="Applications" 
                className="mt-4 p-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl flex justify-center items-center gap-1"
              >
                <GiNotebook />
              </Link>
              <button
                title="Edit"
                className="mt-4 p-2 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl flex justify-center items-center gap-1"
                onClick={() => setEditOpen(true)}
              >
                <MdModeEditOutline />
              </button>
              <button 
                title="Delete"
                className="mt-4 p-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl flex justify-center items-center gap-1"
                onClick={() => deleteProperty()}
              >
                  {deleteResults.isPending ? <>Deleting <AiOutlineLoading3Quarters className="animatespin-slow-reverse" /></> : <><MdDeleteOutline /></>}
              </button>
            </span>
          )}
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4">Images</h3>
          <ImageCarousel images={data?.images || []} />
        </div>

        {/* REVIEWS SECTION */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4">Reviews</h3>

          <div className="space-y-3">
            <div className="p-3 border rounded-xl">
              <p className="text-sm">"Great place, good water supply"</p>
            </div>

            <div className="p-3 border rounded-xl">
              <p className="text-sm">"Owner is responsive"</p>
            </div>
          </div>
        </div>

        <EditPropertyModal
          open={editOpen}
          onClose={() => setEditOpen(false)}
          property={data}
        />

      </div>

      {/* RIGHT SIDE (MAP FULL HEIGHT) */}
      <div className="md:w-1/2 w-full h-[500px] md:h-auto rounded-2xl overflow-hidden shadow-md">
        <Map properties={data?.location || []} />
      </div>

    </div>
  );
}