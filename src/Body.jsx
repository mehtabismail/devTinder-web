import React from "react";
import { Footer, NavBar } from "./components";
import { Outlet } from "react-router-dom";

export default function Body() {
  return (
    <div>
      <NavBar />

      <Outlet />

      <Footer />
    </div>
  );
}
