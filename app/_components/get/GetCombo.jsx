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

const GetCombo = ({ id }) => {
  const [combo, setCombo] = useState({});
  const [open, setOpen] = useState(false);

  const fetchCombo = () => {
    GlobalApi.GetCombo(id).then((resp) => {
      console.log(resp);
      setCombo(resp || {});
    });
  };

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (isOpen) {
        fetchCombo();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild><Button variant={"outline"}>
        <Eye />
        Ver Combo
        </Button></DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Ver Combo</DialogTitle>
          <DialogDescription>
            Mira toda la información del Combo.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center gap-10">
          <Image
            src={
              combo?.producto?.imagen?.url ||
              combo?.producto?.url2 ||
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
              {combo?.producto?.nombre}{" "}
            </p>

            <p className="text-md">
              <span className="font-bold">Tipo Producto:</span>{" "}
              {combo?.producto?.tipoProducto?.nombre}{" "}
            </p>
            <p className="text-md">
              <span className="font-bold">Precio:</span>{" "}
              {combo?.producto?.tipoProducto?.precio}{" "}
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

export default GetCombo;
