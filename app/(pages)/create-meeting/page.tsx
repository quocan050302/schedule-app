"use client";
import React, { useState } from "react";
import MeetingForm from "./_components/MeetingForm";
import PreviewMeeting from "./_components/PreviewMeeting";

function CreateMeeting() {
  const [formValue, setFormValue] = useState<any>();
  return (
    <div className="grid grid-cols-1 md:grid-cols-3">
      <div className="shadow-md border h-screen">
        <MeetingForm setFormValue={(v) => setFormValue(v as any)} />
      </div>
      <div className="md:col-span-2">
        <PreviewMeeting formValue={formValue} />
      </div>
    </div>
  );
}

export default CreateMeeting;
