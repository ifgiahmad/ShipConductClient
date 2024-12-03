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
    <header className="bg-teal-600 p-4">
      <div className="bg-emerald-900 dark:bg-green-900 text-white py-2 px-5 flex justify-between">
        {/*  <Link href="/">
          <Image src={logo} alt="ShipConduct" width={40} />
        </Link> */}
        <div className="flex flex-col items-center bg-white p-1 rounded-md justify-center">
          <Image
            src={logo}
            alt="ShipConduct"
            className="h-10 mr-2"
            width={60}
            height={80}
          />
          <div className="text-green-950 font-bold text-center">
            {" "}
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
