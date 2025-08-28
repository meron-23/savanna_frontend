import React from 'react';

function Attendance() {
  const handleOpenAttendance = () => {
    window.open("http://localhost:9002", "_blank");
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-10 text-center">
      <h1 className="text-2xl font-bold mb-4">Employee Attendance</h1>
      <p className="text-gray-600 mb-6 max-w-lg">
        Track and manage your team’s attendance records directly from the CRM.
        Click below to access the attendance system.
      </p>

      <button
        onClick={handleOpenAttendance}
        className="px-6 py-3 bg-[#F4C430] hover:bg-[#333333] text-white font-semibold rounded-lg shadow-md transition-all duration-200"
      >
        Open Attendance System
      </button>

      <p className="text-sm text-gray-500 mt-4">
        (This will open the attendance app in a new tab)
      </p>
    </div>
  );
}

export default Attendance;
