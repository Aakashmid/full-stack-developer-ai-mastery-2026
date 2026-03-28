import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center gap-2.5 ">
      <img src="/images/logo-img.png" alt="" className="object-cover h-9 w-9" />
      <p className="text-primary  font-open-sans text-2xl font-bold">
        PolicyBot
      </p>
    </div>
  );
};

export default Logo;
