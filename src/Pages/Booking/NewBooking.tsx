import React from 'react';

const NewBooking: React.FC = () => {
  return (
    <div className="min-h-screen p-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">New Bookings</h2>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 dark:bg-gray-700">
        <p className="text-gray-600 dark:text-gray-300">
          New Bookings list will be displayed here.
        </p>
      </div>
    </div>
  );
};

export default NewBooking; 