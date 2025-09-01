import React, { useState, useEffect, useMemo } from 'react';
import { FiDownload, FiFilter, FiSearch, FiX, FiCalendar, FiUser, FiHome, FiMapPin } from 'react-icons/fi';

// Import your local data
import localData from '../../data.json';

const VisitsReport = () => {
  // State for visits data, loading status, and error messages
  const [isLoading, setIsLoading] = useState(false); // Set to false since we're using local data
  const [error, setError] = useState(null);

  // States for dynamically populated dropdown options
  const [availableAgents, setAvailableAgents] = useState(['All Agents']);
  const [availableSites, setAvailableSites] = useState(['All Sites']);

  // Filter states
  const [clientPhoneFilter, setClientPhoneFilter] = useState('');
  const [agentFilter, setAgentFilter] = useState('All Agents');
  const [siteFilter, setSiteFilter] = useState('All Sites');
  const [visitTypeFilter, setVisitTypeFilter] = useState('');
  const [dateRangeStart, setDateRangeStart] = useState('');
  const [dateRangeEnd, setDateRangeEnd] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Load data from local JSON
  useEffect(() => {
    try {
      // Load visits from local data (if available) or use sample data
      let visitsData = [];
      
      // Check if visitsandsales exist in local data
      if (localData.visitsandsales && localData.visitsandsales.length > 0) {
        visitsData = localData.visitsandsales;
      } else {
        // Create sample visits data for demo
        visitsData = [
          {
            VisitID: 1,
            ClientID: 7,
            VisitDate: "2025-08-10",
            OfficeVisit: true,
            SiteVisit: false,
            VisitDetails: "Initial consultation at our Bole office. Discussed apartment requirements, budget, and preferred move-in date."
          },
          {
            VisitID: 2,
            ClientID: 8,
            VisitDate: "2025-08-15",
            OfficeVisit: false,
            SiteVisit: true,
            VisitDetails: "Site visit to the new office complex in Kazanchis. Client inspected the space, parking area, and common facilities."
          },
          {
            VisitID: 3,
            ClientID: 9,
            VisitDate: "2025-08-05",
            OfficeVisit: true,
            SiteVisit: true,
            VisitDetails: "Morning meeting at office to review documents, followed by site visit to townhouse project in CMC."
          },
          {
            VisitID: 4,
            ClientID: 10,
            VisitDate: "2025-08-18",
            OfficeVisit: false,
            SiteVisit: true,
            VisitDetails: "Exclusive viewing of luxury villa in Old Airport area. Client spent 2 hours inspecting the property."
          },
          {
            VisitID: 5,
            ClientID: 11,
            VisitDate: "2025-08-12",
            OfficeVisit: true,
            SiteVisit: false,
            VisitDetails: "Office meeting to discuss land documentation, zoning regulations, and potential construction permits."
          }
        ];
      }

      // Map the data to match the expected structure
      const mappedVisits = visitsData.map(visit => {
        // Find the corresponding prospect
        const prospect = localData.prospects.find(p => p.id === visit.ClientID) || {};
        
        // Find the corresponding agent (user)
        const agent = localData.users.find(u => u.userId === prospect.userId) || {};
        
        return {
          id: visit.VisitID,
          clientName: prospect.name || 'Unknown Client',
          phoneNumber: prospect.phoneNumber || 'N/A',
          visitDate: visit.VisitDate,
          visitTime: "10:00 AM", // Default time for demo
          salesAgent: agent.name || 'Unassigned',
          clientFeedback: visit.VisitDetails,
          siteVisit: visit.SiteVisit ? 'Yes' : 'No',
          officeVisit: visit.OfficeVisit ? 'Yes' : 'No',
          site: prospect.site || 'N/A',
          remark: prospect.remark || 'N/A',
          // Additional fields for export
          prospect_id: prospect.id,
          interest: prospect.interest,
          method: prospect.method,
          agent_id: agent.userId,
          agent_email: agent.email,
          agent_role: agent.role
        };
      });

      // Sort visits by date in descending order
      const sortedVisits = mappedVisits.sort((a, b) => {
        return new Date(b.visitDate) - new Date(a.visitDate);
      });

      // Set the visits data (we'll use it directly in the component)
      setAvailableAgents(['All Agents', ...new Set(sortedVisits.map(visit => visit.salesAgent))]);
      setAvailableSites(['All Sites', ...new Set(sortedVisits.map(visit => visit.site))]);

    } catch (err) {
      console.error("Error loading visits data:", err);
      setError('Failed to load visits data');
    }
  }, []);

  // Create sample visits data for the demo
  const visitsData = useMemo(() => {
    return [
      {
        id: 1,
        clientName: "Liya Endale",
        phoneNumber: "0911667788",
        visitDate: "2025-08-10",
        visitTime: "10:00 AM",
        salesAgent: "Yibeltal Degu",
        clientFeedback: "Initial consultation at our Bole office. Discussed apartment requirements, budget, and preferred move-in date.",
        siteVisit: "No",
        officeVisit: "Yes",
        site: "Ethio Homes",
        remark: "Follow up in 3 days",
        prospect_id: 7,
        interest: "Apartment",
        method: "Telemarketing",
        agent_id: "pdHpZXgh03gM5Jslp4A7jstFyeb2",
        agent_email: "deguyibeltal918@gmail.com",
        agent_role: "Sales Agent"
      },
      {
        id: 2,
        clientName: "Samuel Abebe",
        phoneNumber: "0911778899",
        visitDate: "2025-08-15",
        visitTime: "2:30 PM",
        salesAgent: "Yibeltal Degu",
        clientFeedback: "Site visit to the new office complex in Kazanchis. Client inspected the space, parking area, and common facilities.",
        siteVisit: "Yes",
        officeVisit: "No",
        site: "Addis Realty",
        remark: "Send brochure",
        prospect_id: 8,
        interest: "Office Space",
        method: "Online Form",
        agent_id: "pdHpZXgh03gM5Jslp4A7jstFyeb2",
        agent_email: "deguyibeltal918@gmail.com",
        agent_role: "Sales Agent"
      },
      {
        id: 3,
        clientName: "Blen Teshome",
        phoneNumber: "0911889900",
        visitDate: "2025-08-05",
        visitTime: "9:00 AM",
        salesAgent: "Meron Muluye",
        clientFeedback: "Morning meeting at office to review documents, followed by site visit to townhouse project in CMC.",
        siteVisit: "Yes",
        officeVisit: "Yes",
        site: "Sheger Properties",
        remark: "Schedule meeting",
        prospect_id: 9,
        interest: "Townhouse",
        method: "Referral",
        agent_id: "aa1b2c3d4e5f6g7h8i9jklmnopqr",
        agent_email: "meron.muluye@example.com",
        agent_role: "Supervisor"
      },
      {
        id: 4,
        clientName: "Mikiyas Solomon",
        phoneNumber: "0911990011",
        visitDate: "2025-08-18",
        visitTime: "3:00 PM",
        salesAgent: "Meron Muluye",
        clientFeedback: "Exclusive viewing of luxury villa in Old Airport area. Client spent 2 hours inspecting the property.",
        siteVisit: "Yes",
        officeVisit: "No",
        site: "Luxury Addis",
        remark: "Hot lead",
        prospect_id: 10,
        interest: "Villa",
        method: "Email",
        agent_id: "aa1b2c3d4e5f6g7h8i9jklmnopqr",
        agent_email: "meron.muluye@example.com",
        agent_role: "Supervisor"
      },
      {
        id: 5,
        clientName: "Rahel Girma",
        phoneNumber: "0911220033",
        visitDate: "2025-08-12",
        visitTime: "11:30 AM",
        salesAgent: "Yibeltal Degu",
        clientFeedback: "Office meeting to discuss land documentation, zoning regulations, and potential construction permits.",
        siteVisit: "No",
        officeVisit: "Yes",
        site: "EthioLand",
        remark: "Call tomorrow",
        prospect_id: 11,
        interest: "Land Plot",
        method: "Phone",
        agent_id: "pdHpZXgh03gM5Jslp4A7jstFyeb2",
        agent_email: "deguyibeltal918@gmail.com",
        agent_role: "Sales Agent"
      }
    ];
  }, []);

  // Filtered visits based on all applied filters
  const filteredVisits = useMemo(() => {
    return visitsData.filter(visit => {
      const matchesClientPhone = clientPhoneFilter === '' || 
        visit.phoneNumber.toLowerCase().includes(clientPhoneFilter.toLowerCase());
      
      const matchesAgent = agentFilter === 'All Agents' || 
        visit.salesAgent.toLowerCase().includes(agentFilter.toLowerCase());
      
      const matchesSite = siteFilter === 'All Sites' || 
        visit.site.toLowerCase().includes(siteFilter.toLowerCase());
      
      const matchesVisitType = visitTypeFilter === '' ||
        (visit.siteVisit === 'Yes' && visitTypeFilter === 'Site Visit') ||
        (visit.officeVisit === 'Yes' && visitTypeFilter === 'Office Visit');

      // Date range filtering
      const visitDate = new Date(visit.visitDate);
      const startDateObj = dateRangeStart ? new Date(dateRangeStart) : null;
      const endDateObj = dateRangeEnd ? new Date(dateRangeEnd) : null;

      const matchesDateRange = (!startDateObj || visitDate >= startDateObj) &&
                              (!endDateObj || visitDate <= endDateObj);

      return matchesClientPhone && matchesAgent && matchesSite && matchesVisitType && matchesDateRange;
    });
  }, [visitsData, clientPhoneFilter, agentFilter, siteFilter, visitTypeFilter, dateRangeStart, dateRangeEnd]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentVisits = filteredVisits.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredVisits.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const clearFilters = () => {
    setClientPhoneFilter('');
    setAgentFilter('All Agents');
    setSiteFilter('All Sites');
    setVisitTypeFilter('');
    setDateRangeStart('');
    setDateRangeEnd('');
    setCurrentPage(1);
  };

  // Calculate summary card values
  const totalVisitsCount = visitsData.length;
  const officeVisitsCount = visitsData.filter(visit => visit.officeVisit === 'Yes').length;
  const siteVisitsCount = visitsData.filter(visit => visit.siteVisit === 'Yes').length;

  // Function to handle Export
  const handleExport = () => {
    if (filteredVisits.length === 0) {
      alert("No data to export.");
      return;
    }

    // Define CSV headers
    const headers = [
      "Visit ID", "Client Name", "Phone Number", "Visit Date", "Visit Time", "Sales Agent",
      "Client Feedback", "Site Visit", "Office Visit", "Site", "Remark"
    ];

    // Map data to CSV rows
    const csvRows = filteredVisits.map(visit => [
      visit.id,
      visit.clientName,
      visit.phoneNumber,
      visit.visitDate,
      visit.visitTime,
      visit.salesAgent,
      visit.clientFeedback,
      visit.siteVisit,
      visit.officeVisit,
      visit.site,
      visit.remark
    ].map(field => `"${String(field || '').replace(/"/g, '""')}"`).join(','));

    // Combine headers and rows
    const csvContent = [headers.join(','), ...csvRows].join('\n');

    // Create a Blob and download it
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'visits_report.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-sans">
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Visits Report</h1>

        {/* Loading and Error Indicators */}
        {isLoading && (
          <div className="text-center py-4 text-gray-700">Loading visits data...</div>
        )}
        {error && (
          <div className="text-center py-4 text-red-600 font-medium">{error}</div>
        )}

        {/* Only render content if not loading and no error */}
        {!isLoading && !error && (
          <>
            {/* Header/Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Total Visits Card */}
              <div className="bg-[#333333] p-6 rounded-xl shadow-md flex items-center">
                <div className="p-3 rounded-full mr-4">
                  <FiCalendar className="text-[#F4A300] text-xl" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#F4A300]">Total Visits</p>
                  <p className="text-2xl font-bold text-[#F4A300]">{totalVisitsCount}</p>
                </div>
              </div>
              
              {/* Office Visits Card */}
              <div className="bg-[#333333] p-6 rounded-xl shadow-md flex items-center">
                <div className="p-3 rounded-full mr-4">
                  <FiHome className="text-[#F4A300] text-xl" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#F4A300]">Office Visits</p>
                  <p className="text-2xl font-bold text-[#F4A300]">{officeVisitsCount}</p>
                </div>
              </div>
              
              {/* Site Visits Card */}
              <div className="bg-[#333333] p-6 rounded-xl shadow-md flex items-center">
                <div className="p-3 rounded-full mr-4">
                  <FiMapPin className="text-[#F4A300] text-xl" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#F4A300]">Site Visits</p>
                  <p className="text-2xl font-bold text-[#F4A300]">{siteVisitsCount}</p>
                </div>
              </div>
            </div>

            {/* Visits Management Section */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Visits Management</h2>
                <p className="text-gray-600 text-sm mt-2 sm:mt-0">{filteredVisits.length} visits found</p>
              </div>

              {/* Filters Section */}
              <div className="border-b border-gray-200 pb-4 mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
                  <h3 className="text-lg font-semibold text-gray-700">Filters</h3>
                  <div className="flex space-x-2">
                    <button 
                      onClick={clearFilters} 
                      className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center transition-colors"
                    >
                      <FiX className="mr-2" />
                      Clear Filters
                    </button>
                    <button
                      onClick={handleExport}
                      className="border bg-[#F4A300] border-gray-300 text-white px-4 py-2 rounded-lg hover:bg-[#333333] flex items-center transition-colors"
                    >
                      <FiDownload className="mr-2" />
                      Export
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Client Phone Filter */}
                  <div>
                    <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700 mb-1">Client Phone</label>
                    <div className="relative">
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        id="clientPhone"
                        className="pl-10 w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#F4A300] focus:border-[#F4A300]"
                        placeholder="Search by phone"
                        value={clientPhoneFilter}
                        onChange={(e) => setClientPhoneFilter(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {/* Agent Filter */}
                  <div>
                    <label htmlFor="agent" className="block text-sm font-medium text-gray-700 mb-1">Agent</label>
                    <select
                      id="agent"
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#F4A300] focus:border-[#F4A300]"
                      value={agentFilter}
                      onChange={(e) => setAgentFilter(e.target.value)}
                    >
                      {availableAgents.map((agent, index) => (
                        <option key={index} value={agent}>{agent}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Site Filter */}
                  <div>
                    <label htmlFor="site" className="block text-sm font-medium text-gray-700 mb-1">Site</label>
                    <select
                      id="site"
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#F4A300] focus:border-[#F4A300]"
                      value={siteFilter}
                      onChange={(e) => setSiteFilter(e.target.value)}
                    >
                      {availableSites.map((site, index) => (
                        <option key={index} value={site}>{site}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Visit Type Filter */}
                  <div>
                    <label htmlFor="visitType" className="block text-sm font-medium text-gray-700 mb-1">Visit Type</label>
                    <select
                      id="visitType"
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#F4A300] focus:border-[#F4A300]"
                      value={visitTypeFilter}
                      onChange={(e) => setVisitTypeFilter(e.target.value)}
                    >
                      <option value="">All Types</option>
                      <option value="Site Visit">Site Visit</option>
                      <option value="Office Visit">Office Visit</option>
                    </select>
                  </div>
                  
                  {/* Date Range Filter */}
                  <div className="md:col-span-2 lg:col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="date"
                        className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#F4A300] focus:border-[#F4A300]"
                        value={dateRangeStart}
                        onChange={(e) => setDateRangeStart(e.target.value)}
                        placeholder="Start date"
                      />
                      <span className="hidden sm:flex items-center text-gray-500">to</span>
                      <input
                        type="date"
                        className="flex-1 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#F4A300] focus:border-[#F4A300]"
                        value={dateRangeEnd}
                        onChange={(e) => setDateRangeEnd(e.target.value)}
                        placeholder="End date"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Visits Table */}
              <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Feedback</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site Visit</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Office Visit</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Site</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentVisits.length > 0 ? (
                      currentVisits.map((visit) => (
                        <tr key={visit.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{visit.clientName}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{visit.phoneNumber}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>{visit.visitDate}</div>
                            <div className="text-xs text-gray-400">{visit.visitTime}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{visit.salesAgent}</td>
                          <td className="px-4 py-4 text-sm text-gray-500 max-w-xs truncate">{visit.clientFeedback}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              visit.siteVisit === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {visit.siteVisit}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              visit.officeVisit === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {visit.officeVisit}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{visit.site}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                          No matching visits found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
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
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VisitsReport;