import React from 'react';

const Analytics = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-2 text-blue-700 dark:text-blue-300">Total Users</h3>
          <p className="text-3xl font-bold text-blue-800 dark:text-blue-200">2,543</p>
          <div className="flex items-center mt-2 text-sm text-blue-600 dark:text-blue-400">
            <span className="flex items-center">
              <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5l7 7-7 7-7-7 7-7z" fill="currentColor"/>
              </svg>
              12.5%
            </span>
            <span className="ml-2">vs last month</span>
          </div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-2 text-green-700 dark:text-green-300">Revenue</h3>
          <p className="text-3xl font-bold text-green-800 dark:text-green-200">$12,426</p>
          <div className="flex items-center mt-2 text-sm text-green-600 dark:text-green-400">
            <span className="flex items-center">
              <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5l7 7-7 7-7-7 7-7z" fill="currentColor"/>
              </svg>
              8.2%
            </span>
            <span className="ml-2">vs last month</span>
          </div>
        </div>
        
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-2 text-purple-700 dark:text-purple-300">Active Projects</h3>
          <p className="text-3xl font-bold text-purple-800 dark:text-purple-200">32</p>
          <div className="flex items-center mt-2 text-sm text-purple-600 dark:text-purple-400">
            <span className="flex items-center">
              <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5l7 7-7 7-7-7 7-7z" fill="currentColor"/>
              </svg>
              4.1%
            </span>
            <span className="ml-2">vs last month</span>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Monthly Activity</h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Analytics chart would be displayed here</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
