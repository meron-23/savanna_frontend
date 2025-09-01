import React, { useState, useEffect } from 'react';

// Import your local data
import localData from '../../data.json';

const AssignedLeadsTable = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    phone: '',
    interest: '',
    status: 'new',
    source: 'website'
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    // Get user data from localStorage
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName') || localStorage.getItem('name');
    const userRole = localStorage.getItem('userRole') || localStorage.getItem('role');

    if (userId && userName && userRole) {
      setCurrentUser({
        userId,
        name: userName,
        role: userRole,
      });
    } else {
      // For demo purposes, set a default user if none is found
      setCurrentUser({
        userId: "pdHpZXgh03gM5Jslp4A7jstFyeb2",
        name: "Yibeltal Degu",
        role: "Sales Agent"
      });
    }
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);
    
    try {
      // Get leads from local data
      const leadsData = localData.leads || [];
      
      // Get prospects from local data
      const prospectsData = localData.prospects || [];
      
      // Get users from local data
      const usersData = localData.users || [];
      
      // Combine leads with prospect and agent data
      const combinedLeads = leadsData.map(lead => {
        // Find the corresponding prospect
        const prospect = prospectsData.find(p => p.id === lead.prospect_id) || {};
        
        // Find the corresponding agent
        const agent = usersData.find(u => u.userId === prospect.userId) || {};
        
        return {
          lead_id: lead.id,
          lead_name: lead.name,
          phone: lead.phone,
          lead_interest: lead.interest,
          status: lead.status,
          date_added: lead.date_added,
          source: lead.source,
          prospect_name: prospect.name,
          method: prospect.method,
          site: prospect.site,
          agent_id: prospect.userId,
          agent_name: agent.name
        };
      });

      // Filter leads for the current user
      const userLeads = combinedLeads.filter(
        lead => lead.agent_id === currentUser.userId
      );

      setLeads(userLeads);
    } catch (err) {
      console.error('Failed to process leads:', err);
      setError('Failed to load leads. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const handleCallLead = (phoneNumber) => {
    if (!phoneNumber) {
      alert('No phone number available for this lead');
      return;
    }
    
    // Clean the phone number (remove all non-numeric characters)
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
    
    // Create the tel: link
    const telLink = `tel:${cleanedPhoneNumber}`;
    
    // Open the dialer (works on mobile devices)
    window.location.href = telLink;
    
    // For desktop browsers, we can show a message
    if (!/Mobi|Android/i.test(navigator.userAgent)) {
      alert(`Call ${phoneNumber} from your phone`);
    }
  };

  const handleAddLead = () => {
    // Validate form
    const errors = {};
    if (!newLead.name) errors.name = 'Name is required';
    if (!newLead.phone) errors.phone = 'Phone number is required';
    if (!newLead.interest) errors.interest = 'Interest is required';
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    // Clear errors
    setFormErrors({});
    
    // Create a new lead object
    const newLeadData = {
      id: Math.max(...localData.leads.map(lead => lead.id), 0) + 1,
      prospect_id: Math.max(...localData.prospects.map(prospect => prospect.id), 0) + 1,
      name: newLead.name,
      phone: newLead.phone,
      interest: newLead.interest,
      status: newLead.status,
      date_added: new Date().toISOString(),
      source: newLead.source
    };
    
    // Create a new prospect object
    const newProspectData = {
      id: newLeadData.prospect_id,
      name: newLead.name,
      userId: currentUser.userId,
      method: "Manual Entry",
      site: "N/A"
    };
    
    // In a real application, you would send this data to your backend API
    // For this demo, we'll update the local state and show a success message
    
    // Update leads array
    const updatedLeads = [...leads, {
      lead_id: newLeadData.id,
      lead_name: newLeadData.name,
      phone: newLeadData.phone,
      lead_interest: newLeadData.interest,
      status: newLeadData.status,
      date_added: newLeadData.date_added,
      source: newLeadData.source,
      prospect_name: newProspectData.name,
      method: newProspectData.method,
      site: newProspectData.site,
      agent_id: currentUser.userId,
      agent_name: currentUser.name
    }];
    
    setLeads(updatedLeads);
    
    // Reset form and close modal
    setNewLead({
      name: '',
      phone: '',
      interest: '',
      status: 'new',
      source: 'website'
    });
    setShowAddLeadModal(false);
    
    // Show success message
    alert('Lead added successfully!');
  };

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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-full flex justify-center items-center h-48">
        <p className="text-blue-700 text-lg">Loading your leads...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-full flex justify-center items-center h-48">
        <p className="text-red-500 text-lg font-medium">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-full overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-[#333333]">Your Assigned Leads</h2>
          {currentUser && (
            <p className="text-sm text-gray-500">Logged in as: {currentUser.name} ({currentUser.role})</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
            {leads.length} {leads.length === 1 ? 'lead' : 'leads'}
          </span>
          <button
            onClick={() => setShowAddLeadModal(true)}
            className="bg-[#F4A300] hover:bg-[#333333] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Add Lead
          </button>
        </div>
      </div>

      {leads.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-full flex justify-center items-center h-48">
          <p className="text-gray-600 text-lg text-center">
            No leads are currently assigned to you. Check back later!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap sm:px-4">Lead</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap sm:px-4">Phone</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-4">Prospect Source</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-4">Status</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap sm:px-4">Date Added</th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap sm:px-4">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leads.map((lead) => (
                <tr key={lead.lead_id} className="hover:bg-gray-50">
                  <td className="px-3 py-3 whitespace-nowrap sm:px-4">
                    <div className="font-medium text-gray-900">{lead.lead_name}</div>
                    <div className="text-xs text-gray-500 line-clamp-1">{lead.lead_interest}</div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 sm:px-4">
                    {lead.phone}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-500 sm:px-4">
                    <div className="font-medium">{lead.prospect_name || lead.lead_name}</div>
                    <div className="text-xs text-gray-400">{lead.method} • {lead.site}</div>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap sm:px-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(lead.status)}`}>
                      {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 sm:px-4">
                    {new Date(lead.date_added).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 sm:px-4">
                    <button
                      onClick={() => handleCallLead(lead.phone)}
                      className="bg-[#F4A300] hover:bg-[#e69500] text-white px-3 py-1 rounded text-sm"
                    >
                      Call
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddLeadModal && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Add New Lead</h3>
                <button
                  onClick={() => setShowAddLeadModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
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
                    className={`w-full px-3 py-2 border rounded-md ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
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
                    className={`w-full px-3 py-2 border rounded-md ${formErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
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
                    className={`w-full px-3 py-2 border rounded-md ${formErrors.interest ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="e.g., Apartment, Commercial Property"
                  />
                  {formErrors.interest && <p className="mt-1 text-sm text-red-600">{formErrors.interest}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={newLead.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="interested">Interested</option>
                    <option value="qualified">Qualified</option>
                    <option value="converted">Converted</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  <select
                    name="source"
                    value={newLead.source}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="website">Website</option>
                    <option value="referral">Referral</option>
                    <option value="walk-in">Walk-in</option>
                    <option value="social-media">Social Media</option>
                    <option value="other">Other</option>
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
                  onClick={handleAddLead}
                  className="px-4 py-2 bg-[#F4A300] text-white rounded-md hover:bg-[#333333]"
                >
                  Add Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const getStatusColor = (status) => {
  const normalizedStatus = status ? status.toLowerCase() : 'new';
  switch (normalizedStatus) {
    case 'new': return 'bg-blue-100 text-blue-800';
    case 'contacted': return 'bg-purple-100 text-purple-800';
    case 'interested': return 'bg-yellow-100 text-yellow-800';
    case 'qualified': return 'bg-green-100 text-green-800';
    case 'converted': return 'bg-indigo-100 text-indigo-800';
    case 'closed': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default AssignedLeadsTable;