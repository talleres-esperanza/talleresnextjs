"use client";

import GlobalApi from "@/app/_utils/GlobalApi";
import { uploadImageToCloudinary } from "@/app/_utils/upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

const ClientEditForm = ({ initialData }) => {
  const [tipoClientes, setTipoClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getTipoClientes();
  }, []);

  useEffect(() => {
    if (initialData && tipoClientes.length > 0) {
      reset({
        nombre: initialData.nombre || "",
        documento: initialData.documento || "",
        tipoCliente: initialData.tipoCliente?.id?.toString() || "",
        valera: initialData.tieneValera ? "si" : "no",
      });
      setIsLoading(false);
    }
  }, [initialData, tipoClientes, reset]);

  const getTipoClientes = () => {
    GlobalApi.GetTipoClientes().then((resp) => {
      setTipoClientes(resp.tipoClientes || []);
    });
  };

  const updateClient = async (data) => {
    try {
      let imageUrl = initialData.url2;

      if (data.foto?.[0]) {
        imageUrl = await uploadImageToCloudinary(
          data.foto[0],
          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          "b5twbvqk"
        );
      }

      const result = await GlobalApi.updateClient(initialData.id, {
        nombre: data.nombre,
        documento: data.documento,
        tipoClienteId: data.tipoCliente,
        valera: data.valera === "si",
        url2: imageUrl,
      });

      console.log("Cliente actualizado:", result);
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
    }
  };

  if (isLoading) {
    return <p className="text-gray-500">Cargando datos del cliente...</p>;
  }

  return (
    <form onSubmit={handleSubmit(updateClient)}>
      <div className="grid grid-cols-2 gap-5">
        {/* Nombre */}
        <div className="flex flex-col gap-2">
          <Label>Nombre Completo</Label>
          <Input
            type="text"
            placeholder="Ej. Fulanito Perez"
            {...register("nombre", {
              required: "El nombre del cliente es obligatorio",
            })}
          />
          <p className="text-red-600 text-sm">
            {errors.nombre?.message?.toString()}
          </p>
        </div>

        {/* Documento */}
        <div className="flex flex-col gap-2">
          <Label>Documento</Label>
          <Input
            type="text"
            placeholder="Ej. 10009238173"
            {...register("documento", {
              required: "El documento del cliente es obligatorio",
            })}
          />
          <p className="text-red-600 text-sm">
            {errors.documento?.message?.toString()}
          </p>
        </div>

        {/* Foto */}
        <div className="flex flex-col gap-2">
          <Label>Foto (opcional)</Label>
          <Input type="file" accept="image/*" {...register("foto")} />
        </div>

        {/* Tipo de Cliente */}
        <div className="flex flex-col gap-2">
          <Label>Tipo de Cliente</Label>
          <Controller
            name="tipoCliente"
            control={control}
            rules={{ required: "El tipo de cliente es obligatorio" }}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={initialData.tipoCliente?.id?.toString() || ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona el tipo de cliente" />
                </SelectTrigger>
                <SelectContent>
                  {tipoClientes.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id.toString()}>
                      {tipo.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <p className="text-red-600 text-sm">
            {errors.tipoCliente?.message?.toString()}
          </p>
        </div>

        {/* Valera */}
        <div className="flex flex-col gap-2">
          <Label>Valera</Label>
          <Controller
            name="valera"
            control={control}
            rules={{ required: "Este campo es obligatorio" }}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={initialData.tieneValera ? "si" : "no"}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="¿Tiene valera?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="si">Sí</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          <p className="text-red-600 text-sm">
            {errors.valera?.message?.toString()}
          </p>
        </div>
      </div>

      <Button className="mt-4" type="submit">
        Actualizar Cliente
      </Button>
    </form>
  );
};

export default ClientEditForm;
