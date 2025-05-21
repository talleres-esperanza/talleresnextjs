"use client";

import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DatePicker } from "@/app/_components/generic/DatePicker";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { format } from "date-fns";
import GlobalApi from "@/app/_utils/GlobalApi";

// Agrupar por aprendiz.id
const groupByAprendice = (array) => {
  return array.reduce((acc, item) => {
    const id = item.aprendice?.id;
    if (!acc[id]) {
      acc[id] = {
        aprendiz: item.aprendice,
        productos: [],
      };
    }
    acc[id].productos.push(item.producto);
    return acc;
  }, {});
};

const PedidosPage = () => {
  const [pedidosAgrupados, setPedidosAgrupados] = useState([]);
  const [cantidades, setCantidades] = useState({});

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fecha: null,
    },
  });

  const getPedidosList = () => {
    const today = format(new Date(), "yyyy-MM-dd");

    GlobalApi.GetPedidos(today).then((resp) => {
      const pedidosConIds = resp.pedidos.flatMap((pedido) =>
        pedido.producto.map((producto, index) => {
          const key = `${pedido.aprendice.id}-${producto.id}-${index}`;
          return {
            key,
            aprendice: pedido.aprendice,
            producto,
          };
        })
      );

      const agrupados = groupByAprendice(pedidosConIds);
      setPedidosAgrupados(Object.values(agrupados));

      const initialQuantities = {};
      pedidosConIds.forEach((item) => {
        initialQuantities[item.key] = 0;
      });
      setCantidades(initialQuantities);
    });
  };

  useEffect(() => {
    getPedidosList();
  }, []);

  const modificarCantidad = (key, delta) => {
    setCantidades((prev) => {
      const nuevaCantidad = (prev[key] ?? 0) + delta;
      return {
        ...prev,
        [key]: Math.max(0, nuevaCantidad), // no permite menos de 0
      };
    });
  };

  const onSubmit = (data) => {
    const fecha = format(data.fecha, "yyyy-MM-dd");

    const pedidosMap = {};

    Object.entries(cantidades).forEach(([key, cantidad]) => {
      if (cantidad > 0) {
        const [aprendizId, productoId, index] = key.split("-");

        // Encuentra aprendiz y producto según agrupación original
        const aprendizObj = pedidosAgrupados.find(
          (a) => a.aprendiz.id === aprendizId
        );
        const producto = aprendizObj?.productos.find(
          (p) => p.id === productoId
        );

        if (aprendizObj && producto) {
          if (!pedidosMap[aprendizId]) {
            pedidosMap[aprendizId] = {
              aprendiz: aprendizObj.aprendiz,
              productos: [],
            };
          }

          pedidosMap[aprendizId].productos.push({
            ...producto,
            cantidad,
          });
        }
      }
    });

    const resultadoFinal = {
      fecha,
      pedidos: Object.values(pedidosMap),
    };

    console.log(
      "📦 Pedidos agrupados por aprendiz con productos y cantidades:"
    );
    console.log(JSON.stringify(resultadoFinal, null, 2));
  };
  return (
    <div>
      <h1 className="text-3xl mb-5 font-bold">Pedidos</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center gap-5">
          <Controller
            name="fecha"
            control={control}
            rules={{ required: "La fecha es obligatoria" }}
            render={({ field }) => (
              <DatePicker date={field.value} onChange={field.onChange} />
            )}
          />
          {errors.fecha && (
            <p className="text-red-500 text-sm">{errors.fecha.message}</p>
          )}

          <Button type="submit">Guardar Pedidos</Button>
        </div>

        <div className="mt-6 border rounded-md overflow-x-auto">
          {/* Encabezado estilo tabla */}
          <div className="grid grid-cols-[200px_1fr] bg-gray-100 border-b p-4 font-semibold">
            <div>Aprendiz</div>
            <div>Productos</div>
          </div>

          {/* Contenido por aprendiz */}
          {pedidosAgrupados.map(({ aprendiz, productos }) => (
            <div
              key={aprendiz.id}
              className="grid grid-cols-[200px_1fr] border-b p-4 items-center"
            >
              {/* Info del Aprendiz */}
              <div className="flex flex-col items-center">
                <Image
                  src={
                    aprendiz?.foto?.url ||
                    aprendiz?.url2 ||
                    "/placeholder-user.png"
                  }
                  alt="Aprendiz"
                  width={120}
                  height={120}
                  className="object-cover w-[120px] h-[120px] rounded-full"
                />
                <p className="text-sm text-center mt-1 capitalize">
                  {aprendiz?.nombre}
                </p>
              </div>

              {/* Lista de productos */}
              <div className="flex flex-wrap gap-4">
                {productos.map((producto, index) => {
                  const key = `${aprendiz.id}-${producto.id}-${index}`;
                  return (
                    <div
                      key={key}
                      className="flex flex-col items-center border rounded-md p-2 w-32"
                    >
                      <Image
                        src={
                          producto?.imagen?.url ||
                          producto?.url2 ||
                          "/placeholder-product.png"
                        }
                        alt="Producto"
                        width={120}
                        height={120}
                        className="rounded object-cover w-[120px] h-[120px]"
                      />
                      <p className="text-sm text-center mt-2 capitalize">
                        {producto?.nombre}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => modificarCantidad(key, -1)}
                        >
                          -
                        </Button>
                        <span className="min-w-[24px] text-center">
                          {cantidades[key]}
                        </span>
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => modificarCantidad(key, 1)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

export default PedidosPage;
