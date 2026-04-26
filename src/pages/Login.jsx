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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-3 sm:px-4 py-6">

      <div className="bg-white shadow-lg rounded-2xl w-full max-w-md p-5 sm:p-6 md:p-8">

        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-6 flex items-center justify-center gap-1">
          <SiWelcometothejungle className="text-3xl sm:text-5xl mb-1" />
          elcome Back
        </h2>

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

              <div>
                <label className="text-xs sm:text-sm text-gray-600">
                  Email
                </label>

                <Field
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-3.5 sm:p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black text-sm sm:text-base"
                />

                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div className="relative">
                <label className="text-xs sm:text-sm text-gray-600">
                  Password
                </label>

                <Field
                  name="password"
                  type={hide ? "password" : "text"}
                  placeholder="Enter your password"
                  className="w-full p-3.5 sm:p-3 border rounded-xl pr-12 focus:outline-none focus:ring-2 focus:ring-black text-sm sm:text-base"
                />

                <span
                  className="absolute right-4 top-[38px] sm:top-[40px] cursor-pointer text-gray-500"
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

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-black text-white py-3.5 sm:py-3 rounded-xl flex justify-center items-center gap-2 hover:opacity-90 disabled:opacity-60 text-sm sm:text-base"
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

        <p className="text-center mt-6 text-xs sm:text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link to="/register" className="text-black font-semibold">
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}