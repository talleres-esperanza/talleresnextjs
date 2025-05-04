"use client";

import React, { useEffect, useState } from "react";
import CombosTable from "@/app/_components/CombosTable";
import GlobalApi from "@/app/_utils/GlobalApi";

const CombosPage = () => {
  const [productos, setProductos] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const resp = await GlobalApi.getProductos();
        console.log(resp);
        setProductos(resp);
        console.log(productos);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div>
      <h1 className="text-3xl mb-5 font-bold">Combos</h1>

      {loading ? (
        <p>Cargando productos...</p>
      ) : productos.productos.length > 0 ? (
        <CombosTable combosList={productos} />
      ) : (
        <p>No hay productos</p>
      )}
    </div>
  );
};

export default CombosPage;
