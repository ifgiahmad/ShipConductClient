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

const Navbar = () => {
  return (
    <header className="bg-teal-600">
      <div className="bg-emerald-900 dark:bg-green-900 text-white px-6 py-3 flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center space-x-3 bg-white p-2 rounded-md">
          <Image
            src={logo}
            alt="ShipConduct"
            width={50}
            height={50}
            className="object-contain"
          />
          <span className="text-green-950 font-bold text-sm sm:text-base lg:text-lg leading-tight">
            PT. Lintas Maritim Indonesia
          </span>
        </div>

        {/* Right Section: Theme Toggle & User Dropdown */}
        <div className="flex items-center space-x-4">
          <ThemeToggler />
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <Avatar>
                <AvatarImage src="" alt="@shadcn" />
                <AvatarFallback className="text-black">BT</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/auth?logout=true">Logout</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
