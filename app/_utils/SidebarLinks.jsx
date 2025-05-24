import { Apple, Briefcase, Calendar, Component, CreditCard, DollarSign, DollarSignIcon, icons, LayoutDashboard, Plus, PlusIcon } from "lucide-react";

export const SidebarLinks = [
  {
    id: 1,
    name: "Clientes",
    link: "/talleres/aprendices",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },

  {
    id: 2,
    name: "Generar Pedidos",
    link: "/talleres/generar-pedidos",
    icon: <Plus className="w-5 h-5" />,
  },
  {
    id: 3,
    name: "Pedidos",
    link: "/talleres/pedidos",
    icon: <Apple className="w-5 h-5" />,
  },

  {
    id: 4,
    name: "Combos",
    link: "/talleres/combos",
    icon: <Component className="w-5 h-5" />,
  },
  {
    id: 5,
    name: "Precios",
    link: "/talleres/precios",
    icon: <DollarSignIcon className="w-5 h-5" />,
  },
  {
    id: 6,
    name: "Pagos",
    link: "/talleres/pagos",
    icon: <CreditCard className="w-5 h-5" />,
  },
];

export const SidebarLinksUser = [
    {
        id: 1,
        name: "Eventos",
        link: "/user/eventos",
        icon: <LayoutDashboard className="w-5 h-5" />
    },
]