import React, { useState, useEffect, useMemo } from 'react';
import { FiUser, FiSend, FiX, FiSearch, FiRefreshCw, FiChevronDown, FiPlus, FiUpload } from 'react-icons/fi';
import * as XLSX from 'xlsx';

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
    const [showAddLeadModal, setShowAddLeadModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [newLead, setNewLead] = useState({
        name: '',
        phone: '',
        interest: '',
        source: 'website',
        status: 'new'
    });
    const [formErrors, setFormErrors] = useState({});

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

    // Handle adding a new lead
    const handleAddNewLead = () => {
        // Validate form
        const errors = {};
        if (!newLead.name.trim()) errors.name = 'Name is required';
        if (!newLead.phone.trim()) errors.phone = 'Phone number is required';
        if (!newLead.interest.trim()) errors.interest = 'Interest is required';

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        // Clear errors
        setFormErrors({});

        // Create a new lead object
        const newLeadData = {
            id: Math.max(...leads.map(lead => lead.id), 0) + 1,
            name: newLead.name,
            phone: newLead.phone,
            interest: newLead.interest,
            source: newLead.source,
            status: newLead.status,
            date_added: new Date().toISOString()
        };

        // Add the new lead to the leads array
        const updatedLeads = [...leads, newLeadData];
        setLeads(updatedLeads);

        // Reset form and close modal
        setNewLead({
            name: '',
            phone: '',
            interest: '',
            source: 'website',
            status: 'new'
        });
        setShowAddLeadModal(false);

        // Show success message
        alert('Lead added successfully!');
    };

    // Handle importing leads from a spreadsheet
    const handleImportLeads = (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

            if (data.length <= 1) {
                alert('No data found in the spreadsheet.');
                return;
            }

            // Assume the first row is headers: 'Name', 'Phone', 'Interest', 'Source'
            const headers = data[0].map(h => h.trim().toLowerCase());
            const leadsToImport = data.slice(1).map((row, index) => {
                const newLead = {
                    id: leads.length + index + 1, // Simple ID generation
                    name: row[headers.indexOf('name')] || 'Unnamed',
                    phone: row[headers.indexOf('phone')] || 'N/A',
                    interest: row[headers.indexOf('interest')] || 'N/A',
                    source: row[headers.indexOf('source')] ? row[headers.indexOf('source')].toLowerCase() : 'excel_import',
                    status: 'new',
                    date_added: new Date().toISOString()
                };
                return newLead;
            }).filter(lead => lead.phone !== 'N/A'); // Filter out invalid leads

            if (leadsToImport.length > 0) {
                setLeads(prevLeads => [...prevLeads, ...leadsToImport]);
                alert(`${leadsToImport.length} leads imported successfully!`);
            } else {
                alert('No valid leads found in the spreadsheet.');
            }

            setShowImportModal(false);
            e.target.value = ''; // Reset file input
        };
        reader.readAsBinaryString(file);
    };

    // Handle input change for new lead form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewLead({
            ...newLead,
            [name]: value
        });

        // Clear error when field is updated
        if (formErrors[name]) {
            setFormErrors({
                ...formErrors,
                [name]: ''
            });
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
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Viewing and managing leads assignment</h1>
            </div>

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
                            <button
                                onClick={() => setShowAddLeadModal(true)}
                                className="bg-[#F4A300] hover:bg-[#333333] text-white px-4 py-2 rounded-md flex items-center"
                            >
                                <FiPlus className="mr-2" />
                                Add New Lead
                            </button>
                            <button
                                onClick={() => setShowImportModal(true)}
                                className="bg-blue-600 hover:bg-[#333333] text-white px-4 py-2 rounded-md flex items-center"
                            >
                                <FiUpload className="mr-2" />
                                Import Leads
                            </button>
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
                                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest</th>
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
                                                    {lead.interest || 'N/A'}
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

            {/* Add New Lead Modal */}
            {showAddLeadModal && (
                <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800">Add New Lead</h3>
                                <button
                                    onClick={() => setShowAddLeadModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <FiX className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={newLead.name}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-3 border rounded-md ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Enter lead's name"
                                    />
                                    {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={newLead.phone}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-3 border rounded-md ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Enter phone number"
                                    />
                                    {formErrors.phone && <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Interest *</label>
                                    <input
                                        type="text"
                                        name="interest"
                                        value={newLead.interest}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-3 border rounded-md ${formErrors.interest ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="e.g., Apartment, Commercial Property"
                                    />
                                    {formErrors.interest && <p className="mt-1 text-sm text-red-600">{formErrors.interest}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                                    <select
                                        name="source"
                                        value={newLead.source}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-md"
                                    >
                                        <option value="website">Website</option>
                                        <option value="social_media">Social Media</option>
                                        <option value="cold_call">Cold Call</option>
                                        <option value="survey">Survey</option>
                                        <option value="referral">Referral</option>
                                        <option value="event">Event</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        name="status"
                                        value={newLead.status}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-md"
                                    >
                                        <option value="new">New</option>
                                        <option value="assigned">Assigned</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowAddLeadModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddNewLead}
                                    className="px-4 py-2 bg-[#F4A300] text-white rounded-md hover:bg-[#e69500]"
                                >
                                    Add Lead
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Import Leads Modal */}
            {showImportModal && (
                <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-gray-800">Import Leads from Excel</h3>
                                <button
                                    onClick={() => setShowImportModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <FiX className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <p className="text-sm text-gray-600">
                                    Please ensure your spreadsheet has columns named exactly: <strong>Name</strong>, <strong>Phone</strong>, <strong>Interest</strong>, and <strong>Source</strong>.
                                </p>
                                <label className="block w-full py-4 px-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-[#F4A300] transition-colors">
                                    <FiUpload className="mx-auto text-3xl text-gray-400 mb-2" />
                                    <p className="font-medium text-gray-700">Click to upload or drag & drop</p>
                                    <p className="text-sm text-gray-500">.xlsx or .csv file</p>
                                    <input
                                        type="file"
                                        accept=".xlsx, .xls, .csv"
                                        onChange={handleImportLeads}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    onClick={() => setShowImportModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupervisorLeads;