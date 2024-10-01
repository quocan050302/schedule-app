"use client";
import {
  LogoutLink,
  useKindeBrowserClient,
} from "@kinde-oss/kinde-auth-nextjs";
import { Briefcase, Calendar, ChevronDown, Clock } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

function DashboardHeader() {
  const { user } = useKindeBrowserClient();
  const menu = [
    {
      id: 1,
      name: "Meeting Type",
      path: "/dashboard/meeting-type",
      icon: Briefcase,
    },
    {
      id: 2,
      name: "Scheduled Meeting",
      path: "/dashboard/scheduled-meeting",
      icon: Calendar,
    },
    {
      id: 3,
      name: "Availability",
      path: "/dashboard/availability",
      icon: Clock,
    },
  ];
  const path = usePathname();
  const [activePath, setActivePath] = useState(path);

  useEffect(() => {
    path && setActivePath(path);
  }, [path]);
  return (
    user && (
      <div className="sticky top-0 left-0 z-[7] bg-white">
        <div className="p-4 pt-[30px] pr-10 pl-4 flex items-center gap-4">
          <div className="flex gap-5">
            {menu.map((item, index) => (
              <Link href={item.path} key={index}>
                <Button
                  variant="ghost"
                  className={`w-full flex gap-2 
                        justify-start
                        hover:bg-blue-100
                        font-normal
                        text-lg
                        ${activePath == item.path && "text-primary bg-blue-100"}
                        `}
                >
                  <item.icon /> {item.name}
                </Button>
              </Link>
            ))}
          </div>
          <div className="flex-1">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center ml-auto">
                <Image
                  src={user?.picture as string}
                  alt="logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <ChevronDown />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem> */}
                {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}

                <DropdownMenuItem>
                  <LogoutLink>Logout</LogoutLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    )
  );
}

export default DashboardHeader;
