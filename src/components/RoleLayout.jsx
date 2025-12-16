import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

function RoleLayout({ activeRole, onRoleChange, children}) {
  const navigate = useNavigate();

  const handleClick = (page) => {
    onRoleChange(page);
    navigate(`/${page.toLowerCase()}`);
  };

  return (
    <div>
      <h1 className="px-3 py-1 md:text-4xl font-bold font-[Arial] text-white mb-10">
        Ducay's Restaurant
      </h1>

      <div className="min-h-screen px-4 py-[-5px] bg-[#101E3C] flex flex-col items-center">
        <div className="flex flex-row items-center justify-center gap-8 md:gap-20 flex-wrap">
          {["Cashier", "Kitchen", "Manager"].map((btn) => (
            <button
              key={btn}
              onClick={() => handleClick(btn)}
              className={`px-4 md:px-6 py-2 md:py-3 bg-[#101E3C] text-white text-lg md:text-3xl font-bold font-[Arial] transition cursor-pointer
                ${
                  activeRole === btn
                    ? "underline decoration-[#BF7000] underline-offset-4"
                    : ""
                }`}
            >
              {btn}
            </button>
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}

export default RoleLayout;
