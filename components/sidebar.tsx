"use client";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { LayoutDashboard, Calculator, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils"; // pastikan fungsi util ini tersedia

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    {
      group: "Activity",
      items: [
        {
          href: "/vesselAssessment",
          label: "Vessel Assessment",
          icon: Calculator,
        },
        {
          href: "/vesselDrill",
          label: "Vessel Safety Reports",
          icon: Calculator,
        },
        {
          href: "/assessmentCompare",
          label: "Assessment Comparison",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      group: "Master",
      items: [
        {
          href: "/assessmentCategory",
          label: "Assessment Category",
          icon: Settings,
        },
        {
          href: "/drillCategory",
          label: "Drill Category",
          icon: Settings,
        },
        {
          href: "/shipSection",
          label: "Ship Section",
          icon: Settings,
        },
        {
          href: "/interval",
          label: "Interval",
          icon: Settings,
        },
        {
          href: "/item",
          label: "Item",
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <Command className="bg-secondary rounded-none">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList className="max-h-[400px] overflow-y-auto">
        <CommandEmpty>No results found.</CommandEmpty>

        {menuItems.map((group, index) => (
          <div key={group.group}>
            <CommandGroup heading={group.group}>
              {group.items.map(({ href, label, icon: Icon }) => (
                <CommandItem
                  key={href}
                  asChild
                  className={cn(
                    pathname.startsWith(href) ? "bg-slate-400 text-black" : "",
                    "hover:bg-slate-300 cursor-pointer"
                  )}
                >
                  <Link href={href} className="flex items-center w-full gap-2">
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </Link>
                </CommandItem>
              ))}
            </CommandGroup>
            {index < menuItems.length - 1 && <CommandSeparator />}
          </div>
        ))}
      </CommandList>
    </Command>
  );
};

export default Sidebar;
