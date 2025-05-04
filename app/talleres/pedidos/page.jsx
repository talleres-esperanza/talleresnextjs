"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { DatePicker } from "@/app/_components/generic/DatePicker";
import { Button } from "@/components/ui/button";
import GlobalApi from "@/app/_utils/GlobalApi";

import {
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

import { format } from "date-fns";

const getColumns = () => [
  {
    accessorKey: "aprendice.foto.url",
    header: "Foto del Aprendiz",
    cell: ({ row }) => {
      const url = row.original.aprendice?.foto?.url || "/placeholder-user.png";
      return (
        <div className="w-12 h-12 rounded-full overflow-hidden">
          <Image
            src={url}
            width={48}
            height={48}
            alt="Foto"
            className="object-cover"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "aprendice.nombre",
    header: "Nombre del Aprendiz",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.aprendice?.nombre}</div>
    ),
  },
  {
    accessorKey: "producto.imagen.url",
    header: "Imagen del Producto",
    cell: ({ row }) => {
      const url =
        row.original.producto?.imagen?.url || "/placeholder-product.png";
      return (
        <div className="w-12 h-12 rounded overflow-hidden">
          <Image
            src={url}
            width={48}
            height={48}
            alt="Producto"
            className="object-cover"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "producto.nombre",
    header: "Nombre del Producto",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.producto?.nombre}</div>
    ),
  },
];

const PedidosPage = () => {
  const [pedidos, setPedidosList] = useState([]);

  useEffect(() => {
    getPedidosList();
  }, []);

  const getPedidosList = () => {
    const today = format(new Date(), "yyyy-MM-dd");

    GlobalApi.GetPedidos(today).then((resp) => {
      console.log(resp);
      setPedidosList(resp.pedidos);
    });
  };

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fecha: null,
    },
  });

  const onSubmit = (data) => {
    console.log("Fecha seleccionada:", data.fecha);
  };

  const table = useReactTable({
    data: pedidos,
    columns: getColumns(),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <h1 className="text-3xl mb-5 font-bold">Pedidos</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center gap-5"
      >
        <Controller
          name="fecha"
          control={control}
          rules={{ required: "La fecha es obligatoria" }}
          render={({ field }) => (
            <DatePicker date={field.value} onChange={field.onChange} />
          )}
        />
        {errors.fecha && (
          <p className="text-red-500 text-sm">{errors.fecha.message}</p>
        )}

        <Button type="submit">Enviar</Button>
      </form>

      <div className="w-full mt-4">
        <h2 className="text-xl font-semibold mb-4">Lista de Pedidos</h2>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={getColumns().length}
                    className="text-center h-24"
                  >
                    No hay pedidos registrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default PedidosPage;
