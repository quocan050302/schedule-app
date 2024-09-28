import { Input } from "@/components/ui/input";
import React from "react";

interface UserFormInfoProps {
  setUserName: (name: string) => void;
  setUserEmail: (email: string) => void;
  setUserNote: (note: string) => void;
}

const UserFormInfo: React.FC<UserFormInfoProps> = ({
  setUserName,
  setUserEmail,
  setUserNote,
}) => {
  return (
    <div className="p-4 px-8 flex flex-col gap-3">
      <h2 className="font-bold text-xl">Enter Details</h2>
      <div>
        <h2>Name *</h2>
        <Input
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setUserName(event.target.value)
          }
        />
      </div>
      <div>
        <h2>Email *</h2>
        <Input
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setUserEmail(event.target.value)
          }
        />
      </div>
      <div>
        <h2>Share any Notes</h2>
        <Input
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setUserNote(event.target.value)
          }
        />
      </div>
      <div>
        <h2 className="text-xs text-gray-400">
          By proceeding, you confirm that you have read and agree to
          Tubeguruji's terms and conditions.
        </h2>
      </div>
    </div>
  );
};

export default UserFormInfo;
