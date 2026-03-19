import type { SigninPayload, SignupPayload } from "@/types";
import { useState } from "react";


interface SignUpProps{
  mode:"signup",
  submit: (payload: SignupPayload) => void;
}

interface SignInProps{
  mode:"signin",
  submit: (payload: SigninPayload) => void;
}

type Props  = SignInProps | SignUpProps;


export default function AuthForm(props : Props) {
  const isSignup = props.mode === "signup";
  const isError: boolean = false; // Replace with actual error state
  const [form, setForm] = useState({
    username: "",
    email: "",
    username_or_email: "",
    password: ""
  });

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e:React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!isSignup){
      const payload: SigninPayload={ username_or_email: form.username_or_email, password: form.password };
      props.submit(payload);
    }else{
      const payload: SignupPayload = {username:form.username, email: form.email, password: form.password } ;
      props.submit(payload);
    }

  };

  return (
    <div className="auth-card p-6 bg-surface border-text-muted border rounded-2xl max-w-100 w-full flex flex-col gap-6 ">

      {/* title - subtitle of form */}
      <div className="">
        <h2 className="font-extrabold text-[2rem]">{isSignup ? "Sign Up" : "Sign In"}</h2>
        <p className="text-text-secondary text-sm">{
          isSignup ? "Join PolicyBot and let AI navigate your documents with ease." : "Welcome back! Your documents are ready for more questions and insights."
        }</p>
      </div>


        {/* authorization form for both login and signup  */}
      <form className=" flex flex-col gap-6 " onSubmit={handleSubmit}>

        {isSignup ? (<>
          <input type="text" className="auth-form-input" placeholder="username" name="username" value={form.username} onChange={handleChange} />
          <input type="email" name="email" className="auth-form-input" placeholder="email" value={form.email} onChange={handleChange} />
        </>
        ) : (

          <input type="text" name="username_email" className="auth-form-input" placeholder="email or username" value={form.username_email} onChange={handleChange} />
        )}

        <div className="flex flex-col">
          <input type="password" name="password" className="auth-form-input" placeholder="password" value={form.password} onChange={handleChange} />
          {isError &&
            <p className="error-msg text-red text-sm "></p>
          }
        </div>


        <button className="primary-btn" type="submit">
          Continue
        </button>
      </form>

      <div className="divider items-center flex relative justify-center">
        <hr className="absolute  w-10/12 text-text-secondary h-3 top-1/2" />
        <p className=" z-10 bg-surface px-2 py-1 text-sm text-text-secondary">{isSignup ? "or sign up with" : "or sign in with"}</p>
      </div>


      <div className="flex flex-col  items-center">
        <button className="google-btn">
          <img src="/images/google.png" className="object-cover w-5 h-5" alt="" />
          <p className="">
            Continue with Google
          </p>
        </button>
        <p className=" mt-2 text-sm">
          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}

          <a className="text-primary font-semibold hover:underline" href={isSignup ? "/auth/signin" : "/auth/signup"}>
            {isSignup ? " Sign In" : " Sign Up"}
          </a>
        </p>
      </div>
    </div>
  );
}
