import React, { useState, useEffect } from 'react';

// Import your local data
import localData from '../../data.json';

const AssignedLeadsTable = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

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

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-full flex justify-center items-center h-48">
        <p className="text-gray-600 text-lg text-center">
          No leads are currently assigned to you. Check back later!
        </p>
        {currentUser && (
          <p className="text-sm text-gray-500 mt-2">User ID: {currentUser.userId}</p>
        )}
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
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
          {leads.length} {leads.length === 1 ? 'lead' : 'leads'}
        </span>
      </div>

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