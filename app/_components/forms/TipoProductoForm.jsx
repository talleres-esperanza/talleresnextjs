"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GlobalApi from "@/app/_utils/GlobalApi";
import { useForm } from "react-hook-form";
import React from "react";

const TipoProductoForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const registerProducto = async (data) => {
    try {
      console.log("Producto creado:", data);
      const result = await GlobalApi.createTipoProducto({
        nombre: data.nombre,
        precio: data.precio
      });

      console.log("TipoProducto creado:", result);
    } catch (error) {
      console.error("Error al crear producto:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(registerProducto)}>
      <div className="grid grid-cols-2 gap-5">
        {/* Campo Nombre */}
        <div className="flex flex-col gap-2">
          <Label>Nombre del tipo de producto</Label>
          <Input
            type="text"
            placeholder="Ej. Fruta"
            {...register("nombre", {
              required: "El nombre del tipo de producto es obligatorio",
            })}
          />
          <p className="text-red-600 text-sm">
            {errors.nombre?.message?.toString()}
          </p>
        </div>

        {/* Campo Precio */}
        <div className="flex flex-col gap-2">
          <Label>Precio</Label>
          <Input
            type="number"
            step="0.01"
            placeholder="Ej. 15.99"
            {...register("precio", {
              required: "El precio es obligatorio",
              min: {
                value: 0,
                message: "El precio debe ser mayor o igual a 0",
              },
            })}
          />
          <p className="text-red-600 text-sm">
            {errors.precio?.message?.toString()}
          </p>
        </div>
      </div>
      <Button className="mt-4" type="submit">
        Crear Producto
      </Button>
    </form>
  );
};

export default TipoProductoForm;
