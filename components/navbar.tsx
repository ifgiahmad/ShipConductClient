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

const Navbar = () => {
  return (
    <header className="bg-teal-600 p-4">
      <div className="bg-emerald-900 dark:bg-green-900 text-white py-2 px-5 flex justify-between">
        {/*  <Link href="/">
          <Image src={logo} alt="ShipConduct" width={40} />
        </Link> */}
        <div className="flex flex-col items-center bg-white p-1 rounded-md">
          <Image
            src={logo}
            alt="ShipConduct"
            className="h-10 mr-2"
            width={60}
            height={80}
          />
          <div className="text-green-950 font-bold">
            PT. Lintas Maritim Indonesia
          </div>
        </div>
        <div className="flex items-center">
          <ThemeToggler />
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                ></AvatarImage>
                <AvatarFallback className="text-black">BT</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
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
