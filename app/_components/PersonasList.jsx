"use client";
import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import GlobalApi from "../_utils/GlobalApi";
import Image from "next/image";

const PersonasList = ({ onPersonasSelect, selectedPersonas }) => {
  // Datos de ejemplo - reemplaza con tu API
  const [personas, setPersonas] = React.useState([]);

  useEffect(() => {
    getAprendicesList();
  }, []);

  const getAprendicesList = () => {
    GlobalApi.GetAprendices().then((resp) => {
      console.log(resp);
      setPersonas(resp.clientes || []);
    });
  };

  const handleSelectPersona = (persona, isChecked) => {
    const updatedPersonas = isChecked
      ? [...selectedPersonas, persona]
      : selectedPersonas.filter((p) => p.id !== persona.id);

    onPersonasSelect(updatedPersonas);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {personas.map((persona) => (
        <Card key={persona.id} className="p-4 flex items-center space-x-4">
          <Checkbox
            id={`persona-${persona.id}`}
            checked={selectedPersonas.some((p) => p.id === persona.id)}
            onCheckedChange={(checked) => handleSelectPersona(persona, checked)}
          />

          <div className="flex flex-col items-center">
            <Image className="rounded-xl" alt={persona.nombre} src={persona?.foto?.url || "/placeholder-user.png"} width={500} height={500} />
            <label htmlFor={`persona-${persona.id}`} className="text-lg pt-4 font-bold">
              {persona.nombre}
            </label>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default PersonasList;
