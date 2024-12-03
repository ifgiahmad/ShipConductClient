"use client";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Calculator,
  Ship,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <Command className="bg-secondary rounded-none">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Activity">
          <CommandItem
            className={`${
              pathname.includes("/vesselAssessment") ? "bg-slate-400" : ""
            } hover:bg-slate-400`}
          >
            <Calculator className="mr-2 h-4 w-4" />
            <Link href="/vesselAssessment">Vessel Assessment</Link>
          </CommandItem>

          <CommandItem
            className={`${
              pathname.includes("/vesselDrill") ? "bg-slate-400" : ""
            } hover:bg-slate-400`}
          >
            <Calculator className="mr-2 h-4 w-4" />
            <Link href="/vesselDrill">Vessel Drill</Link>
          </CommandItem>

          <CommandItem
            className={`${
              pathname.includes("/assessmentCompare") ? "bg-slate-400" : ""
            } hover:bg-slate-400`}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <Link href="/assessmentCompare">Assessment Comparison</Link>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Master">
          <CommandItem
            className={`${
              pathname.includes("/assessmentCategory") ? "bg-slate-400" : ""
            } hover:bg-slate-400`}
          >
            <Settings className="mr-2 h-4 w-4" />
            <Link href="/assessmentCategory">Assessment Category</Link>
          </CommandItem>
          <CommandItem
            className={`${
              pathname.includes("/drillCategory") ? "bg-slate-400" : ""
            } hover:bg-slate-400`}
          >
            <Settings className="mr-2 h-4 w-4" />
            <Link href="/drillCategory">Drill Category</Link>
          </CommandItem>

          <CommandItem
            className={`${
              pathname.includes("/shipSection") ? "bg-slate-400" : ""
            } hover:bg-slate-400`}
          >
            <Settings className="mr-2 h-4 w-4" />
            <Link href="/shipSection">Ship Section</Link>
          </CommandItem>

          <CommandItem
            className={`${
              pathname.includes("/interval") ? "bg-slate-400" : ""
            } hover:bg-slate-400`}
          >
            <Settings className="mr-2 h-4 w-4" />
            <Link href="/interval">Interval</Link>
          </CommandItem>

          <CommandItem
            className={`${
              pathname.includes("/item") ? "bg-slate-400" : ""
            } hover:bg-slate-400`}
          >
            <Settings className="mr-2 h-4 w-4" />
            <Link href="/item">Item</Link>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
};

export default Sidebar;
