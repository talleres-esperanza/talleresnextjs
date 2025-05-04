import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { BellDot, MessageCircle, Search } from "lucide-react";
import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <div className="w-full border-b p-7 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Image alt='Logo' src={"/talleres.avif"} width={50} height={50} />
        <h2 className="text-3xl font-bold">Refrigerios</h2>
      </div>

      <div className="flex items-center gap-5">
        <div className="bg-slate-100 px-5 py-2 hidden md:flex items-center justify-center rounded-md ">
          <input
            className="bg-slate-100 text-sm focus:outline-none  "
            placeholder="Search"
          ></input>
          <Search className="text-gray-400" />
        </div>
        <Button className="bg-green-500/20 hover:bg-green-500/20 hidden md:flex">
          <BellDot className="text-primary " />
        </Button>

        <Button className="bg-green-500/20 hover:bg-green-500/20 hidden md:flex">
          <MessageCircle className="text-primary" />
        </Button>

        <UserButton />
      </div>
    </div>
  );
};

export default Header;
