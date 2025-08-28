import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Pencil, CircleAlert, X, PlusCircle } from 'lucide-react';

// Import your local data
import localData from '../../data.json';

// A simple component to display the colored role labels
const RoleBadge = ({ role }) => {
  let colorClass = '';
  switch (role) {
    case 'Supervisor':
      colorClass = 'bg-gray-200 text-gray-800'; // Neutral for supervisor
      break;
    case 'Sales Agent':
    case 'SalesAgent':
      colorClass = 'bg-[#F4A300] bg-opacity-20 text-[#F4A300]'; // Saffron tint for sales agent
      break;
    case 'Male': // For gender display
    case 'Female': // For gender display
      colorClass = 'bg-gray-200 text-gray-800'; // Neutral for gender
      break;
    default:
      colorClass = 'bg-gray-100 text-gray-800';
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {role}
    </span>
  );
};

const RegisterAgents = ({ isSidebarOpen }) => {
  const [supervisorId, setSupervisorId] = useState('b4dca99f-e397-4d98-9b45-bb5a');
  const [teamMembers, setTeamMembers] = useState([]);
  const [unassignedAgents, setUnassignedAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);

  // Load data from local JSON
  useEffect(() => {
    const loadAgents = () => {
      try {
        const users = localData.users || [];
        
        // Filter team members for the supervisor
        const supervisorTeam = users.filter(user => 
          user.supervisor === supervisorId || user.supervisor_id === supervisorId
        );
        
        setTeamMembers(supervisorTeam);
        
        // Find unassigned agents (no supervisor)
        const unassigned = users.filter(user => 
          (!user.supervisor || user.supervisor === '') && 
          (user.role === 'Sales Agent' || user.role === 'SalesAgent' || user.role === 'Agent')
        );
        
        setUnassignedAgents(unassigned);
        setMessage('');
      } catch (error) {
        console.error("Error loading agents:", error);
        setMessage('Failed to load agents data.');
        setTeamMembers([]);
        setUnassignedAgents([]);
      }
    };

    loadAgents();
  }, [supervisorId]);

  const handleAssignAgent = (agentId) => {
    setIsLoading(true);
    setMessage('Assigning agent...');

    try {
      // Update the agent's supervisor in local state
      const updatedUnassignedAgents = unassignedAgents.filter(agent => agent.userId !== agentId);
      const assignedAgent = unassignedAgents.find(agent => agent.userId === agentId);
      
      if (assignedAgent) {
        // Update the agent's supervisor
        const updatedAgent = {
          ...assignedAgent,
          supervisor: supervisorId
        };
        
        // Add to team members
        setTeamMembers(prev => [...prev, updatedAgent]);
        setUnassignedAgents(updatedUnassignedAgents);
        
        setMessage('Agent assigned successfully!');
        setIsAssignmentModalOpen(false);
      } else {
        setMessage('Agent not found.');
      }
    } catch (error) {
      console.error("Error assigning agent:", error);
      setMessage('Error assigning agent. Please try again.');
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className={`p-8 bg-gray-100 min-h-screen font-inter transition-all duration-300 ease-in-out ${isSidebarOpen ? 'md:pl-64' : 'md:pl-20'}`}>
      
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Team Management</h1>

      {/* Loading and Message Modal */}
      {message && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-3">
            <CircleAlert className="w-6 h-6 text-[#F4A300]" />
            <p className="text-gray-800">{message}</p>
          </div>
        </div>
      )}

      {/* Team Members Table Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Team Members ({teamMembers.length})</h2>
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <div className="w-10 h-10 border-4 border-t-4 border-[#F4A300] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teamMembers.map((member) => (
                  <tr key={member.userId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-500">{member.email}</span>
                      </div>
                    </td>
                    <td className="px极-6 py-4 whitespace-nowrap">
                      <RoleBadge role={member.gender} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.phoneNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RoleBadge role={member.role} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.supervisor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-[#F4A300] hover:text-orange-700">
                        <Pencil className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Button to open Assign Team Member Modal */}
      <div className="text-center mt-8">
        <button
          onClick={() => {
            setIsAssignmentModalOpen(true);
          }}
          className="bg-[#F4A300] text-white py-3 px-6 rounded-lg font-semibold hover:bg-orange-700 transition-colors duration-200 shadow-md"
        >
          <PlusCircle className="inline-block h-5 w-5 mr-2" />
          Assign Existing Agent
        </button>
      </div>

      {/* Assign Existing Team Member Modal */}
      {isAssignmentModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg relative">
            <button
              onClick={() => setIsAssignmentModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-sem极old text-gray-700 mb-6">Assign an Unassigned Agent</h2>
            {unassignedAgents.length > 0 ? (
              <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {unassignedAgents.map((agent) => (
                  <li key={agent.userId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
                    <div>
                      <p className="font-semibold text-gray-900">{agent.name}</p>
                      <p className="text-sm text-gray-500">{agent.email}</p>
                      <p className="text-xs text-gray-400">{agent.role}</p>
                    </div>
                    <button
                      onClick={() => handleAssignAgent(agent.userId)}
                      className="ml-4 bg-[#F4A300] text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-orange-700 transition-colors"
                      disabled={isLoading}
                    >
                      Assign
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">No unassigned agents are currently available.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterAgents;