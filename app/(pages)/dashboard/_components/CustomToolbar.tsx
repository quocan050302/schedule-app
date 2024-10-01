import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";

const CustomToolbar = ({ calendarRef }: any) => {
  const [titleTime, setTitleTime] = useState<string | null>(
    calendarRef?.current?.getApi().view.title
  );
  const [selectedView, setSelectedView] = useState("dayGridMonth");

  useEffect(() => {
    if (calendarRef?.current) {
      const calendarApi = calendarRef.current.getApi();
      setTitleTime(calendarApi.view.title);
    }
  }, [calendarRef]);

  const handleListViewClick = (viewType: string) => {
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(viewType);
      setTitleTime(calendarRef.current.getApi().view.title);
    }
  };

  const handleNavigationClick = (action: string) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      switch (action) {
        case "prev":
          calendarApi.prev();
          break;
        case "next":
          calendarApi.next();
          break;
        case "today":
          calendarApi.today();
          break;
        default:
          break;
      }
      setTitleTime(calendarApi.view.title);
    }
  };

  const handleViewChange = (newView: string) => {
    console.log(newView);
    setSelectedView(newView);
    handleListViewClick(newView);
  };

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 flex-wrap justify-between">
        <div className="flex items-center gap-4">
          <div
            onClick={() => {
              handleNavigationClick("today");
            }}
            className="py-2 px-3 cursor-pointer leading-[1] text-[14px] border border-primary text-primary w-max rounded-lg"
          >
            Today
          </div>
          <div className="flex items-center gap-2 text-primary">
            <ChevronLeft
              className="cursor-pointer"
              onClick={() => {
                handleNavigationClick("prev");
              }}
            />
            <ChevronRight
              className="cursor-pointer"
              onClick={() => {
                handleNavigationClick("next");
              }}
            />
          </div>
          <div className="text-[26px] text-darkBlue font-semibold">
            {titleTime}
          </div>
        </div>
        <div>
          <Select value={selectedView} onValueChange={handleViewChange}>
            <SelectTrigger className="w-[100px] bg-primary text-white transition-all duration-300 ease-in-out hover:bg-primary/80">
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dayGridMonth">Month</SelectItem>
              <SelectItem value="listDay">Day</SelectItem>
              <SelectItem value="listWeek">Week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default CustomToolbar;


