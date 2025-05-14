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
import { Eye, Pen } from "lucide-react";
import React, { useState } from "react";
import ClientForm from "../forms/ClientForm";
import GlobalApi from "@/app/_utils/GlobalApi";
import ClientEditForm from "../forms/ClientEditForm";

const EditClient = ({id}) => {
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
          <Pen />
          Editar Cliente
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ver Cliente</DialogTitle>
          <DialogDescription>
            Completa todos los datos para la creacion del Cliente
          </DialogDescription>
        </DialogHeader>
        <ClientEditForm initialData={cliente.cliente}  />
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button className="bg-green-400">Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditClient;
