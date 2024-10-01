import React, { useState } from "react";
import { addMinutes, format } from "date-fns";

interface Meeting {
  formatedDate: string;
  duration: number;
  selectedTime: string;
  locationUrl?: string;
  eventName?: string;
  color?: string;
  formatedTimeStamp?: string;
  userName?: string;
  userEmail?: string;
  userNote?: string;
}

interface ScheduledMeetingListProps {
  meetingList: Meeting[];
}

const ScheduledMeetingList: React.FC<ScheduledMeetingListProps> = ({
  meetingList,
}) => {
  const [itemsToShow, setItemsToShow] = useState<number>(10);
  const [modal, setModal] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<Meeting | null>(null);

  const getInitials = (fullName: string) => {
    const nameParts = fullName.trim().split(" ");
    const initials = nameParts
      .filter((part, index) => index === 0 || index === nameParts.length - 1)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
    return initials;
  };

  const getTimeRange = (selectedTime: string, duration: number): string => {
    const parseTimeString = (timeString: string) => {
      const [time, modifier] = timeString.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      if (modifier === "PM" && hours !== 12) {
        hours += 12;
      } else if (modifier === "AM" && hours === 12) {
        hours = 0;
      }

      const date = new Date();
      date.setHours(hours, minutes, 0, 0);

      return date;
    };

    const startTime = parseTimeString(selectedTime);
    const endTime = addMinutes(startTime, duration);

    const formattedStartTime = format(startTime, "hh:mm a");
    const formattedEndTime = format(endTime, "hh:mm a");

    return `${formattedStartTime} to ${formattedEndTime}`;
  };

  const sortedMeetingList = [...meetingList].sort((a, b) => {
    return Number(a.formatedTimeStamp) - Number(b.formatedTimeStamp);
  });

  const loadMoreItems = () => {
    setItemsToShow((prev) => prev + 10);
  };

  const handleViewProfileClick = (meeting: Meeting) => {
    setSelectedClient(meeting);
    setModal(true);
    document.body.classList.add("overflow-hidden");
  };

  const closeModal = () => {
    setModal(false);
    setSelectedClient(null);
    document.body.classList.remove("overflow-hidden");
  };

  return (
    <div className="p-4 ">
      <div className="flex flex-col grid-cols-9 p-2 mx-auto md:grid">
        {sortedMeetingList.slice(0, itemsToShow).map((meeting, index) => (
          <React.Fragment key={index}>
            {index % 2 === 0 ? (
              <div className="flex md:contents flex-row-reverse">
                <div
                  style={{
                    borderLeftColor: meeting?.color,
                  }}
                  className="w-[308px] border-l-8 relative p-4 my-6 text-gray-800 bg-white rounded-xl col-start-1 col-end-5 mr-auto md:mr-0 md:ml-auto"
                >
                  <h3 className="text-lg font-semibold lg:text-xl">
                    {meeting?.eventName}
                  </h3>
                  <p className="mt-2 leading-6">
                    {getTimeRange(meeting?.selectedTime, meeting?.duration)}
                  </p>
                  <span className="absolute text-sm text-darkBlue -top-7 left-2 whitespace-nowrap">
                    {meeting.formatedDate}
                  </span>
                  <div
                    onClick={() => handleViewProfileClick(meeting)}
                    className="flex items-center gap-4 mt-4 cursor-pointer"
                  >
                    <span
                      style={{
                        background: meeting?.color,
                      }}
                      className="text-center w-10 h-10 flex items-center justify-center text-[18px] text-white rounded-full "
                    >
                      {getInitials(meeting?.userName as string)}
                    </span>
                    <span className="text-[16px] cursor-pointer text-blue-700 underline">
                      View client profile
                    </span>
                  </div>
                </div>
                <div className="relative col-start-5 col-end-6 mr-7 md:mx-auto">
                  <div className="flex items-center justify-center w-6 h-full">
                    <div className="w-1 h-full bg-indigo-300 rounded-t-full bg-gradient-to-b from-indigo-400 to-indigo-300"></div>
                  </div>
                  <div className="absolute w-6 h-6 -mt-3 bg-white border-4 border-indigo-400 rounded-full top-1/2"></div>
                </div>
              </div>
            ) : (
              <div className="flex md:contents">
                <div className="relative col-start-5 col-end-6 mr-7 md:mx-auto">
                  <div className="flex items-center justify-center w-6 h-full">
                    <div className="w-1 h-full bg-indigo-300"></div>
                  </div>
                  <div className="absolute w-6 h-6 -mt-3 bg-white border-4 border-indigo-400 rounded-full top-1/2"></div>
                </div>
                <div
                  style={{
                    borderLeftColor: meeting?.color,
                  }}
                  className="w-[308px] border-l-8 relative p-4 my-6 text-gray-800 bg-white rounded-xl col-start-6 col-end-10 mr-auto"
                >
                  <h3 className="text-lg font-semibold lg:text-xl">
                    {meeting?.eventName}
                  </h3>
                  <p className="mt-2 leading-6">
                    {getTimeRange(meeting?.selectedTime, meeting?.duration)}
                  </p>
                  <span className="absolute text-sm text-darkBlue -top-7 left-2 whitespace-nowrap">
                    {meeting.formatedDate}
                  </span>
                  <div
                    onClick={() => handleViewProfileClick(meeting)}
                    className="flex items-center gap-4 mt-4 cursor-pointer"
                  >
                    <span
                      style={{
                        background: meeting?.color,
                      }}
                      className="text-center w-10 h-10 flex items-center justify-center text-[18px] text-white rounded-full "
                    >
                      {getInitials(meeting?.userName as string)}
                    </span>
                    <span className="text-[16px] cursor-pointer text-blue-700 underline">
                      View client profile
                    </span>
                  </div>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      {itemsToShow < sortedMeetingList.length && (
        <div className="flex justify-center mt-4">
          <button
            onClick={loadMoreItems}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Load More
          </button>
        </div>
      )}
      {modal && selectedClient && (
        <div>
          <div className="fixed  top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white z-[101] p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Client Profile</h2>
              <button
                className="py-1 px-[10px] bg-red-500 text-white rounded hover:bg-red-600"
                onClick={closeModal}
              >
                X
              </button>
            </div>
            <div className="text-center my-4">
              <div
                style={{
                  background: selectedClient?.color,
                }}
                className="h-32 w-32 text-[32px] font-semibold flex items-center justify-center text-white bg-[#F9BE81] rounded-full border-4 border-white dark:border-gray-800 mx-auto my-4"
              >
                {getInitials(selectedClient?.userName as string)}
              </div>
              <div className="py-2 flex flex-col">
                <h3 className="font-bold text-2xl text-gray-800 text-center mb-4">
                  {selectedClient?.userName}
                </h3>
                <div className="flex justify-start items-start flex-col gap-2 bg-[#eaeffb]/50 p-3 rounded-sm">
                  <div className="text-[20px] pb-2 border-b border-b-gray-200 flex items-center justify-between w-full gap-2 font-medium text-gray-700 ">
                    <span>Email</span>
                    <span className="text-right">
                      {selectedClient?.userEmail}
                    </span>
                  </div>
                  <div className="text-[20px] flex items-center justify-between w-full gap-2 font-medium text-gray-700 ">
                    <span>Note</span>
                    <span className="text-right">
                      {selectedClient?.userNote}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            onClick={closeModal}
            className="fixed z-[100] inset-0 flex items-center justify-center bg-black bg-opacity-50"
          ></div>
        </div>
      )}
    </div>
  );
};

export default ScheduledMeetingList;
