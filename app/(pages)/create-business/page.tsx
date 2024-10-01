"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { app } from "@/config/FirebaseConfig";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { SetStateAction, useState } from "react";
import { toast } from "sonner";

type Day =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

const DaysList: { day: Day }[] = [
  { day: "Sunday" },
  { day: "Monday" },
  { day: "Tuesday" },
  { day: "Wednesday" },
  { day: "Thursday" },
  { day: "Friday" },
  { day: "Saturday" },
];
type DaysAvailable = {
  [key in Day]: boolean;
};

function CreateBusiness() {
  const initialDaysAvailable = {
    Sunday: true,
    Monday: true,
    Tuesday: true,
    Wednesday: true,
    Thursday: true,
    Friday: true,
    Saturday: true,
  };
  const [businessName, setBusinessName] = useState<string>();
  const db = getFirestore(app);
  const { user } = useKindeBrowserClient();
  const router = useRouter();
  const [daysAvailable, setDaysAvailable] =
    useState<DaysAvailable>(initialDaysAvailable);
  const onCreateBusiness = async () => {
    if (!user?.email || !businessName) {
      console.log("Missing user email or business name");
      return;
    }

    try {
      await setDoc(doc(db, "Business", user.email), {
        businessName: businessName.trim().replace(/ /g, "_"),
        email: user.email,
        userName: `${user.given_name} ${user.family_name}`,
        daysAvailable: daysAvailable,
      });
      console.log("Document Saved");
      toast("New Business Created!");
      router.replace("/dashboard");
    } catch (error) {
      console.error("Error saving document:", error);
    }
  };
  return (
    <div className="p-14 items-center flex flex-col gap-20 my-10">
      {/* <Image src="/logo.svg" width={200} height={200} alt="Error" /> */}
      <div>
        <div className="text-3xl no-underline text-blue-700 font-sans font-bold max-[430px]:text-[20px]">
          Byte<span className="text-green-800">Webster</span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-4 max-w-3xl">
        <h2 className="text-4xl font-bold">
          What should we call your business?
        </h2>
        <p className="text-slate-500">
          You can always change this later from settings
        </p>
        <div className="w-full">
          <label className="text-slate-400">
            Team Name ( Do not use special characters)
          </label>
          <Input
            placeholder="Ex. TubeGuruji"
            className="mt-2"
            onChange={(event) => setBusinessName(event.target.value as string)}
          />
        </div>
        <Button
          className="w-full"
          disabled={!businessName}
          onClick={onCreateBusiness}
        >
          Create Business
        </Button>
      </div>
    </div>
  );
}

export default CreateBusiness;
