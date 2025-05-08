import Image from "next/image";
import Link from "next/link";
import logo from "../img/logo.png";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ThemeToggler from "./ThemeToggler";
import { logout } from "@/services/auth";

const NavbarCrew = () => {
  return (
    <header className="bg-teal-600 p-2">
      <div className="bg-emerald-900 dark:bg-green-900 text-white py-1 px-3 flex justify-between items-center">
        <div className="flex flex-col items-center bg-white p-1 rounded-md">
          <Image
            src={logo}
            alt="ShipConduct"
            className="h-8 w-auto mb-1"
            width={40}
            height={40}
          />
          <div className="text-green-950 font-semibold text-xs text-center leading-tight">
            PT. Lintas Maritim Indonesia
          </div>
        </div>

        <div className="flex items-center">
          <ThemeToggler />
        </div>
      </div>
    </header>
  );
};

export default NavbarCrew;
