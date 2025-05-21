import GlobalApi from "@/app/_utils/GlobalApi";
import { uploadImageToCloudinary } from "@/app/_utils/upload";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const ComboEditForm = ({ comboExistente }) => {
  const [tipoProductos, setTipoProductos] = useState([]);
  const [imagenPrevia, setImagenPrevia] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const tipoProductoSeleccionado = watch("tipoProducto");

  useEffect(() => {
    getTipoProductos();

    if (comboExistente) {
      setValue("nombre", comboExistente.nombre || "");
      setValue("tipoProducto", comboExistente.tipoProducto?.id || "");
      setValue("precio", comboExistente.tipoProducto?.precio?.toString() || "");
      setImagenPrevia(comboExistente.url2);
    }
  }, [comboExistente]);

  const getTipoProductos = () => {
    GlobalApi.GetTipoProductos()
      .then((resp) => {
        setTipoProductos(resp.tipoProductos || []);
      })
      .catch((error) => {
        console.error("Error al obtener tipos de producto:", error);
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

  const actualizarCombo = async (data) => {
    setIsLoading(true);
    try {
      let imageUrl = imagenPrevia;

      if (data.imagen && data.imagen[0]) {
        imageUrl = await uploadImageToCloudinary(
          data.imagen[0],
          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          "b5twbvqk"
        );
      }

      const datosActualizados = {
        id: comboExistente.id,
        nombre: data.nombre,
        idTipoProducto: data.tipoProducto,
        url2: imageUrl || "",
      };

      await GlobalApi.updateCombo(datosActualizados);
      console.log("Combo actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar combo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(actualizarCombo)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Campo Nombre */}
        <div className="space-y-2">
          <Label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
            Nombre del Combo *
          </Label>
          <input
            id="nombre"
            type="text"
            placeholder="Ej. Huevo con Tocino"
            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border ${
              errors.nombre ? "border-red-500" : ""
            }`}
            {...register("nombre", { required: "Este campo es obligatorio" })}
            disabled={isLoading}
          />
          {errors.nombre && (
            <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>
          )}
        </div>

        {/* Campo Tipo de Producto */}
        <div className="space-y-2">
          <Label htmlFor="tipoProducto" className="block text-sm font-medium text-gray-700">
            Tipo de Producto *
          </Label>
          <select
            id="tipoProducto"
            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border ${
              errors.tipoProducto ? "border-red-500" : ""
            }`}
            {...register("tipoProducto", { required: "Este campo es obligatorio" })}
            disabled={isLoading}
          >
            <option value="">Selecciona un tipo</option>
            {tipoProductos.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </select>
          {errors.tipoProducto && (
            <p className="mt-1 text-sm text-red-600">{errors.tipoProducto.message}</p>
          )}
        </div>

        {/* Campo Precio */}
        <div className="space-y-2">
          <Label htmlFor="precio" className="block text-sm font-medium text-gray-700">
            Precio *
          </Label>
          <input
            id="precio"
            type="text"
            readOnly
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border bg-gray-100"
            {...register("precio", { required: "Este campo es obligatorio" })}
          />
          {errors.precio && (
            <p className="mt-1 text-sm text-red-600">{errors.precio.message}</p>
          )}
        </div>

        {/* Campo Imagen */}
        <div className="space-y-2">
          <Label htmlFor="imagen" className="block text-sm font-medium text-gray-700">
            Imagen
          </Label>
          {imagenPrevia && (
            <div className="mb-3 flex flex-col items-start">
              <img
                src={imagenPrevia}
                alt="Imagen actual del combo"
                className="h-24 w-24 object-cover rounded-md border"
              />
              <span className="text-xs text-gray-500 mt-1">Imagen actual</span>
            </div>
          )}
          <input
            id="imagen"
            type="file"
            accept="image/*"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            {...register("imagen")}
            disabled={isLoading}
          />
          <p className="mt-1 text-xs text-gray-500">
            {imagenPrevia
              ? "Deja vacío para mantener la imagen actual"
              : "Selecciona una imagen para el combo"}
          </p>
        </div>
      </div>

      <Button
        type="submit"
        className={`w-full md:w-auto px-6 py-2 rounded-md text-white font-medium ${
          isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
        } transition-colors`}
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Guardando...
          </span>
        ) : (
          "Guardar Cambios"
        )}
      </Button>
    </form>
  );
};

export default ComboEditForm;