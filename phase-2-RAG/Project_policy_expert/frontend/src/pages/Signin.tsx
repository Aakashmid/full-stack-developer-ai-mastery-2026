import CommonAuthForm from '@/components/CommonAuthForm'
import type { SigninPayload } from '@/types';

const Signin = () => {
  const handleSubmit = (payload:SigninPayload) => {
    console.log("Signin payload:", payload);
    // Implement actual sign-in logic here, such as making an API call to your backend.
  }

  return (
    <div className='h-screen w-screen flex flex-col justify-center items-center gap-10'>

    {/* logo and slogan */}
      <div className="flex flex-col gap-0.5">
        <div className="flex justify-center items-center gap-3">
          <img src="/images/logo-img.png" className='object-cover w-8 h-auto' alt="" />
          <p className="font-extrabold text-xl text-primary">PolicyBot</p>
        </div>
        <p className="text-sm   text-text-secondary">Your documents, instantly understood.</p>
      </div>


      <CommonAuthForm submit={handleSubmit} mode='signin'/>
    </div>
  )
}

export default Signin