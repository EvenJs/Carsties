"use client";
import React from "react";
import Search from "./Search";
import Logo from "./Logo";
import { useParamsStore } from "@/hooks/useParamsStore";

export default function Navbar() {
  const searchTerm = useParamsStore((state) => state.searchTerm);
  return (
    <header className="sticky top-0 z-50 flex justify-between bg-white p-5 items-center text-gray-800 shadow-md">
      <Logo />
      <Search key={searchTerm} />

      <div>Login</div>
    </header>
  );
}
