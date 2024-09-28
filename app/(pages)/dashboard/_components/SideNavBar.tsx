"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Briefcase, Clock, Plus, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import MeetingItem from "./MeetingItem";
import { format } from "date-fns";

function SideNavBar() {
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
    {
      id: 4,
      name: "Settings",
      path: "/dashboard/settings",
      icon: Settings,
    },
  ];

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const [date, setDate] = useState<Date | undefined>(() => {
    const storedDate = localStorage.getItem("selectedDate");
    return storedDate ? new Date(storedDate) : new Date(); // Default to current date if not set
  });

  const path = usePathname();
  const [activePath, setActivePath] = useState(path);

  const formattedDate = date
    ? format(date, "eeee, d MMMM")
    : "No Date Selected";

  useEffect(() => {
    path && setActivePath(path);
  }, [path]);

  // Save the selected date to localStorage whenever it changes
  useEffect(() => {
    if (date) {
      localStorage.setItem("selectedDate", date.toISOString());
    }
  }, [date]);

  return (
    <div className="p-5 py-14">
      <div className="flex">
        <div>
          <Link
            href="/dashboard"
            className="text-4xl no-underline text-blue-700 font-sans font-bold max-[430px]:text-[20px]"
          >
            Byte<span className="text-green-800">Webster</span>
          </Link>
        </div>
      </div>

      <Link href={"/create-meeting"}>
        <Button className="flex gap-2 w-full mt-4 rounded-full">
          <Plus /> Create New Event
        </Button>
      </Link>
      <div className="mt-4 shadow-lg">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          disabled={isDateDisabled}
        />
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <div className="block text-2xl font-bold text-darkBlue">
            Upcoming Event
          </div>
          <Link
            href="/dashboard/scheduled-meeting"
            className="py-1 px-2 block cursor-pointer rounded-sm text-sm bg-darkBlue text-white transition-all duration-300 hover:bg-darkBlue/80"
          >
            View All
          </Link>
        </div>
        <div className="text-base text-primary/90 font-medium mt-2">
          {formattedDate}
        </div>
      </div>

      <div className="mt-4">
        <MeetingItem selectedDate={date}></MeetingItem>
      </div>
    </div>
  );
}

export default SideNavBar;
