import { Card } from '@/components/ui/card'
import Image from 'next/image'
import React from 'react'

const ComboCard = ({ combo, isSelected, onClick }) => {
  return (
    <Card 
      className={`py-0 rounded-2xl overflow-hidden cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-primary shadow-lg' : ''
      }`}
      onClick={onClick}
    >
      <div className="relative aspect-square">
        <Image 
          src={combo?.imagen?.url || combo.url2} 
          alt={combo.nombre}
          fill
          className="object-cover rounded-t-2xl"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-2">
        <h2 className="text-xl text-center font-semibold">{combo.nombre}</h2>
      </div>
    </Card>
  )
}

export default ComboCard