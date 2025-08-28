import React, { useState, useEffect, useMemo } from 'react';
import { FiCalendar, FiUsers, FiHome, FiMapPin, FiDollarSign, FiList } from 'react-icons/fi';

// Import your local data
import localData from '../../data.json';

// Import date helper functions (you'll need to create these)
const isToday = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

const isThisWeek = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(today);
  endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
  endOfWeek.setHours(23, 59, 59, 999);
  
  return date >= startOfWeek && date <= endOfWeek;
};

const SalesDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [followUpNumberInput, setFollowUpNumberInput] = useState('');

  const salesName = localStorage.getItem('name') || 'Sales Agent';

  const handleSubmitFollowUpInput = () => {
    console.log("Submitting daily follow-up number:", followUpNumberInput);
    alert(`Daily follow-up count submitted: ${followUpNumberInput}`);
    setFollowUpNumberInput(''); 
  };

  // Load data from local JSON
  const prospectsData = useMemo(() => {
    try {
      return localData.prospects || [];
    } catch (err) {
      console.error("Error loading prospects data:", err);
      setError('Failed to load prospects data');
      return [];
    }
  }, []);

  // --- Data for Metric Cards ---
  const totalProspects = prospectsData.length; 
  const officeVisits = prospectsData.filter(p => p.method === 'Office Visit').length; 
  const siteVisits = prospectsData.filter(p => p.site === 'Visited').length; 
  const salesCount = prospectsData.filter(p => p.remark === 'Closed-Won').length; 
  const followUpsMetric = prospectsData.filter(p => p.method === 'Follow-up').length; 

  // --- Data for Bar Chart (Prospects Overview) ---
  const dailyProspects = prospectsData.filter(p => isToday(p.dateNow)).length;
  const weeklyProspects = prospectsData.filter(p => isThisWeek(p.dateNow)).length;

  const barChartData = {
    labels: ['Daily', 'Weekly', 'Total'],
    datasets: [
      {
        label: 'Prospects Count',
        data: [dailyProspects, weeklyProspects, totalProspects],
        backgroundColor: [
          '#737373', 
          '#262626', 
          '#404040'  
        ],
        borderColor: [
          '#262626',
          '#404040',
          '#737373'
        ],
        borderWidth: 1,
      },
    ],
  };

  // --- Data for Pie Chart (Methods Distribution) ---
  const methodsCount = {};
  prospectsData.forEach(p => {
    const method = p.method || 'Unknown'; 
    methodsCount[method] = (methodsCount[method] || 0) + 1;
  });

  const pieChartLabels = Object.keys(methodsCount);
  const pieChartDataValues = Object.values(methodsCount);

  const pieChartData = {
    labels: pieChartLabels,
    datasets: [
      {
        data: pieChartDataValues,
        backgroundColor: [
          '#E8B10C', '#FFA500', '#FFDB0D', '#E8810C', '#FF6B0D'
        ],
        hoverBackgroundColor: [
          '#FFA500', '#E8B10C', '#FFDB0D', '#E8810C', '#FF6B0D'
        ],
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-gray-600">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-48">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6 w-full">
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {salesName}!</h1>
          <p className="text-gray-600">Role: Sales Agent</p>
          <p className="text-gray-800 mt-2">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>

      {/* Today's Follow-ups Section (input field) */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="text-red-500 text-xl mr-1">*</span> 
          Today's Follow-ups
        </h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
          <input
            type="number" 
            placeholder="Enter number"
            value={followUpNumberInput}
            onChange={(e) => setFollowUpNumberInput(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F4A300] text-gray-700"
          />
          <button 
            onClick={handleSubmitFollowUpInput}
            className="bg-[#F4A300] hover:bg-[#e69500] text-white font-medium py-2 px-6 rounded-md transition duration-200 w-full sm:w-auto"
          >
            Submit
          </button>
        </div>
      </div>
      
      {/* Metric Cards Grid */}
      <div className="md:mb-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Prospects Card */}
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
              <FiUsers className="text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Prospects</p>
              <p className="text-2xl font-bold text-gray-800">{totalProspects}</p>
            </div>
          </div>
          
          {/* Office Visits card */}
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4">
            <div className="bg-red-100 p-3 rounded-full text-red-600">
              <FiHome className="text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Office Visits</p>
              <p className="text-2xl font-bold text-gray-800">{officeVisits}</p>
            </div>
          </div>
          
          {/* Site Visits card */}
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-full text-green-600">
              <FiMapPin className="text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Site Visits</p>
              <p className="text-2xl font-bold text-gray-800">{siteVisits}</p>
            </div>
          </div>
          
          {/* Sales card */}
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-full text-purple-600">
              <FiDollarSign className="text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Sales</p>
              <p className="text-2xl font-bold text-gray-800">{salesCount}</p>
            </div>
          </div>
          
          {/* Follow-ups metric card */}
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4">
            <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
              <FiList className="text-xl" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Follow-ups</p>
              <p className="text-2xl font-bold text-gray-800">{followUpsMetric}</p>
            </div>
          </div>
        </div>
      </div>

      {/* "Filter By Date" section */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter By Date</h3>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700 mb-1">From Date :</label>
            <div className="relative">
              <input
                type="date" 
                id="fromDate"
                className="w-full p-2 border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-[#F4A300] text-gray-700"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="flex-1">
            <label htmlFor="toDate" className="block text-sm font-medium text-gray-700 mb-1">To Date :</label>
            <div className="relative">
              <input
                type="date" 
                id="toDate"
                className="w-full p-2 border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-[#F4A300] text-gray-700"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Prospects Overview Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Prospects Overview</h3>
          <div className="w-full h-64 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p>Chart visualization would appear here</p>
              <p className="text-sm mt-2">Daily: {dailyProspects} | Weekly: {weeklyProspects} | Total: {totalProspects}</p>
            </div>
          </div>
        </div>

        {/* Methods Distribution Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Methods Distribution</h3>
          <div className="w-full h-64 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p>Chart visualization would appear here</p>
              <div className="mt-4 text-sm">
                {pieChartLabels.map((label, index) => (
                  <div key={index} className="flex items-center justify-center mb-1">
                    <div 
                      className="w-3 h-3 mr-2" 
                      style={{ backgroundColor: pieChartData.datasets[0].backgroundColor[index] }}
                    ></div>
                    <span>{label}: {pieChartDataValues[index]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;