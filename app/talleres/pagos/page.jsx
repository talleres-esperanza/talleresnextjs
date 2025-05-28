"use client";
import GlobalApi from "@/app/_utils/GlobalApi";
import React, { useEffect, useState } from "react";
import Image from "next/image";

const PagosPage = () => {
  const [pagos, setPagos] = useState([]);

  useEffect(() => {
    getPagos();
  }, []);

  const getPagos = () => {
    GlobalApi.GetPagos().then((resp) => {
      console.log(resp);
      setPagos(resp.pagos || []);
    });
  };

  return (
    <div>
      <h1 className="text-3xl mb-5 font-bold">Pagos</h1>

      <div className="mt-6 border rounded-md overflow-x-auto bg-white">
        <div className="grid grid-cols-[200px_1fr_150px] bg-white border-b p-4 font-semibold">
          <div>Aprendiz</div>
          <div>Productos</div>
          <div>Tipo de Pago</div>
        </div>

        {pagos.map((pago) => (
          <div
            key={pago.id}
            className="grid grid-cols-[200px_1fr_150px] border-b p-4 items-start"
          >
            {/* Información del aprendiz */}
            <div className="flex flex-col items-center">
              <Image
                src={
                  pago.pedido.aprendice?.foto?.url ||
                  pago.pedido.aprendice?.url2 ||
                  "/placeholder-user.png"
                }
                alt="Aprendiz"
                width={120}
                height={120}
                className="object-cover w-[120px] h-[120px] rounded-full"
              />
              <p className="text-sm text-center mt-1 capitalize">
                {pago.pedido.aprendice?.nombre}
              </p>
            </div>

            {/* Lista de productos */}
            <div className="flex flex-wrap gap-4">
              {pago.pedido.productoCantidad.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center border rounded-md p-2 w-32"
                >
                  <Image
                    src={
                      item.producto?.imagen?.url ||
                      item.producto?.url2 ||
                      "/placeholder-product.png"
                    }
                    alt="Producto"
                    width={120}
                    height={120}
                    className="rounded object-cover w-[120px] h-[120px]"
                  />
                  <p className="text-sm text-center mt-2 capitalize">
                    {item.producto?.nombre}
                  </p>
                  <p className="text-sm mt-1">Cantidad: {item.cantidad}</p>
                </div>
              ))}
            </div>

            {/* Tipo de pago */}
            <div className="flex items-center justify-center">
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                {pago.tipoPago?.tipoPago}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PagosPage;
