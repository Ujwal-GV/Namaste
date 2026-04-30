import { useState } from "react";
import { useLogin } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { jwtDecode } from "jwt-decode";
import { SiWelcometothejungle } from "react-icons/si";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { loginSchema } from "../formikYupSchema/formikYup";

export default function Login() {
  const [hide, setHide] = useState(true);
  const { mutate, isPending } = useLogin();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f7f7f7] to-white px-4 py-8">

      <div className="bg-white border border-gray-200 shadow-sm rounded-3xl w-full max-w-md p-6 sm:p-8">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#222]">
            Welcome back
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Log in to continue
          </p>
        </div>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={loginSchema}
          onSubmit={(values) => {
            mutate(values, {
              onSuccess: () => {
                const decoded = jwtDecode(localStorage.getItem("token"));
                navigate(decoded?.role === "admin" ? "/admin/dashboard" : "/");
              },
            });
          }}
        >
          {() => (
            <Form className="space-y-5">

              {/* EMAIL */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">
                  Email
                </label>

                <Field
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:bg-white focus:ring-2 focus:ring-[#FF5A5F]/30 transition text-sm"
                />

                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* PASSWORD */}
              <div className="relative">
                <label className="text-xs text-gray-500 mb-1 block">
                  Password
                </label>

                <Field
                  name="password"
                  type={hide ? "password" : "text"}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 outline-none focus:bg-white focus:ring-2 focus:ring-[#FF5A5F]/30 pr-12 transition text-sm"
                />

                <span
                  className="absolute right-4 top-[38px] cursor-pointer text-gray-400 hover:text-gray-600"
                  onClick={() => setHide(!hide)}
                >
                  {hide ? <FaEye /> : <FaEyeSlash />}
                </span>

                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#FF5A5F] text-white py-3 rounded-xl flex justify-center items-center gap-2 hover:opacity-90 disabled:opacity-60 transition text-sm font-medium"
              >
                {isPending ? (
                  <>
                    <AiOutlineLoading3Quarters className="animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>

            </Form>
          )}
        </Formik>

        {/* FOOTER */}
        <p className="text-center mt-6 text-sm text-gray-500">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-[#FF5A5F] font-medium hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}