"use client";

import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { DatePicker } from "@/app/_components/generic/DatePicker";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { format, intervalToDuration } from "date-fns";
import GlobalApi from "@/app/_utils/GlobalApi";

// Agrupar productos por aprendiz
const groupByAprendice = (array) => {
  return array.reduce((acc, item) => {
    const id = item.aprendice?.id;
    if (!acc[id]) {
      acc[id] = {
        aprendiz: item.aprendice,
        productos: [],
        pedidoId: item.pedidoId,
      };
    }
    acc[id].productos.push({ ...item.producto, pedidoId: item.pedidoId });
    return acc;
  }, {});
};

const PedidosPage = () => {
  const [pedidosAgrupados, setPedidosAgrupados] = useState([]);
  const [tipoPagos, setTipoPagos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [tipoPagoPorAprendiz, setTipoPagoPorAprendiz] = useState({});

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
    console.log(today);

    GlobalApi.GetPedidos(today).then((resp) => {
      const pedidosConIds = resp.pedidos.flatMap((pedido) =>
        pedido.producto.map((producto, index) => {
          const key = `${pedido.aprendice.id}-${producto.id}-${index}`;
          return {
            key,
            pedidoId: pedido.id,
            aprendice: pedido.aprendice,
            producto,
          };
        })
      );

      console.log(pedidosConIds);

      const agrupados = groupByAprendice(pedidosConIds);
      setPedidosAgrupados(Object.values(agrupados));

      const initialQuantities = {};
      pedidosConIds.forEach((item) => {
        initialQuantities[item.key] = 0;
      });
      setCantidades(initialQuantities);
    });
  };

  const getTipoPagos = () => {
    GlobalApi.getTipoPagos().then((resp) => {
      setTipoPagos(resp.tipoPagos || []);
    });
  };

  useEffect(() => {
    getPedidosList();
    getTipoPagos();
  }, []);

  const modificarCantidad = (key, delta) => {
    setCantidades((prev) => {
      const nuevaCantidad = (prev[key] ?? 0) + delta;
      return {
        ...prev,
        [key]: Math.max(0, nuevaCantidad),
      };
    });
  };

  const handleTipoPagoChange = (aprendizId, tipoPagoId) => {
    setTipoPagoPorAprendiz((prev) => ({
      ...prev,
      [aprendizId]: tipoPagoId,
    }));
  };

  const onSubmit = async (data) => {
    const fecha = format(data.fecha, "yyyy-MM-dd");
    const pedidosMap = {};

    Object.entries(cantidades).forEach(([key, cantidad]) => {
      if (cantidad > 0) {
        const [aprendizId, productoId, index] = key.split("-");

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
              pedidoId: producto.pedidoId,
            };
          }

          pedidosMap[aprendizId].productos.push({
            ...producto,
            cantidad,
            pedidoId: producto.pedidoId,
          });
        }
      }
    });

    const resultadoFinal = {
      fecha,
      pedidos: Object.values(pedidosMap).map((pedido) => ({
        ...pedido,
        tipoPagoId: tipoPagoPorAprendiz[pedido.aprendiz.id] || null,
      })),
    };
    
    console.log(resultadoFinal);

    for (const resultado of resultadoFinal.pedidos) {
      const tipoPagoId = tipoPagoPorAprendiz[resultado.aprendiz.id];

      if (!tipoPagoId) {
        console.warn(`⚠️ Falta tipo de pago para ${resultado.aprendiz.nombre}`);
        continue; // Puedes lanzar error si es obligatorio
      }

      for (const producto of resultado.productos) {
        const pedido = {
          id: resultado.pedidoId,
          tipoPagoId,
          producto: {
            id: producto.id,
            cantidad: producto.cantidad,
          },
        };

        try {
          await GlobalApi.updatePedido(pedido);
          await delay(300);
        } catch (error) {
          console.error("Error al actualizar pedido:", error);
        }
      }
    }
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

        <div className="mt-6 border rounded-md overflow-x-auto bg-white">
          <div className="grid grid-cols-[200px_1fr] bg-white border-b p-4 font-semibold">
            <div>Aprendiz</div>
            <div>Productos</div>
          </div>

          {pedidosAgrupados.map(({ aprendiz, productos }) => (
            <div
              key={aprendiz.id}
              className="grid grid-cols-[200px_1fr] border-b p-4 items-start"
            >
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

              <div className="flex  gap-4">
                <div className="flex  gap-4">
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

                {/* Radio buttons para tipo de pago */}
                <div className="w-full mt-4">
                  <p className="font-semibold mb-1">Tipo de pago:</p>
                  <div className="flex flex-col gap-4 flex-wrap">
                    {tipoPagos?.map((tp) => (
                      <label
                        key={tp.id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name={`tipoPago-${aprendiz.id}`}
                          value={tp.id}
                          checked={tipoPagoPorAprendiz[aprendiz.id] === tp.id}
                          onChange={() =>
                            handleTipoPagoChange(aprendiz.id, tp.id)
                          }
                          className="accent-blue-600"
                        />
                        {tp.tipoPago}
                      </label>
                    ))}
                  </div>
                  {!tipoPagoPorAprendiz[aprendiz.id] && (
                    <p className="text-red-500 text-sm mt-1">
                      Selecciona un tipo de pago
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

export default PedidosPage;
