import React, { useState, useEffect } from 'react';

// Import your local data
import localData from '../../data.json';

const ProspectsDashboard = () => {
  // State for prospects data, loading status, and error messages
  const [prospects, setProspects] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Set to false since we're using local data
  const [error, setError] = useState(null);

  // State for dynamically populated dropdown options
  const [availableAgents, setAvailableAgents] = useState(['All Agents']);
  const [availableSites, setAvailableSites] = useState(['All Sites']);

  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('All Agents');
  const [selectedSite, setSelectedSite] = useState('All Sites');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page for pagination

  // Load data from local JSON
  useEffect(() => {
    try {
      // Load prospects from local data
      const prospectsData = localData.prospects || [];
      
      // Map the data to match the expected structure
      const mappedProspects = prospectsData.map(prospect => ({
        id: prospect.id,
        name: prospect.name || '',
        phone: prospect.phoneNumber || '',
        date: prospect.dateNow || prospect.date || '',
        agent: prospect.userId || 'Unassigned', // Using userId as agent ID
        interest: prospect.interest || '',
        method: prospect.method || '',
        site: prospect.site || '',
        comment: prospect.comment || '',
        // Additional fields for export
        agent_id: prospect.userId || '',
        agent_email: '', // Not available in prospects data
        agent_phone: '', // Not available in prospects data
        agent_gender: '', // Not available in prospects data
        agent_role: '', // Not available in prospects data
        supervisor: '', // Not available in prospects data
        creationTime: prospect.dateNow || '',
        lastSignInTime: '' // Not available in prospects data
      }));

      // Sort prospects by date in descending order (most recent first)
      const sortedProspects = mappedProspects.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
      });

      setProspects(sortedProspects);

      // Extract unique agent IDs
      const uniqueAgents = [...new Set(prospectsData
        .filter(p => p.userId) // Filter for prospects with assigned agents
        .map(p => p.userId)
      )].sort();
      setAvailableAgents(['All Agents', ...uniqueAgents]);

      // Extract unique sites
      const uniqueSites = [...new Set(prospectsData
        .filter(p => p.site) // Filter for prospects with sites
        .map(p => p.site)
      )].sort();
      setAvailableSites(['All Sites', ...uniqueSites]);

    } catch (err) {
      console.error("Error loading prospects:", err);
      setError('Failed to load prospects data');
    }
  }, []);

  // Filtered prospects based on current filters
  const filteredProspects = prospects.filter(prospect => {
    const matchesSearchTerm = searchTerm === '' ||
      Object.values(prospect).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesAgent = selectedAgent === 'All Agents' || prospect.agent === selectedAgent;
    const matchesSite = selectedSite === 'All Sites' || prospect.site === selectedSite;

    const prospectDate = new Date(prospect.date);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const matchesDateRange = (!start || prospectDate >= start) && (!end || prospectDate <= end);

    return matchesSearchTerm && matchesAgent && matchesSite && matchesDateRange;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProspects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProspects = filteredProspects.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedAgent('All Agents');
    setSelectedSite('All Sites');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  // Helper to format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  // Function to handle Export
  const handleExport = () => {
    if (filteredProspects.length === 0) {
      alert("No data to export.");
      return;
    }

    // Define CSV headers
    const headers = [
      "ID", "Name", "Phone", "Date", "Agent ID", "Interest", "Method", "Site", "Comment"
    ];

    // Map data to CSV rows
    const csvRows = filteredProspects.map(p => [
      p.id, p.name, p.phone, formatDate(p.date), p.agent, p.interest, p.method, p.site, p.comment
    ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(','));

    // Combine headers and rows
    const csvContent = [headers.join(','), ...csvRows].join('\n');

    // Create a Blob and download it
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'prospects_data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      alert("Your browser does not support downloading files directly. Please copy the data manually.");
    }
  };

  // Function to handle Delete Duplicates
  const handleDeleteDuplicates = () => {
    if (prospects.length === 0) {
      alert("No prospects to check for duplicates.");
      return;
    }

    const uniqueProspects = [];
    const seenPhoneNumbers = new Set();
    let duplicatesRemovedCount = 0;

    prospects.forEach(prospect => {
      if (prospect.phone && !seenPhoneNumbers.has(prospect.phone)) {
        uniqueProspects.push(prospect);
        seenPhoneNumbers.add(prospect.phone);
      } else if (prospect.phone && seenPhoneNumbers.has(prospect.phone)) {
        duplicatesRemovedCount++;
      }
    });

    if (duplicatesRemovedCount > 0) {
      setProspects(uniqueProspects);
      alert(`${duplicatesRemovedCount} duplicate(s) removed from the display.`);
    } else {
      alert("No duplicates found based on phone number.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Prospects Dashboard</h1>
        </div>

        {/* Loading and Error Indicators */}
        {isLoading && (
          <div className="text-center py-4 text-gray-700">Loading prospects...</div>
        )}
        {error && (
          <div className="text-center py-4 text-red-600 font-medium">{error}</div>
        )}

        {/* Only render content if not loading and no error, or if data is available */}
        {!isLoading && !error && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between border border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Total Prospects</p>
                  <p className="text-2xl font-bold text-gray-900">{prospects.length}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.125A7.5 7.5 0 0112 21.75 7.5 7.5 0 019 19.125m3-12.75a4.5 4.5 0 110 9 4.5 4.5 0 010-9zM12 18v.75a.75.75 0 00.75.75H13.5a.75.75 0 00.75-.75V18m-9.75-2.25h-.75a.75.75 0 00-.75.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75M12 3.75v.75a.75.75 0 00.75.75H13.5a.75.75 0 00.75-.75V3.75m-9.75 1.5h-.75a.75.75 0 00-.75.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-极9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.极75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 0 00.75.75h.75m-3-9.75h-.75A.75.75 0 003 9.75v.75a.75.75 极0 00.75.75h.75" />
                </svg>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between border border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Unique Agents</p>
                  <p className="text-2xl font-bold text-gray-900">{availableAgents.length - 1}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 9极v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between border border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="text-2xl font-bold text-gray-900">{new Date().toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="极0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            {/* Prospects Management Section */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
                <h2 className="text-xl font-semib极old text-gray-800">Prospects Management</h2>
                <span className="text-sm text-gray-600">{filteredProspects.length} prospects found</span>
              </div>

              {/* Filters Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <label htmlFor="phone-search" className="sr-only">Search by Phone Number</label>
                  <input
                    id="phone-search"
                    type="text"
                    placeholder="Search by Name, Phone No, or Agent"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="agent-select" className="sr-only">Agent</label>
                  <select
                    id="agent-select"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={selectedAgent}
                    onChange={(e) => setSelectedAgent(e.target.value)}
                  >
                    {availableAgents.map((agent, index) => (
                      <option key={index} value={agent}>{agent}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="site-select" className="sr-only">Site</label>
                  <select
                    id="site-select"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={selectedSite}
                    onChange={(e) => setSelectedSite(e.target.value)}
                  >
                    {availableSites.map((site, index) => (
                      <option key={index} value={site}>{site}</option>
                    ))}
                  </select>
                </div>
                {/* Date Range Filters */}
                <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex flex-col sm:flex-row gap-2">
                  <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 whitespace-nowrap hidden sm:block">Date Range:</label>
                  <input
                    id极="start-date"
                    type="date"
                    placeholder="Start date"
                    className="flex-1 min-w-0 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <span className="text-gray-500 hidden sm:block">-</span>
                  <input
                    type="date"
                    placeholder="End date"
                    className="flex-1 min-w-0 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 justify-end mb-6">
                <button
                  onClick={handleExport}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Export
                </button>
                <button
                  onClick={handleDeleteDuplicates}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Remove Duplicates
                </button>
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Clear Filters
                </button>
              </div>

              {/* Prospects Table */}
              <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Phone</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray极-500 uppercase tracking-wider whitespace-nowrap">Agent ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Interest</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Method</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Site</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Comment</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentProspects.length > 0 ? (
                      currentProspects.map((prospect) => (
                        <tr key={prospect.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{prospect.name}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{prospect.phone}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(prospect.date)}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{prospect.agent}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{prospect.interest}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{prospect.method}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{prospect.site}</td>
                          <td className="px-4 py-4 text-sm text-gray-500 max-w-xs truncate">{prospect.comment}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="px-4 py-4 text-center text-gray-500">No matching prospects found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-md text-sm font-medium ${
                        currentPage === page ? 'bg-[#F4A300] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProspectsDashboard;