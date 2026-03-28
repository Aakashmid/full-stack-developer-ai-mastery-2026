import CommonAuthForm from "@/components/CommonAuthForm";
import { useAuth } from "@/context/AuthProvider";
import type { SignupPayload } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const Signup = () => {
  const navigate = useNavigate();
  const { signupAction, isAuthenticated } = useAuth();
  const [errors, setErrors] = useState<string[]>([]);
  const handleSubmit = async (
    payload: SignupPayload,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    setIsLoading(true);
    try {
      await signupAction(payload);
    } catch (error: any) {
      // if (error != null && typeof error === "object" && "message" in error) {
      console.log("error message:", error.message);
      setErrors(error.message.split("\n"));
      // }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log(isAuthenticated);
    if (isAuthenticated) {
      console.log("user is authenticated");
      navigate("/"); // Navigate when user is authenticated
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center gap-10">
      {/* logo and slogan */}
      <div className="flex flex-col gap-0.5">
        <div className="flex justify-center items-center gap-3">
          <img
            src="/images/logo-img.png"
            className="object-cover w-8 h-auto"
            alt=""
          />
          <p className="font-extrabold text-xl text-primary">PolicyBot</p>
        </div>
        <p className="text-sm   text-text-secondary">
          Your documents, instantly understood.
        </p>
      </div>

      <CommonAuthForm submit={handleSubmit} errors={errors} mode="signup" />
    </div>
  );
};

export default Signup;
