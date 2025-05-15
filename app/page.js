"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; // o "next/router" si estás en una app basada en pages


export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/talleres/aprendices"); // cambia esto por la ruta a la que deseas redirigir
  }, []);

  return (
    <div className="h-[100vh] w-full flex items-center justify-center ">
      <div className="border border-green-500 rounded-full p-4">

      </div>
    </div>
  );
}
