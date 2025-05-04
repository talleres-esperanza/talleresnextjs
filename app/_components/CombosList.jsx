import React from "react";
import ComboCard from "./generic/ComboCard";

const CombosList = ({ combosList, onComboSelect, selectedCombo }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {combosList.productos.map((combo, index) => (
        <ComboCard 
          key={combo.id || index} 
          combo={combo}
          isSelected={selectedCombo?.id === combo.id}
          onClick={() => onComboSelect(combo)}
        />
      ))}
    </div>
  );
};

export default CombosList;