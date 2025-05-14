"use client";
import React, { useEffect, useState } from "react";
import GlobalApi from "@/app/_utils/GlobalApi";
import CombosList from "@/app/_components/CombosList";
import { Button } from "@/components/ui/button";
import PersonasList from "@/app/_components/PersonasList";

const GenerarPedidosPage = () => {
  const [productos, setProductos] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [selectedPersonas, setSelectedPersonas] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const resp = await GlobalApi.getProductos();
        setProductos(resp);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  const handleComboSelect = (combo) => {
    setSelectedCombo(combo);
    setActiveStep(1); // Avanzar al siguiente paso
  };

  const handlePersonasSelect = (personas) => {
    setSelectedPersonas(personas);
  };
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleSubmit = async () => {
    console.log("Pedido enviado:", {
      combo: selectedCombo,
      personas: selectedPersonas,
    });

    for (const persona of selectedPersonas) {
      const pedido = {
        persona,
        combo: selectedCombo,
        fecha: new Date().toISOString(),
      };

      try {
        await GlobalApi.createPedido(pedido);
        await delay(500); // Espera 500ms entre cada publicación
      } catch (error) {
        console.error("Error al crear pedido:", error);
      }
    }

    // Reset
    setActiveStep(0);
    setSelectedCombo(null);
    setSelectedPersonas([]);
  };

  const steps = [
    {
      title: "Seleccionar Combo",
      content: (
        <div>
          <h2 className="text-2xl mb-4 font-bold">Selecciona un combo</h2>
          {loading ? (
            <p>Cargando productos...</p>
          ) : productos.productos?.length > 0 ? (
            <CombosList
              combosList={productos}
              onComboSelect={handleComboSelect}
              selectedCombo={selectedCombo}
            />
          ) : (
            <p>No hay productos disponibles</p>
          )}
        </div>
      ),
    },
    {
      title: "Seleccionar Aprendices",
      content: (
        <div>
          <h2 className="text-2xl mb-4 font-bold">Selecciona las personas</h2>
          <PersonasList
            onPersonasSelect={handlePersonasSelect}
            selectedPersonas={selectedPersonas}
          />
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={() => setActiveStep(0)}>
              Volver
            </Button>
            <Button onClick={handleSubmit}>Confirmar Pedido</Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl mb-8 font-bold">Generar Nuevo Pedido</h1>

      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div
                className={`flex flex-col items-center ${
                  index < activeStep ? "text-primary" : "text-gray-500"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center 
                  ${
                    index < activeStep ? "bg-primary text-white" : "bg-gray-200"
                  }`}
                >
                  {index < activeStep ? "✓" : ""}
                </div>
                <span className="mt-2 text-sm">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 border-t-2 mx-4 border-gray-300"></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Contenido del paso actual */}
      <div className="bg-white p-6 rounded-lg shadow">
        {steps[activeStep].content}
      </div>
    </div>
  );
};

export default GenerarPedidosPage;
