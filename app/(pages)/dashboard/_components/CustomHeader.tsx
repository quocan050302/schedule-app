import React from "react";

const CustomHeader = ({ date }: any) => {
  const formattedDate = new Date(date);
  const day = formattedDate.getDate();
  const dayName = formattedDate.toLocaleString("en-US", { weekday: "short" });
  const isToday = formattedDate.toDateString() === new Date().toDateString();

  return (
    <div className="py-3">
      {" "}
      <div>
        <p
          className={`${
            isToday ? "text-teal-700 font-semibold" : ""
          } text-lg font-medium uppercase text-primary`}
        >
          {dayName}
        </p>
        <p
          className={`${
            isToday
              ? "bg-primary m-auto w-max text-white rounded-full py-1 px-4 mt-2"
              : "custom-day-in-month"
          } text-2xl`}
        >
          {day}
        </p>
      </div>
    </div>
  );
};

export default CustomHeader;
