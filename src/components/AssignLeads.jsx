import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Mock data to simulate an API call or local data file.
const mockData = {
  "users": [
    {
      "userId": "user_1",
      "name": "Alex Johnson",
      "email": "alex.j@example.com",
      "gender": "Male",
      "phoneNumber": "555-123-4567",
      "role": "Supervisor",
      "is_active": true,
      "login_method": "email"
    },
    {
      "userId": "user_2",
      "name": "Sarah Lee",
      "email": "sarah.l@example.com",
      "gender": "Female",
      "phoneNumber": "555-987-6543",
      "role": "SalesAgent",
      "supervisor": "user_1",
      "is_active": true,
      "login_method": "email"
    },
    {
      "userId": "user_3",
      "name": "Michael Chen",
      "email": "michael.c@example.com",
      "gender": "Male",
      "phoneNumber": "555-555-1212",
      "role": "SalesAgent",
      "supervisor": "user_1",
      "is_active": true,
      "login_method": "email"
    },
    {
      "userId": "user_4",
      "name": "Emily Watson",
      "email": "emily.w@example.com",
      "gender": "Female",
      "phoneNumber": "555-222-3333",
      "role": "Supervisor",
      "is_active": true,
      "login_method": "email"
    },
    {
      "userId": "user_5",
      "name": "David Kim",
      "email": "david.k@example.com",
      "gender": "Male",
      "phoneNumber": "555-777-8888",
      "role": "SalesAgent",
      "supervisor": "user_4",
      "is_active": true,
      "login_method": "email"
    },
    {
      "userId": "user_6",
      "name": "Jessica Miller",
      "email": "jessica.m@example.com",
      "gender": "Female",
      "phoneNumber": "555-111-2222",
      "role": "Admin",
      "is_active": true,
      "login_method": "email"
    }
  ],
  "leads": [
    {
      "id": 1,
      "name": "Alice Johnson",
      "phone": "555-123-4567",
      "interest": "Interested in product demo",
      "status": "new",
      "is_called": false,
      "date_added": "2025-08-01T09:15:00.000Z",
      "source": "social_media"
    },
    {
      "id": 2,
      "name": "Bob Smith",
      "phone": "555-987-6543",
      "interest": "Wants pricing info",
      "status": "new",
      "is_called": false,
      "date_added": "2025-08-02T14:30:00.000Z",
      "source": "referral"
    },
    {
      "id": 3,
      "name": "Carol Davis",
      "phone": "555-555-1212",
      "interest": "Looking for enterprise package",
      "status": "new",
      "is_called": false,
      "date_added": "2025-08-03T11:45:00.000Z",
      "source": "cold_call"
    },
    {
      "id": 4,
      "name": "David Lee",
      "phone": "555-333-9876",
      "interest": "Needs integration support",
      "status": "new",
      "is_called": false,
      "date_added": "2025-08-04T16:20:00.000Z",
      "source": "website"
    },
    {
      "id": 5,
      "name": "Eva Martinez",
      "phone": "555-222-4567",
      "interest": "Ready to buy",
      "status": "new",
      "is_called": false,
      "date_added": "2025-08-05T10:05:00.000Z",
      "source": "event"
    }
  ]
};

const UserIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const SendIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);

const XIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const SearchIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const RefreshIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 4 23 10 17 10"></polyline>
    <polyline points="1 20 1 14 7 14"></polyline>
    <path d="M3.51 9a9 9 0 0 1 14.13-3.36L23 10M1 14l5.36 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
);

const PhoneIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 2 5.18 2 2 0 0 1 4 3h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8 11a16 16 0 0 0 5 5l1.36-1.36a2 2 0 0 1 2.11-.45 12.05 12.05 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);


const ChevronDownIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const AssignLeads = () => {
  const [leads, setLeads] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [selectedSupervisorId, setSelectedSupervisorId] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('new');
  const [sourceFilter, setSourceFilter] = useState('');
  const [statusMessage, setStatusMessage] = useState(null);

  const showStatusMessage = (message, type = 'success') => {
    setStatusMessage({ message, type });
    setTimeout(() => setStatusMessage(null), 5000);
  };

  const loadData = useCallback(() => {
    try {
      const users = mockData.users || [];
      setAllUsers(users);

      const leadsData = mockData.leads || [];
      const leadsWithCalledStatus = leadsData.map(lead => ({
        ...lead,
        is_called: lead.is_called || false
      }));
      setLeads(leadsWithCalledStatus);
    } catch (err) {
      console.error("Error loading data:", err);
      setError('Failed to load data');
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const supervisors = useMemo(() => {
    return allUsers.filter(user => user.role === 'Supervisor');
  }, [allUsers]);

  const agents = useMemo(() => {
    return allUsers.filter(user => user.role === 'SalesAgent' || user.role === 'Agent');
  }, [allUsers]);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = (lead.name && lead.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (lead.phone && lead.phone.includes(searchTerm));
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchesSource = !sourceFilter || lead.source === sourceFilter;
      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [leads, searchTerm, statusFilter, sourceFilter]);

  const filteredAgents = useMemo(() => {
    return selectedSupervisorId
      ? agents.filter(agent => String(agent.supervisor) === String(selectedSupervisorId))
      : [];
  }, [selectedSupervisorId, agents]);

  const handleLeadSelect = (lead) => {
    setSelectedLeads(prev => {
      const isSelected = prev.some(l => l.id === lead.id);
      if (isSelected) {
        return prev.filter(l => l.id !== lead.id);
      } else {
        return [...prev, lead];
      }
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedLeads([...filteredLeads]);
    } else {
      setSelectedLeads([]);
    }
  };

  const handleAssign = () => {
    if (selectedLeads.length === 0 || (!selectedSupervisorId && !selectedAgent)) {
      showStatusMessage('Please select leads and an assignee.', 'error');
      return;
    }

    setIsLoading(true);

    const assignedLeadIds = selectedLeads.map(lead => lead.id);
    const assignedToId = selectedAgent || selectedSupervisorId;

    setLeads(prevLeads =>
      prevLeads.map(lead => {
        if (assignedLeadIds.includes(lead.id)) {
          return {
            ...lead,
            status: 'assigned',
            assigned_to: assignedToId,
          };
        }
        return lead;
      })
    );

    setSelectedLeads([]);
    setSelectedSupervisorId('');
    setSelectedAgent('');
    setIsLoading(false);
    showStatusMessage(`Successfully assigned ${assignedLeadIds.length} leads!`);
  };

  const handleCallLead = (leadId) => {
    setLeads(prevLeads =>
      prevLeads.map(lead => {
        if (lead.id === leadId) {
          return { ...lead, is_called: true };
        }
        return lead;
      })
    );
    showStatusMessage(`Lead has been marked as called.`, 'success');
  };

  const handleRefresh = () => {
    setSearchTerm('');
    setSourceFilter('');
    setSelectedLeads([]);
    setSelectedSupervisorId('');
    setSelectedAgent('');
    setError(null);
    loadData();
    showStatusMessage('Data refreshed.');
  };

  const allLeadsSelected = filteredLeads.length > 0 && selectedLeads.length === filteredLeads.length;

  const formatSource = (source) => {
    if (!source) return 'Unknown';
    return source
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 font-sans">
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .table-container {
            overflow-x: auto;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .message-box {
          position: fixed;
          top: 1rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 50;
          padding: 1rem 2rem;
          border-radius: 0.5rem;
          font-weight: 500;
          animation: fadeinout 5s forwards;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        @keyframes fadeinout {
          0% { opacity: 0; transform: translateY(-20px); }
          10% { opacity: 1; transform: translateY(0); }
          90% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
        `}
      </style>

      {statusMessage && (
        <div className={`message-box ${statusMessage.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
          {statusMessage.message}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6 text-gray-800">Assign Leads</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h2 className="text-lg font-semibold text-gray-800">Available Leads</h2>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:ring-[#F4A300] focus:border-[#F4A300]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#F4A300] focus:border-[#F4A300] appearance-none pr-10"
                >
                  <option value="new">New Leads</option>
                  <option value="assigned">Assigned</option>
                  <option value="all">All Leads</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
              <div className="relative w-full sm:w-auto">
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-[#F4A300] focus:border-[#F4A300] appearance-none pr-10"
                >
                  <option value="">All Sources</option>
                  <option value="social_media">Social Media</option>
                  <option value="cold_call">Cold Call</option>
                  <option value="survey">Survey</option>
                  <option value="referral">Referral</option>
                  <option value="website">Website</option>
                  <option value="event">Event</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
            </div>
          </div>

          <div className="table-container">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-10 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={allLeadsSelected}
                      onChange={handleSelectAll}
                      className="form-checkbox h-4 w-4 text-[#F4A300] rounded"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map(lead => {
                    const isSelected = selectedLeads.some(l => l.id === lead.id);
                    return (
                      <tr 
                        key={lead.id} 
                        className={`hover:bg-gray-50 cursor-pointer ${isSelected ? 'bg-blue-50' : ''} ${lead.is_called ? 'bg-green-50' : ''}`}
                        onClick={() => handleLeadSelect(lead)}
                      >
                        <td className="w-10 px-4 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="form-checkbox h-4 w-4 text-[#F4A300] rounded pointer-events-none"
                          />
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {lead.name || 'N/A'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lead.phone || 'N/A'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            lead.source === 'social_media' ? 'bg-purple-100 text-purple-800' :
                            lead.source === 'cold_call' ? 'bg-blue-100 text-blue-800' :
                            lead.source === 'survey' ? 'bg-green-100 text-green-800' :
                            lead.source === 'referral' ? 'bg-yellow-100 text-yellow-800' :
                            lead.source === 'website' ? 'bg-indigo-100 text-indigo-800' :
                            lead.source === 'event' ? 'bg-pink-100 text-pink-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {formatSource(lead.source)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            lead.is_called ? 'bg-green-400 text-green-900' :
                            lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                            lead.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {lead.is_called ? 'Called' : lead.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleCallLead(lead.id); }}
                            disabled={lead.is_called}
                            className={`flex items-center space-x-1 p-1.5 rounded-full transition-colors duration-200 ${
                              lead.is_called 
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                : 'bg-[#F4A300] text-white hover:bg-[#e6b82a]'
                            }`}
                          >
                            <PhoneIcon size={14} />
                            <span className="sr-only">Call</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      No leads available for assignment
                      <button 
                        onClick={handleRefresh}
                        className="mt-2 flex items-center justify-center mx-auto text-[#F4A300]"
                      >
                        <RefreshIcon className="mr-1" />
                        Refresh
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Assignment Details</h2>
            <button
              onClick={handleRefresh}
              className="text-[#F4A300] hover:text-[#e6b82a]"
            >
              <RefreshIcon />
            </button>
          </div>
          
          {selectedLeads.length > 0 ? (
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-2">Selected Leads ({selectedLeads.length}):</h3>
                <div className="max-h-40 overflow-y-auto">
                  {selectedLeads.map(lead => (
                    <div key={lead.id} className="flex justify-between items-center py-1 border-b border-gray-100">
                      <div>
                        <p className="font-medium truncate text-gray-900">{lead.name || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{formatSource(lead.source)}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLeadSelect(lead);
                        }}
                        className="text-red-400 hover:text-red-600"
                      >
                        <XIcon />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign to Supervisor:
                </label>
                <select
                  value={selectedSupervisorId}
                  onChange={(e) => {
                    setSelectedSupervisorId(e.target.value);
                    setSelectedAgent('');
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#F4A300] focus:border-[#F4A300]"
                >
                  <option value="">Select Supervisor</option>
                  {supervisors.map(supervisor => (
                    <option key={supervisor.userId} value={supervisor.userId}>
                      {supervisor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Or assign directly to Agent:
                </label>
                {selectedSupervisorId ? (
                  filteredAgents.length > 0 ? (
                    <select
                      value={selectedAgent}
                      onChange={(e) => setSelectedAgent(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#F4A300] focus:border-[#F4A300]"
                    >
                      <option value="">Select Agent</option>
                      {filteredAgents.map(agent => (
                        <option key={agent.userId} value={agent.userId}>
                          {agent.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-sm text-yellow-600 p-2 bg-yellow-50 rounded">
                      No agents available for selected supervisor
                    </div>
                  )
                ) : (
                  <div className="text-sm text-gray-500 p-2 bg-gray-50 rounded">
                    Please select a supervisor first
                  </div>
                )}
              </div>

              <button
                onClick={handleAssign}
                disabled={(!selectedSupervisorId && !selectedAgent) || isLoading}
                className={`w-full py-2 px-4 rounded-md text-white flex items-center justify-center transition-colors duration-200 ${
                  (!selectedSupervisorId && !selectedAgent) || isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#F4A300] hover:bg-[#e6b82a]'
                }`}
              >
                {isLoading ? (
                  <>
                    <RefreshIcon className="animate-spin mr-2" />
                    Assigning...
                  </>
                ) : (
                  <>
                    <SendIcon className="mr-2" />
                    Assign {selectedLeads.length} Lead{selectedLeads.length !== 1 ? 's' : ''}
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <UserIcon className="mx-auto text-4xl text-gray-300 mb-2" />
              <p>Select one or more leads to assign</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignLeads;
