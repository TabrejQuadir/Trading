import React, { useState } from "react";
import Navbar from "../components/Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="bg-gray-100 flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 ">{children}</main>
    </div>
  );
};

export default MainLayout;
