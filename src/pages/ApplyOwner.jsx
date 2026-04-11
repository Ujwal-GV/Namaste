import { useContext, useState } from "react";
import { useAddProperty } from "../hooks/useProperties";
import { AuthContext } from "../context/AuthContext";
import { useApplyOwner } from "../hooks/useRequests";

export default function ApplyOwner() {
  const [form, setForm] = useState({});
  const { mutate, res } = useApplyOwner();

  console.log("REs", mutate);
  

  const { token } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(form);
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Claim Ownership</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required="true"
          className="w-full p-3 border rounded-xl"
          placeholder="ID Proof"
          onChange={(e) => setForm({ ...form, idProof: e.target.value })}
        />

        <input
          required="true"
          className="w-full p-3 border rounded-xl"
          placeholder="Property Proof"
          onChange={(e) => setForm({ ...form, propertyProof: e.target.value })}
        />

        <button className="w-full bg-black text-white py-3 rounded-xl">
          Apply
        </button>
      </form>
    </div>
  );
}