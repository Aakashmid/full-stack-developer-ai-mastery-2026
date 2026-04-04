import React from "react";
import Logo from "./sidebar-components/Logo";

const Header = () => {
  return (
    <>
      <nav className="border-b-[1.5px] border-textMuted">
        <div className="ml-15 px-4 py-3">
          <Logo />
        </div>
      </nav>
    </>
  );
};

export default Header;
