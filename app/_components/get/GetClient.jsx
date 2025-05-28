import GlobalApi from "@/app/_utils/GlobalApi";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const GetClient = ({ id }) => {
  const [cliente, setCliente] = useState({});
  const [open, setOpen] = useState(false);

  const fetchCliente = () => {
    GlobalApi.GetCliente(id).then((resp) => {
      console.log(resp);
      setCliente(resp || {});
    });
  };

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (isOpen) {
      fetchCliente();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <Eye className="mr-2 h-4 w-4" />
          Ver Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Ver Cliente</DialogTitle>
          <DialogDescription>
            Mira toda la información del cliente.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center gap-10">
          <Image
            src={
              cliente?.cliente?.foto?.url ||
              cliente?.cliente?.url2 ||
              "/placeholder-user.png"
            }
            width={150}
            height={150}
            alt="Foto Cliente"
            className="rounded-full"
          />
          <div className="flex flex-col gap-4">
            <p className="text-md">
              <span className="font-bold">Nombre:</span>{" "}
              {cliente?.cliente?.nombre}{" "}
            </p>
            <p className="text-md">
              <span className="font-bold">Documento:</span>{" "}
              {cliente?.cliente?.documento}{" "}
            </p>
            <p className="text-md">
              <span className="font-bold">Tiene Valera:</span>{" "}
              {cliente?.cliente?.tieneValera}{" "}
            </p>
            {cliente?.cliente?.tieneValera == "si" && (
              <p className="text-md">
                <span className="font-bold">Cantidad Valera</span>{" "}
                {cliente?.cliente?.cantidadValera}/20
              </p>
            )}
            <p className="text-md">
              <span className="font-bold">Tipo Cliente:</span>{" "}
              {cliente?.cliente?.tipoCliente?.nombre}{" "}
            </p>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GetClient;
