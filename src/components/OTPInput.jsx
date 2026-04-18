import { useRef } from "react";

export default function OTPInput({ value, onChange }) {
  const inputs = useRef([]);

  const handleChange = (e, i) => {
    const val = e.target.value;

    if (!/^[0-9]?$/.test(val)) return;

    const newOtp = value.split("");
    newOtp[i] = val;
    onChange(newOtp.join(""));

    if (val && i < 5) {
      inputs.current[i + 1].focus();
    }
  };

  const handleBackspace = (e, i) => {
    if (e.key === "Backspace" && !value[i] && i > 0) {
      inputs.current[i - 1].focus();
    }
  };

  return (
    <div className="flex justify-between gap-2">
      {[...Array(6)].map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleBackspace(e, i)}
          className="w-10 h-12 text-center border rounded-xl text-lg"
        />
      ))}
    </div>
  );
}