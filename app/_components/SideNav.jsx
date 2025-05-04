"use client"; // Asegúrate de usar esto si estás en un entorno de app router

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { SidebarLinks } from "../_utils/SidebarLinks";

const SideNav = () => {
  const pathname = usePathname(); // Obtiene la ruta actual

  return (
    <div className="hidden bg-white md:flex flex-col justify-between h-[calc(100vh-97px)] py-5 w-96 border-r">
      <div className="flex flex-col mx-7 gap-4">
        {SidebarLinks.map((link) => (
          <Link
            key={link.link} // Agrega una key única para evitar advertencias en React
            href={link.link} // Usa href en lugar de to
            className={`flex items-center text-md gap-3 px-4 rounded-lg py-4 transition-all duration-300 font-semibold ${
              pathname === link.link
                ? "text-green-700 bg-green-500/20"
                : "text-slate-500 hover:text-primary"
            }`}
          >
            {link.icon}
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SideNav;
