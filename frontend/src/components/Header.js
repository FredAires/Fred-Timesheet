import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="bg-white shadow-sm p-4">
      {/* Logo */}
      <div className="flex items-center justify-center">
        <img src="/logo.png" alt="Company Logo" className="h-40 mx-auto" />
      </div>
      {/* Green bar */}
      <div className="max-w-md w-full mx-auto bg-[#a3cd39] py-2 rounded-lg">
        <div className="flex justify-between items-center px-4">
          <p style={{ color: "#545454", fontFamily: "Montserrat, sans-serif" }}>
            Hello, John{" "}
            <Link
              to="/login"
              className="text-[#545454] text-sm hover:underline"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              (Sign Out)
            </Link>
          </p>
        </div>
      </div>
    </header>
  );
}

export default Header;
