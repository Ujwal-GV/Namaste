import { useState } from "react";
import { useRegister } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [hide, setHide] = useState(true);

  const { mutate, isPending } = useRegister();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    mutate(
      { email, password, name },
      {
        onSuccess: () => navigate("/login"),
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="UserName"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <span className="relative flex items-center gap-2">
            <input
              type={hide ? "password" : "text"}
              className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {
              hide ? <FaEye className="absolute right-4 cursor-pointer" onClick={() => setHide(!hide)} /> : <FaEyeSlash className="absolute right-4 cursor-pointer" onClick={() => setHide(!hide)} />
            }
          </span>

          <button
            disabled={isPending}
            className="w-full bg-black text-white py-3 rounded-xl hover:opacity-90 flex justify-center"
          >
            {isPending ? <AiOutlineLoading3Quarters className="animatespin-slow-reverse" /> : "Register"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}