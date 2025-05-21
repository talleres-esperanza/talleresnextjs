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
  const [imagenPrevia, setImagenPrevia] = useState(null);

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
      setImagenPrevia(initialData.url2);
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
      let imageUrl = imagenPrevia;

      if (data.foto?.[0]) {
        imageUrl = await uploadImageToCloudinary(
          data.foto[0],
          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          "b5twbvqk"
        );
      }

      const clientData = {
        id: initialData.id,
        nombre: data.nombre,
        documento: data.documento,
        tipoClienteId: data.tipoCliente,
        tieneValera: data.valera === "si",
        url2: imageUrl || "",
      };

      const result = await GlobalApi.updateClient(clientData);
      console.log("Cliente actualizado:", result);

      // Aquí puedes agregar una notificación de éxito o redirección
    } catch (error) {
      console.error("Error al actualizar cliente:", error);
      // Aquí puedes agregar una notificación de error
    }
  };

  if (isLoading) {
    return <p className="text-gray-500">Cargando datos del cliente...</p>;
  }

  return (
    <form onSubmit={handleSubmit(updateClient)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre */}
        <div className="space-y-2">
          <Label>Nombre Completo *</Label>
          <Input
            type="text"
            placeholder="Ej. Fulanito Perez"
            {...register("nombre", {
              required: "El nombre del cliente es obligatorio",
            })}
          />
          {errors.nombre && (
            <p className="text-sm text-red-500">{errors.nombre.message}</p>
          )}
        </div>

        {/* Documento */}
        <div className="space-y-2">
          <Label>Documento *</Label>
          <Input
            type="text"
            placeholder="Ej. 10009238173"
            {...register("documento", {
              required: "El documento del cliente es obligatorio",
            })}
          />
          {errors.documento && (
            <p className="text-sm text-red-500">{errors.documento.message}</p>
          )}
        </div>

        {/* Foto */}
        <div className="space-y-2">
          <Label>Foto</Label>
          {imagenPrevia && (
            <div className="mb-2 flex flex-col items-start">
              <img
                src={imagenPrevia}
                alt="Foto actual del cliente"
                className="h-24 w-24 object-cover rounded-md border"
              />
              <span className="text-xs text-gray-500 mt-1">Foto actual</span>
            </div>
          )}
          <Input type="file" accept="image/*" {...register("foto")} />
          <p className="text-xs text-gray-500">
            {imagenPrevia
              ? "Deja vacío para mantener la foto actual"
              : "Selecciona una foto para el cliente"}
          </p>
        </div>

        {/* Tipo de Cliente */}
        <div className="space-y-2">
          <Label>Tipo de Cliente *</Label>
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
          {errors.tipoCliente && (
            <p className="text-sm text-red-500">{errors.tipoCliente.message}</p>
          )}
        </div>

        {/* Valera */}
        <div className="space-y-2">
          <Label>Valera *</Label>
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
          {errors.valera && (
            <p className="text-sm text-red-500">{errors.valera.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="mt-4">
        Actualizar Cliente
      </Button>
    </form>
  );
};

export default ClientEditForm;
