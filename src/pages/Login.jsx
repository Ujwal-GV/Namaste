import { useState } from "react";
import { useLogin } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa6";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hide, setHide] = useState(true);

  const { mutate, isPending } = useLogin();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    mutate(
      { email, password },
      {
        onSuccess: (res) => {
          const decoded = jwtDecode(localStorage.getItem("token"));
          console.log("DECODED", decoded);
          
          if(decoded?.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/");
          }
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            {isPending ? <AiOutlineLoading3Quarters className="animatespin-slow-reverse" /> : "Login"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}