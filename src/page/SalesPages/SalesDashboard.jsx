import React, { useState, useEffect, useMemo } from 'react';
import { FiCalendar, FiUsers, FiHome, FiMapPin, FiDollarSign, FiList, FiX } from 'react-icons/fi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedData, setSelectedData] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const salesName = localStorage.getItem('name') || 'Sales Agent';

  const handleSubmitFollowUpInput = () => {
    console.log("Submitting daily follow-up number:", followUpNumberInput);
    setSubmissionMessage(`Daily follow-up count submitted: ${followUpNumberInput}`);
    setFollowUpNumberInput('');
    // Clear message after a few seconds
    setTimeout(() => setSubmissionMessage(''), 3000);
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

  // Filter data by date range
  const filteredProspectsData = useMemo(() => {
    if (!fromDate && !toDate) return prospectsData;
    
    return prospectsData.filter(prospect => {
      const prospectDate = new Date(prospect.dateNow || prospect.dateAdded || '');
      if (isNaN(prospectDate)) return true;
      
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
      
      let valid = true;
      if (from) valid = valid && prospectDate >= from;
      if (to) valid = valid && prospectDate <= to;
      
      return valid;
    });
  }, [prospectsData, fromDate, toDate]);

  // --- Data for Metric Cards ---
  const totalProspects = filteredProspectsData.length;
  const officeVisits = filteredProspectsData.filter(p => p.method === 'Office Visit').length;
  const siteVisits = filteredProspectsData.filter(p => p.site === 'Visited').length;
  const salesCount = filteredProspectsData.filter(p => p.remark === 'Closed-Won').length;
  const followUpsMetric = filteredProspectsData.filter(p => p.method === 'Follow-up').length;

  // --- Data for Bar Chart (Prospects Overview) ---
  const dailyProspects = filteredProspectsData.filter(p => isToday(p.dateNow)).length;
  const weeklyProspects = filteredProspectsData.filter(p => isThisWeek(p.dateNow)).length;

  const barChartData = [
    { name: 'Daily', count: dailyProspects },
    { name: 'Weekly', count: weeklyProspects },
    { name: 'Total', count: totalProspects },
  ];

  // --- Data for Pie Chart (Methods Distribution) ---
  const methodsCount = {};
  filteredProspectsData.forEach(p => {
    const method = p.method || 'Unknown';
    methodsCount[method] = (methodsCount[method] || 0) + 1;
  });

  const pieChartData = Object.keys(methodsCount).map(key => ({
    name: key,
    value: methodsCount[key]
  }));

  const COLORS = ['#F4A300', '#FFA500', '#FFDB0D', '#E8810C', '#FF6B0D', '#b87333'];

  // Handle card click to show detailed table
  const handleCardClick = (cardType) => {
    setSelectedCard(cardType);
    
    let data = [];
    switch(cardType) {
      case 'prospects':
        data = filteredProspectsData;
        break;
      case 'officeVisits':
        data = filteredProspectsData.filter(p => p.method === 'Office Visit');
        break;
      case 'siteVisits':
        data = filteredProspectsData.filter(p => p.site === 'Visited');
        break;
      case 'sales':
        data = filteredProspectsData.filter(p => p.remark === 'Closed-Won');
        break;
      case 'followUps':
        data = filteredProspectsData.filter(p => p.method === 'Follow-up');
        break;
      default:
        data = [];
    }
    
    setSelectedData(data);
  };

  // Close the modal
  const handleCloseModal = () => {
    setSelectedCard(null);
    setSelectedData([]);
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
    <div className="flex flex-col space-y-6 w-full p-4 md:p-8">
      <div className="bg-white text-amber-400 p-6 rounded-lg shadow-sm mb-6">
        <div>
          <h1 className="text-2xl font-bold text-black">Welcome, {salesName}!</h1>
          <p className="text-gray-400">Role: Sales Agent</p>
          <p className="mt-2 text-gray-400">
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
        {submissionMessage && (
            <p className="mt-2 text-green-600 text-sm text-center">{submissionMessage}</p>
        )}
      </div>
      
      {/* Metric Cards Grid */}
      <div className="md:mb-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Prospects Card */}
          <div 
            className="bg-[#333333] p-4 rounded-lg shadow-sm flex items-center space-x-4 cursor-pointer hover:bg-[#444444] transition-colors"
            onClick={() => handleCardClick('prospects')}
          >
            <div className="p-3 rounded-full text-amber-400">
              <FiUsers className="text-xl" />
            </div>
            <div>
              <p className="text-amber-400 text-sm">Prospects</p>
              <p className="text-2xl font-bold text-amber-400">{totalProspects}</p>
            </div>
          </div>
          
          {/* Office Visits card */}
          <div 
            className="bg-[#333333] p-4 rounded-lg shadow-sm flex items-center space-x-4 cursor-pointer hover:bg-[#444444] transition-colors"
            onClick={() => handleCardClick('officeVisits')}
          >
            <div className="p-3 rounded-full text-amber-400">
              <FiHome className="text-xl" />
            </div>
            <div>
              <p className="text-amber-400 text-sm">Office Visits</p>
              <p className="text-2xl font-bold text-amber-400">{officeVisits}</p>
            </div>
          </div>
          
          {/* Site Visits card */}
          <div 
            className="bg-[#333333] p-4 rounded-lg shadow-sm flex items-center space-x-4 cursor-pointer hover:bg-[#444444] transition-colors"
            onClick={() => handleCardClick('siteVisits')}
          >
            <div className="p-3 rounded-full text-amber-400">
              <FiMapPin className="text-xl" />
            </div>
            <div>
              <p className="text-amber-400 text-sm">Site Visits</p>
              <p className="text-2xl font-bold text-amber-400">{siteVisits}</p>
            </div>
          </div>
          
          {/* Sales card */}
          <div 
            className="bg-[#333333] p-4 rounded-lg shadow-sm flex items-center space-x-4 cursor-pointer hover:bg-[#444444] transition-colors"
            onClick={() => handleCardClick('sales')}
          >
            <div className="p-3 rounded-full text-amber-400">
              <FiDollarSign className="text-xl" />
            </div>
            <div>
              <p className="text-amber-400 text-sm">Sales</p>
              <p className="text-2xl font-bold text-amber-400">{salesCount}</p>
            </div>
          </div>
          
          {/* Follow-ups metric card */}
          <div 
            className="bg-[#333333] p-4 rounded-lg shadow-sm flex items-center space-x-4 cursor-pointer hover:bg-[#444444] transition-colors"
            onClick={() => handleCardClick('followUps')}
          >
            <div className="p-3 rounded-full text-amber-400">
              <FiList className="text-xl" />
            </div>
            <div>
              <p className="text-amber-400 text-sm">Follow-ups</p>
              <p className="text-2xl font-bold text-amber-400">{followUpsMetric}</p>
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
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
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
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-[#F4A300] text-gray-700"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <FiCalendar className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => { setFromDate(''); setToDate(''); }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md h-[42px]"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Prospects Overview Bar Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Prospects Overview</h3>
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#404040" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Methods Distribution Pie Chart */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Methods Distribution</h3>
          <div className="w-full h-64 flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Modal for showing detailed table */}
      {selectedCard && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                {selectedCard === 'prospects' && 'All Prospects'}
                {selectedCard === 'officeVisits' && 'Office Visits'}
                {selectedCard === 'siteVisits' && 'Site Visits'}
                {selectedCard === 'sales' && 'Sales'}
                {selectedCard === 'followUps' && 'Follow-ups'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-4">
              {selectedData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remark</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedData.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.method || 'N/A'}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.site || 'N/A'}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.remark || 'N/A'}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.dateNow ? new Date(item.dateNow).toLocaleDateString() : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex justify-center items-center h-32">
                  <p className="text-gray-500">No data available</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Showing {selectedData.length} records
              </p>
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesDashboard;