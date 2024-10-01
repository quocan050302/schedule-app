import { EventContentArg } from "@fullcalendar/core/index.js";
import React from "react";

type CustomContentProps = {
  eventInfo: EventContentArg;
  calendar: any;
};

const CustomContent = ({ eventInfo, calendar }: CustomContentProps) => {
  return (
    <div
      style={{
        borderLeftColor: eventInfo?.event?.extendedProps?.theme,
        backgroundColor: `${eventInfo?.event?.extendedProps?.theme}33`,
      }}
      className="border-l-4 py-[6px] pl-[6px] cursor-pointer rounded-[4px]"
    >
      <div className="text-darkBlue line-clamp-1 font-semibold">
        {eventInfo?.event?.title}
      </div>
    </div>
  );
};

export default CustomContent;
