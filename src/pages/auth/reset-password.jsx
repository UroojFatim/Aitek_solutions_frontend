import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Button, Typography } from "@material-tailwind/react";
import { useFormik, FormikProvider, Form } from "formik";
import * as Yup from "yup";
import Input from "@/shared/components/form/Input";
import { useDispatch } from "react-redux";
import { requestForgotPassword, forgotPassword } from "@/redux/actions/auth.action";
import { ROUTE_PATHS } from "@/constants/routes.constants";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ResetPassword = () => {
  const query = useQuery();
  const token = query.get("token");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // State for request/submit success
  const [emailSent, setEmailSent] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Formik for requesting reset link
  const requestFormik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Email is required"),
    }),
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      setStatus("");
      try {
        await dispatch(requestForgotPassword(values.email)).unwrap();
        setEmailSent(true);
      } catch (err) {
        setStatus(
          err?.response?.data?.message || "Failed to send reset link. Try again."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Formik for resetting password
  const resetFormik = useFormik({
    initialValues: { 
      newPassword: "",
      confirmPassword: "" 
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(/[^A-Za-z0-9]/, "Password must contain at least one special character")
        .required("New password is required"),
      confirmPassword: Yup.string()
        .required("Please confirm your password")
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
    }),
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      setStatus("");
      try {
        await dispatch(forgotPassword({ token, newPassword: values.newPassword })).unwrap();
        setResetSuccess(true);
        setTimeout(() => navigate(ROUTE_PATHS.AUTH.SIGN_IN), 2000);
      } catch (err) {
        setStatus(
          err?.response?.data?.message || "Failed to reset password. Try again."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <section className="m-8 flex gap-4 justify-center items-center min-h-[80vh]">
      <Card className="p-8 w-full max-w-md">
        {!token ? (
          <>
            <Typography variant="h4" className="mb-4 font-bold text-center">
              Forgot Password
            </Typography>
            {emailSent ? (
              <Typography color="green" className="mb-4 text-center">
                If the email exists, a reset link has been sent.
              </Typography>
            ) : (
              <FormikProvider value={requestFormik}>
                <Form className="flex flex-col gap-4">
                  <Typography variant="small" className="mb-2 font-medium">
                    Enter your email address
                  </Typography>
                  <Input
                    name="email"
                    type="email"
                    label="Email"
                    required
                    className="mb-4"
                  />
                  {requestFormik.status && (
                    <Typography color="red" className="mb-2">
                      {requestFormik.status}
                    </Typography>
                  )}
                  <Button type="submit" fullWidth disabled={requestFormik.isSubmitting}>
                    {requestFormik.isSubmitting ? "Sending..." : "Send Reset Link"}
                  </Button>
                </Form>
              </FormikProvider>
            )}
          </>
        ) : (
          <>
            <Typography variant="h4" className="mb-4 font-bold text-center">
              Reset Password
            </Typography>
            {resetSuccess ? (
              <Typography color="green" className="mb-4 text-center">
                Password has been reset successfully. Redirecting to sign in...
              </Typography>
            ) : (
              <FormikProvider value={resetFormik}>
                <Form className="flex flex-col gap-4">
                  <Typography variant="small" className="mb-2 font-medium">
                    Enter your new password
                  </Typography>
                  <Input
                    name="newPassword"
                    type="password"
                    label="New Password"
                    placeholder="New password"
                    required
                    className="mb-4"
                  />
                  <Input
                    name="confirmPassword"
                    type="password"
                    label="Confirm Password"
                    placeholder="Confirm password"
                    required
                    className="mb-4"
                  />
                  {resetFormik.status && (
                    <Typography color="red" className="mb-2 text-center">
                      {resetFormik.status}
                    </Typography>
                  )}
                  <Button type="submit" fullWidth disabled={resetFormik.isSubmitting}>
                    {resetFormik.isSubmitting ? "Resetting..." : "Reset Password"}
                  </Button>
                </Form>
              </FormikProvider>
            )}
          </>
        )}
      </Card>
    </section>
  );
}

export default ResetPassword;
