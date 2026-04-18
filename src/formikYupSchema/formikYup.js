import * as Yup from "yup";

export const loginSchema = Yup.object().shape({
    email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
    password: Yup.string()
    .required("Password is required"),
});

export const emailRegisterSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
})

export const otpRegisterSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
      .required('Password is required'),
    accepted: Yup.boolean().oneOf([true], "Accept terms"),
});