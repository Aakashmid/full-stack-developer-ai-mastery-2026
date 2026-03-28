import CommonAuthForm from "@/components/CommonAuthForm";
import { useAuth } from "@/context/AuthProvider";
import type { SigninPayload } from "@/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const navigate = useNavigate();
  const { signinAction, isAuthenticated } = useAuth();
  const [errors, setErrors] = useState<string[]>([]);
  const handleSubmit = async (payload: SigninPayload) => {
    try {
      signinAction(payload);
    } catch (error: any) {
      setErrors(error.message.split("\n"));
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
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
      <CommonAuthForm submit={handleSubmit} mode="signin" errors={errors} />f
    </div>
  );
};

export default Signin;
