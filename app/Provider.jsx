import React from "react";
import Header from "./_components/Header";
import SideNav from "./_components/SideNav";
import { ScrollArea } from "@/components/ui/scroll-area";

const Provider = ({ children }) => {
  return (
    <div>
      <Header />
      <div className="flex gap-5 bg-gray-100">
        <SideNav />
        <ScrollArea className="p-7 w-full h-[calc(100vh-97px)]">
          {children}
        </ScrollArea>
      </div>
    </div>
  );
};

export default Provider;
