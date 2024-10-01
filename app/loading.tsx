// loading.tsx
import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="border-8 border-gray-200 border-l-blue-600 rounded-full w-12 h-12 animate-spin"></div>{" "}
    </div>
  );
};

export default Loading;
