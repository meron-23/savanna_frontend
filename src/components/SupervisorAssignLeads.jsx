import React, { useState, useEffect, useMemo } from 'react';
import { FiUser, FiSend, FiX, FiSearch, FiRefreshCw, FiChevronDown } from 'react-icons/fi';

// Import your local data
import localData from '../data.json';

const SupervisorLeads = () => {
  // State management
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('new');
  const [sourceFilter, setSourceFilter] = useState('');

  // Load data from local JSON
  useEffect(() => {
    try {
      // Load leads from local data
      const leadsData = localData.leads || [];
      
      // Load users from local data and filter for agents
      const usersData = localData.users || [];
      const filteredAgents = usersData.filter(user => 
        user.role === 'Agent' || user.role === 'SalesAgent'
      );
      
      setLeads(leadsData);
      setAgents(filteredAgents);
    } catch (err) {
      console.error("Error loading data:", err);
      setError('Failed to load data');
    }
  }, []);

  // Filter leads based on search term and filters
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = (lead.name && lead.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (lead.phone && lead.phone.includes(searchTerm));
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchesSource = !sourceFilter || lead.source === sourceFilter;
      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [leads, searchTerm, statusFilter, sourceFilter]);

  // Handle lead selection
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

  // Handle select all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedLeads([...filteredLeads]);
    } else {
      setSelectedLeads([]);
    }
  };

  // Handle lead assignment (frontend-only simulation)
  const handleAssign = () => {
    if (selectedLeads.length === 0 || !selectedAgent) {
      setError("Please select at least one lead and an agent.");
      return;
    }

    try {
      setIsLoading(true);
      
      // Find the selected agent
      const agent = agents.find(a => a.userId === selectedAgent);
      if (!agent) {
        throw new Error('Selected agent not found');
      }

      // Simulate assignment by updating local state
      const assignedLeadIds = selectedLeads.map(lead => lead.id);
      
      // Update leads status locally
      const updatedLeads = leads.map(lead => {
        if (assignedLeadIds.includes(lead.id)) {
          return {
            ...lead,
            status: 'assigned',
            assigned_to: selectedAgent,
            agent_name: agent.name
          };
        }
        return lead;
      });
      
      setLeads(updatedLeads);
      setSelectedAgent('');
      setSelectedLeads([]);
      
      // Show success message
      alert(`Successfully assigned ${assignedLeadIds.length} leads to ${agent.name}!`);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = () => {
    setSearchTerm('');
    setSourceFilter('');
    setSelectedLeads([]);
    setSelectedAgent('');
    setError(null);
  };

  // Check if all filtered leads are currently selected
  const allLeadsSelected = filteredLeads.length > 0 && selectedLeads.length === filteredLeads.length;

  // Format source for display
  const formatSource = (source) => {
    if (!source) return 'Unknown';
    return source.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-2 mb-8">Viewing and managing leads assignment</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads List Column */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <h2 className="text-lg font-semibold">Leads ({filteredLeads.length})</h2>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-3 pr-8 py-2 border border-gray-300 rounded-md appearance-none w-full"
                >
                  <option value="new">New Leads</option>
                  <option value="assigned">Assigned</option>
                  <option value="all">All Leads</option>
                </select>
                <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="pl-3 pr-8 py-2 border border-gray-300 rounded-md appearance-none w-full"
                >
                  <option value="">All Sources</option>
                  <option value="social_media">Social Media</option>
                  <option value="cold_call">Cold Call</option>
                  <option value="survey">Survey</option>
                  <option value="referral">Referral</option>
                  <option value="website">Website</option>
                  <option value="event">Event</option>
                </select>
                <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: '500px' }}>
            {filteredLeads.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="w-10 px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={allLeadsSelected}
                        onChange={handleSelectAll}
                        className="form-checkbox h-4 w-4 text-[#F4A300] rounded"
                      />
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLeads.map(lead => {
                    const isSelected = selectedLeads.some(l => l.id === lead.id);
                    return (
                      <tr 
                        key={lead.id} 
                        className={`hover:bg-gray-50 cursor-pointer ${isSelected ? 'bg-blue-50' : ''}`}
                        onClick={() => handleLeadSelect(lead)}
                      >
                        <td className="w-10 px-3 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="form-checkbox h-4 w-4 text-[#F4A300] rounded pointer-events-none"
                          />
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {lead.name || 'N/A'}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          {lead.phone || 'N/A'}
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            lead.source === 'social_media' ? 'bg-purple-100 text-purple-800' :
                            lead.source === 'cold_call' ? 'bg-blue-100 text-blue-800' :
                            lead.source === 'survey' ? 'bg-green-100 text-green-800' :
                            lead.source === 'referral' ? 'bg-yellow-100 text-yellow-800' :
                            lead.source === 'website' ? 'bg-indigo-100 text-indigo-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {formatSource(lead.source)}
                          </span>
                        </td>
                        <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                            lead.status === 'assigned' ? 'bg-green-100 text-green-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {lead.status || 'unknown'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No leads available for assignment
                <button 
                  onClick={handleRefresh}
                  className="mt-2 flex items-center justify-center mx-auto text-[#F4A300]"
                >
                  <FiRefreshCw className="mr-1" />
                  Refresh
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Assignment Panel Column */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Assignment Details</h2>
            <button
              onClick={handleRefresh}
              className="text-[#F4A300] hover:text-[#e6b82a]"
            >
              <FiRefreshCw />
            </button>
          </div>
          
          {selectedLeads.length > 0 ? (
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium mb-2">Selected Leads ({selectedLeads.length}):</h3>
                <div className="max-h-40 overflow-y-auto">
                  {selectedLeads.map(lead => (
                    <div key={lead.id} className="flex justify-between items-center py-1 border-b border-gray-100">
                      <div>
                        <p className="font-medium truncate">{lead.name || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{formatSource(lead.source)}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLeadSelect(lead);
                        }}
                        className="text-red-400 hover:text-red-600"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agent Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign to Agent:
                </label>
                {agents.length > 0 ? (
                  <div className="relative">
                    <select
                      value={selectedAgent}
                      onChange={(e) => setSelectedAgent(e.target.value)}
                      className="pl-3 pr-8 py-2 border border-gray-300 rounded-md appearance-none w-full"
                    >
                      <option value="">Select Agent</option>
                      {agents.map(agent => (
                        <option key={agent.userId} value={agent.userId}>
                          {agent.name || 'Unnamed Agent'}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                ) : (
                  <div className="text-sm text-yellow-600 p-2 bg-yellow-50 rounded">
                    No agents available
                  </div>
                )}
              </div>

              {/* Assign Button */}
              <button
                onClick={handleAssign}
                disabled={!selectedAgent || isLoading}
                className={`w-full py-2 px-4 rounded-md text-white flex items-center justify-center ${
                  !selectedAgent || isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#F4A300] hover:bg-[#e6b82a]'
                }`}
              >
                {isLoading ? (
                  <>
                    <FiRefreshCw className="animate-spin mr-2" />
                    Assigning...
                  </>
                ) : (
                  <>
                    <FiSend className="mr-2" />
                    Assign {selectedLeads.length} Lead{selectedLeads.length !== 1 ? 's' : ''}
                  </>
                )}
              </button>

              {error && (
                <div className="text-red-500 text-sm mt-2 p-2 bg-red-50 rounded">{error}</div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FiUser className="mx-auto text-4xl text-gray-300 mb-2" />
              <p>Select one or more leads to assign</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupervisorLeads;