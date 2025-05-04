import GlobalApi from "@/app/_utils/GlobalApi";
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

const ClientForm = () => {
  const [tipoClientes, setTipoClientes] = useState([]);

  useEffect(() => {
    getTipoClientes();
  }, []);

  const getTipoClientes = () => {
    GlobalApi.GetTipoClientes().then((resp) => {
      setTipoClientes(resp.tipoClientes || []);
    });
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const registerClient = async (data) => {
    try {
  
      const result = await GlobalApi.createClient({
        nombre: data.nombre,
        tipoClienteId: data.tipoCliente,
        documento: data.documento,
        valera: data.valera,
      });
  
      console.log("Cliente creado:", result);
    } catch (error) {
      console.error("Error al crear cliente:", error);
    }
  };
  

  return (
    <form onSubmit={handleSubmit(registerClient)}>
      <div className="grid grid-cols-2 gap-5">
        {/* Campo Nombre */}
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

        {/* Campo Documento */}
        <div className="flex flex-col gap-2">
          <Label>Documento</Label>
          <Input
            type="text" // Cambiado a text para documentos con letras
            placeholder="Ej. 10009238173"
            {...register("documento", {
              required: "El documento del cliente es obligatorio",
            })}
          />
          <p className="text-red-600 text-sm">
            {errors.documento?.message?.toString()}
          </p>
        </div>

        {/* Campo Foto */}
        <div className="flex flex-col gap-2">
          <Label>Foto</Label>
          <Input
            type="file"
            accept="image/*"
            {...register("foto", {
              required: "La foto del cliente es obligatoria",
            })}
          />
          <p className="text-red-600 text-sm">
            {errors.foto?.message?.toString()}
          </p>
        </div>

        {/* Campo Tipo de Cliente */}
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
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona el tipo de cliente" />
                </SelectTrigger>
                <SelectContent>
                  {tipoClientes.map((tipo) => (
                    <SelectItem key={tipo.id} value={tipo.id}>
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

        {/* Campo Valera */}
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
        Crear Cliente
      </Button>
    </form>
  );
};

export default ClientForm;