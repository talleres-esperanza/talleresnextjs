"use client";

import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import GlobalApi from "../_utils/GlobalApi";
import Image from "next/image";

const PersonasList = ({ onPersonasSelect, selectedPersonas }) => {
  const [personas, setPersonas] = React.useState([]);

  useEffect(() => {
    getAprendicesList();
  }, []);

  const getAprendicesList = () => {
    GlobalApi.GetAprendices().then((resp) => {
      setPersonas(resp.clientes || []);
    });
  };

  const handleSelectPersona = (persona, isChecked) => {
    const updatedPersonas = isChecked
      ? [...selectedPersonas, persona]
      : selectedPersonas.filter((p) => p.id !== persona.id);

    onPersonasSelect(updatedPersonas);
  };

  const isSelected = (persona) =>
    selectedPersonas.some((p) => p.id === persona.id);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {personas.map((persona) => {
        const selected = isSelected(persona);

        return (
          <Card
            key={persona.id}
            onClick={() => handleSelectPersona(persona, !selected)}
            className={`p-4 cursor-pointer border-2 transition ${
              selected ? "border-primary" : "border-muted"
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              {/* Prevent checkbox click from bubbling to card */}
              <Checkbox
                id={`persona-${persona.id}`}
                checked={selected}
                onCheckedChange={(checked) =>
                  handleSelectPersona(persona, checked)
                }
                onClick={(e) => e.stopPropagation()}
              />

              <Image
                className="rounded-xl mt-2"
                alt={persona.nombre}
                src={
                  persona?.foto?.url || persona?.url2 || "/placeholder-user.png"
                }
                width={100}
                height={100}
              />

              <label
                htmlFor={`persona-${persona.id}`}
                className="text-center text-lg font-bold pt-2"
              >
                {persona.nombre}
              </label>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default PersonasList;
