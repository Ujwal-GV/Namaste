import { useEffect, useState } from "react";
import { useSendOtp, useVerifyOtp, useRegister } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { maskEmail, useOtpTimer } from "../hooks/useOtpTimer";
import OTPInput from "../components/OTPInput";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { emailRegisterSchema, otpRegisterSchema } from "../formikYupSchema/formikYup";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { SiWelcometothejungle } from "react-icons/si";

const EmailStep = ({ onSendOtp, loading }) => {
  return (
    <Formik
      initialValues={{ email: "" }}
      validationSchema={emailRegisterSchema}
      onSubmit={(values) => onSendOtp(values.email)}
    >
      {() => (
        <Form className="space-y-5">

          <div>
            <label className="text-sm font-medium">Email</label>
            <Field
              name="email"
              className="w-full mt-1 p-3 border rounded-xl"
              placeholder="Enter your email"
            />
            <ErrorMessage
              name="email"
              component="p"
              className="text-red-500 text-xs mt-1"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-xl flex justify-center"
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : "Send OTP"}
          </button>

        </Form>
      )}
    </Formik>
  );
};

const OtpStep = ({ email, onVerifyOtp, onRegister, onResend, verifying, registering }) => {
  const [otp, setOtp] = useState("");
  const [hide, setHide] = useState(true);
  const [shake, setShake] = useState(false);
  const [verified, setVerified] = useState(false);

  const { time, start } = useOtpTimer(30);

  useEffect(() => {
    start();
  }, []);

  const handleVerifyClick = async () => {
    if (otp.length !== 6) return;

    onVerifyOtp(otp, {
      onerror: () => {
        setShake(true);
        setTimeout(() => setShake(false), 400);
        setOtp("");
      },
      onSuccess: () => {
        setVerified(true);
      },
    });
  };

  return (
    <Formik
      initialValues={{ name: "", password: "", accepted: false }}
      validationSchema={verified ? otpRegisterSchema : null}
      onSubmit={(values) => onRegister({ email, name: values.name, password: values.password })}
    >
      <Form className="space-y-4" autoComplete="off">

        <div>
          <label className="text-sm font-medium">Email</label>
          <input
            value={email}
            readOnly
            autoComplete="off"
            className="w-full mt-1 p-3 border rounded-xl bg-gray-100 text-gray-500"
          />
          {!verified && (
            <p className="text-xs text-gray-500 mt-1 text-center">
              OTP sent to {maskEmail(email)}
            </p>
          )}
        </div>

        {!verified && (
          <div>
            <label className="text-sm font-medium">OTP</label>
              <div className={`${shake ? "shake" : ""}`}>
                <OTPInput value={otp} onChange={setOtp} />
              </div>

              <button
                type="button"
                onClick={handleVerifyClick}
                className="w-full mt-3 bg-black text-white py-3 rounded-xl flex justify-center"
              >
                {verifying ? <AiOutlineLoading3Quarters className="animate-spin" /> : "Verify OTP"}
              </button>

              <button
                type="button"
                disabled={time > 0}
                onClick={() => {
                  onResend();
                  setOtp("");
                  start();
                }}
                className="text-sm text-blue-500 text-center w-full"
              >
                {time > 0 ? `Resend in ${time}s` : "Resend OTP"}
              </button>
          </div>
        )}

        {verified && (
          <>
            <div className="animate-fade-in">
              <label className="text-sm font-medium">Name</label>
              <Field
                name="name"
                autoComplete="off"
                placeholder="Enter your name"
                className="w-full mt-1 p-3 border rounded-xl"
              />
              <ErrorMessage name="name" component="p" className="text-red-500 text-xs mt-1" />
            </div>

            <div className="relative">
              <label className="text-xs sm:text-sm text-gray-600">
                Password
              </label>
            
              <Field
                name="password"
                type={hide ? "password" : "text"}
                autoComplete="new-password"
                placeholder="Create password"
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

            <div className="flex gap-2 text-sm items-center">
              <Field type="checkbox" name="accepted" />
              <span>I accept Terms & Privacy</span>
            </div>

            <ErrorMessage name="accepted" component="p" className="text-red-500 text-xs" />

            <button type="submit" className="w-full bg-black text-white py-3 rounded-xl flex justify-center text-center">
              {registering ? <AiOutlineLoading3Quarters className="animate-spin" /> : "Create Account"}
            </button>
          </>
        )}
      </Form>
    </Formik>
  );
};

export default function Register() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  const { mutate: sendOtp, isPending: sending } = useSendOtp();
  const { mutate: verifyOtp, isPending: verifying } = useVerifyOtp();
  const { mutate: register, isPending: registering } = useRegister();

  const navigate = useNavigate();

  const handleRegister = (data) => {
  register(data, {
    onSuccess: () => navigate("/login"),
  });
};

  const handleSendOtp = (emailValue) => {
    sendOtp(
      { email: emailValue },
      {
        onSuccess: () => {
          setEmail(emailValue);
          setStep(2);
        },
      }
    );
  };

  const handleVerifyOtp = (otp, callbacks) => {
    verifyOtp({ email, otp }, callbacks);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-3">

      <div className="bg-white rounded-2xl shadow w-full max-w-md p-6">

        <h2 className="text-2xl font-bold text-center mb-6">
          {step === 1 ? "Register Email" : "Create Account"}
        </h2>

        {step === 1 ? (
          <EmailStep onSendOtp={handleSendOtp} loading={sending} />
        ) : (
          <OtpStep
            email={email}
            onVerifyOtp={handleVerifyOtp}
            onRegister={handleRegister}
            onResend={() => sendOtp({ email })}
            verifying={verifying}
            registering={registering}
          />
        )}

      </div>
    </div>
  );
}