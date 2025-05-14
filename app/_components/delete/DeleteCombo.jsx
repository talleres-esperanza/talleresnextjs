"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DeleteIcon } from "lucide-react";
import GlobalApi from "@/app/_utils/GlobalApi";
import { useRouter } from "next/navigation";

const DeleteCombo = ({ id, onDeleteSuccess }) => {
  const [cliente, setCliente] = useState({});
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const fetchCliente = async () => {
    try {
      const response = await GlobalApi.GetCliente(id);
      setCliente(response?.cliente || {});
    } catch (error) {
      console.error("Error al obtener cliente:", error);
    }
  };

  const handleOpenChange = async (isOpen) => {
    setOpen(isOpen);
    if (isOpen) {
      await fetchCliente();
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await GlobalApi.DeleteCombo(id);
      onDeleteSuccess?.(); // Callback opcional después de eliminar
      router.refresh(); // Refrescar la página
    } catch (error) {
      console.error("Error al eliminar el cliente:", error);
    } finally {
      setIsDeleting(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <DeleteIcon className="text-white mr-2 h-4 w-4" />
          Eliminar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar eliminación</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de eliminar al combo{" "}
            <strong>{cliente.nombre}</strong>? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              "Eliminando..."
            ) : (
              <>
                <DeleteIcon className="mr-2 h-4 w-4" />
                Confirmar
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCombo;
