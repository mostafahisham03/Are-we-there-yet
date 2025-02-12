import { useState } from "react";
import { motion } from "framer-motion";
import { LoginOrRegisterInput } from "@/modules/shared/components/LoginOrRegisterInput";
import { useNavigate, useNavigation } from "react-router";
import { Form, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/modules/shared/services/axiosInstance";
import toast from "react-hot-toast";

const SendOTPForm = () => {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();
  const navigate = useNavigate();
  const isSubmitting = navigation.state === "loading";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(email);

    // call the API to verify email,and send the OTP
    //1. call the API to send the OTP to the email
    const resPromise = axiosInstance.post(`users/forgotPassword`, {
      email,
    });

    toast.promise(resPromise, {
      loading: "Sending OTP...",
      success: "OTP sent successfully",
      error: "Failed to send OTP",
    });

    const res = await resPromise;
    console.log(res);
    //2. if the email is found, navigate to the verify OTP page
    if (res.status === 200) {
      navigate("/login/forgot-password/verify-otp", { state: { email } });
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md rounded-lg bg-black bg-opacity-30 p-8 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="mb-2 text-center text-4xl font-bold text-white">
            Forgot Password?
          </h1>
          <p className="mb-8 text-center text-xl text-accent-gold">
            We'll help you reset it
          </p>
        </motion.div>

        <Form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm text-white">
              Email
            </label>
            <LoginOrRegisterInput
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-white/20 bg-black bg-opacity-30 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-gold"
              placeholder="Enter your email"
            />
          </div>

          <Button
            type="submit"
            disabled={!email || isSubmitting}
            className="w-full bg-yellow-500 py-3 font-bold text-black transition-all duration-200 hover:bg-yellow-600"
          >
            {isSubmitting ? "Verifying email..." : "Send OTP"}
          </Button>
        </Form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-4 text-center text-white"
        >
          Remember your password?{" "}
          <Link to="/login" className="text-yellow-400 hover:underline">
            Back to Login
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default SendOTPForm;
