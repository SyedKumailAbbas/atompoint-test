import React from "react";
import { BsBan } from "react-icons/bs";

const ZeroScreen = ({ message }) => {
  return (
    <div className="flex mt-4 flex-col items-center justify-center h-64 text-gray-500">
      <BsBan size={250} className="mt-8" /> {/* Increased margin-top */}
      <p className="text-2xl mt-4">{message || "No blogs available."}</p> {/* Increased text size */}
    </div>
  );
};

export default ZeroScreen;
