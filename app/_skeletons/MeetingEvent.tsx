import React from "react";

const MeetingEvent = () => {
  return (
    <div className="flex flex-wrap">
      <div
        role="status"
        className="w-full border border-gray-300 rounded-lg p-4"
      >
        <div className="animate-pulse w-full bg-gray-300 h-20 rounded-lg mb-5 flex justify-center items-center"></div>
        <div className=" w-full flex justify-between items-start animate-pulse">
          <div className="block">
            <h3 className="h-3 bg-gray-300 rounded-full  w-48 mb-4"></h3>
            <p className="h-2 bg-gray-300 rounded-full w-32 mb-2.5"></p>
          </div>
          <span className="h-2 bg-gray-300 rounded-full w-16 "></span>
        </div>
      </div>
    </div>
  );
};

export default MeetingEvent;
