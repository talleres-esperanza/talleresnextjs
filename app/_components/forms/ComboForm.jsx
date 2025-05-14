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

const ComboForm = () => {
  const [tipoProductos, setTipoProductos] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const tipoProductoSeleccionado = watch("tipoProducto");

  useEffect(() => {
    getTipoProductos();
  }, []);

  const getTipoProductos = () => {
    GlobalApi.GetTipoProductos().then((resp) => {
      console.log(resp);
      setTipoProductos(resp.tipoProductos || []);
    });
  };

  useEffect(() => {
    if (tipoProductoSeleccionado) {
      const producto = tipoProductos.find(
        (tipo) => tipo.id === tipoProductoSeleccionado
      );
      if (producto) {
        setValue("precio", producto.precio?.toString() || "");
      }
    }
  }, [tipoProductoSeleccionado, tipoProductos, setValue]);

  const registerCombo = async (data) => {
    try {
      const file = data.imagen[0];
      const imageUrl = await uploadImageToCloudinary(
        file,
        process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        "b5twbvqk"
      );

      const result = await GlobalApi.createCombo({
        nombre: data.nombre,
        tipoComboId: data.tipoProducto,
        url2: imageUrl,
      });

      console.log("Combo creado:", result);
    } catch (error) {
      console.error("Error al crear combo:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(registerCombo)}>
      <div className="grid grid-cols-2 gap-5">
        {/* Campo Nombre */}
        <div className="flex flex-col gap-2">
          <Label>Nombre Completo</Label>
          <Input
            type="text"
            placeholder="Ej. Huevo con Tocino"
            {...register("nombre", {
              required: "El nombre del combo es obligatorio",
            })}
          />
          <p className="text-red-600 text-sm">
            {errors.nombre?.message?.toString()}
          </p>
        </div>

        {/* Campo Tipo de Producto */}
        <div className="flex flex-col gap-2">
          <Label>Tipo de Producto</Label>
          <Controller
            name="tipoProducto"
            control={control}
            rules={{ required: "El tipo de producto es obligatorio" }}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona el tipo de producto" />
                </SelectTrigger>
                <SelectContent>
                  {tipoProductos.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <p className="text-red-600 text-sm">
            {errors.tipoProducto?.message?.toString()}
          </p>
        </div>

        {/* Campo Precio (automático) */}
        <div className="flex flex-col gap-2">
          <Label>Precio</Label>
          <Input
            type="text"
            readOnly
            placeholder="Se llenará automáticamente"
            {...register("precio", {
              required: "El precio del combo es obligatorio",
            })}
          />
          <p className="text-red-600 text-sm">
            {errors.precio?.message?.toString()}
          </p>
        </div>

        {/* Campo Imagen */}
        <div className="flex flex-col gap-2">
          <Label>Imagen</Label>
          <Input
            type="file"
            accept="image/*"
            {...register("imagen", {
              required: "La imagen del combo es obligatoria",
            })}
          />
          <p className="text-red-600 text-sm">
            {errors.imagen?.message?.toString()}
          </p>
        </div>
      </div>
      <Button className="mt-4" type="submit">
        Crear Combo
      </Button>
    </form>
  );
};

export default ComboForm;
