import React, { useState, useMemo } from 'react';
import { FiDownload, FiFilter, FiSearch, FiX, FiTrendingUp, FiUser, FiDollarSign, FiCalendar } from 'react-icons/fi';

const SalesReport = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('All Agents');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedSite, setSelectedSite] = useState('All Sites');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const salesData = [
    {
      id: 1,
      amount: "46,000,000 ETB",
      numericAmount: 46000000,
      agent: "Ellab Etsubdink",
      type: "N/A",
      site: "Other",
      area: "204",
      location: "Hayat",
      date: "Jul 16, 2025",
      soldTo: "Unknown"
    },
    {
      id: 2,
      amount: "13,673,700 ETB",
      numericAmount: 13673700,
      agent: "Amanuel Tsegaya",
      type: "Apartment",
      site: "N/A",
      area: "152.99",
      location: "Hayat",
      date: "Jul 16, 2025",
      soldTo: "Unknown"
    },
    {
      id: 3,
      amount: "47,000,000 ETB",
      numericAmount: 47000000,
      agent: "Amanuel Tsegaya",
      type: "N/A",
      site: "Other",
      area: "204",
      location: "Hayat",
      date: "Jul 9, 2025",
      soldTo: "Ato Girma - +251 91 658 1807"
    },
    {
      id: 4,
      amount: "14,357,070 ETB",
      numericAmount: 14357070,
      agent: "Ellab Etsubdink",
      type: "Apartment",
      site: "Other",
      area: "151.93",
      location: "Ayat",
      date: "Jun 11, 2025",
      soldTo: "Stedele - +251911094990"
    },
    {
      id: 5,
      amount: "14,357,070 ETB",
      numericAmount: 14357070,
      agent: "Amanuel Tsegaya",
      type: "Apartment",
      site: "Other",
      area: "151.93",
      location: "Ayat",
      date: "Jun 7, 2025",
      soldTo: "Unknown"
    },
    {
      id: 6,
      amount: "20,025,000 ETB",
      numericAmount: 20025000,
      agent: "Ashenafi Alena",
      type: "Apartment",
      site: "Yebe Real Estate",
      area: "200",
      location: "Au",
      date: "Apr 21, 2025",
      soldTo: "Meselech - 0966255463"
    },
    {
      id: 7,
      amount: "4,614,300 ETB",
      numericAmount: 4614300,
      agent: "Digital Department",
      type: "Shop",
      site: "N/A",
      area: "17.09",
      location: "Bulgaria",
      date: "Apr 11, 2025",
      soldTo: "Elias - +1 (619) 730-5162"
    }
  ];

  // Extract unique values for filters
  const agents = useMemo(() => ['All Agents', ...new Set(salesData.map(item => item.agent))], []);
  const types = useMemo(() => ['All Types', ...new Set(salesData.map(item => item.type))], []);
  const sites = useMemo(() => ['All Sites', ...new Set(salesData.map(item => item.site))], []);

  // Filter sales data
  const filteredSales = useMemo(() => {
    return salesData.filter(sale => {
      const matchesSearch = searchTerm === '' || 
        Object.values(sale).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      
      const matchesAgent = selectedAgent === 'All Agents' || sale.agent === selectedAgent;
      const matchesType = selectedType === 'All Types' || sale.type === selectedType;
      const matchesSite = selectedSite === 'All Sites' || sale.site === selectedSite;
      
      // Date filtering
      const saleDate = new Date(sale.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      const matchesDate = (!start || saleDate >= start) && (!end || saleDate <= end);
      
      return matchesSearch && matchesAgent && matchesType && matchesSite && matchesDate;
    });
  }, [searchTerm, selectedAgent, selectedType, selectedSite, startDate, endDate]);

  // Calculate totals
  const totalSales = filteredSales.length;
  const totalAmount = filteredSales.reduce((sum, sale) => sum + sale.numericAmount, 0);
  const averageSale = totalSales > 0 ? totalAmount / totalSales : 0;
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ET', { 
      style: 'currency', 
      currency: 'ETB',
      minimumFractionDigits: 0 
    }).format(amount);
  };

  // Pagination
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSales = filteredSales.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Export to CSV
  const handleExport = () => {
    const headers = ["Amount", "Agent", "Type", "Site", "Area", "Location", "Date", "Sold To"];
    const csvRows = filteredSales.map(sale => [
      sale.amount, sale.agent, sale.type, sale.site, sale.area, sale.location, sale.date, sale.soldTo
    ]);
    
    const csvContent = [headers, ...csvRows].map(row => 
      row.map(field => `"${field}"`).join(',')
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'sales_report.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedAgent('All Agents');
    setSelectedType('All Types');
    setSelectedSite('All Sites');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Sales Dashboard</h1>
            <p className="text-gray-600 mt-1">Track and analyze your sales performance</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#333333] p-6 rounded-xl shadow-md flex items-center">
            <div className="p-3 rounded-full mr-4">
              <FiTrendingUp className="text-[#F4A300] text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#F4A300]">Total Sales</p>
              <p className="text-2xl font-bold text-[#F4A300]">{totalSales}</p>
            </div>
          </div>
          
          <div className="bg-[#333333] p-6 rounded-xl shadow-md flex items-center">
            <div className="p-3 rounded-full mr-4">
              <FiDollarSign className="text-[#F4A300] text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#F4A300]">Total Amount</p>
              <p className="text-2xl font-bold text-[#F4A300]">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
          
          <div className="bg-[#333333] p-6 rounded-xl shadow-md flex items-center">
            <div className="p-3 rounded-full mr-4">
              <FiUser className="text-[#F4A300] text-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#F4A300]">Average Sale</p>
              <p className="text-2xl font-bold text-[#F4A300]">{formatCurrency(averageSale)}</p>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Sales Management</h2>
            <div className="flex items-center mt-4 sm:mt-0">
              <span className="text-sm text-gray-600 mr-4">{filteredSales.length} sales found</span>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <FiFilter className="mr-2" />
                Filters
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search sales by any field..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F4A300] focus:border-[#F4A300]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Agent</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#F4A300] focus:border-[#F4A300]"
                  value={selectedAgent}
                  onChange={(e) => setSelectedAgent(e.target.value)}
                >
                  {agents.map(agent => (
                    <option key={agent} value={agent}>{agent}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#F4A300] focus:border-[#F4A300]"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#F4A300] focus:border-[#F4A300]"
                  value={selectedSite}
                  onChange={(e) => setSelectedSite(e.target.value)}
                >
                  {sites.map(site => (
                    <option key={site} value={site}>{site}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                <div className="flex space-x-2">
                  <input
                    type="date"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-[#F4A300] focus:border-[#F4A300] text-sm"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="Start date"
                  />
                  <input
                    type="date"
                    className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-[#F4A300] focus:border-[#F4A300] text-sm"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="End date"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2 lg:col-span-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  <FiX className="mr-2" />
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Sales Table */}
          <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Area</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold To</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentSales.length > 0 ? (
                  currentSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sale.amount}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{sale.agent}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{sale.type}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{sale.site}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{sale.area} SQM</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{sale.location}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <FiCalendar className="mr-1 text-gray-400" />
                          {sale.date}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">{sale.soldTo}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                      No sales data found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 mb-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              
              <div className="hidden md:flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      currentPage === page 
                        ? 'bg-[#F4A300] text-white' 
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              
              <div className="md:hidden text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
          <button
            onClick={handleExport}
            className="sm:mt-0 flex items-center px-4 py-2 bg-[#F4A300] text-white rounded-lg hover:bg-[#e69500] transition-colors"
          >
            <FiDownload className="mr-2" />
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesReport;