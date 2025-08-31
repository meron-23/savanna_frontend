import React, { useState, useEffect, useCallback, useMemo } from 'react';

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
      "supervisor": "Alex Johnson",
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
      "supervisor": "Alex Johnson",
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
      "supervisor": "Emily Watson",
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
  ]
};

const RegisterUser = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [supervisors, setSupervisors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const itemsPerPage = 5;

  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    gender: '',
    phoneNumber: '',
    role: '',
    supervisor: '',
  });

  const loadUsers = useCallback(() => {
    try {
      const users = mockData.users || [];
      
      const mappedUsers = users.map(item => ({
        id: item.userId,
        name: item.name || '',
        email: item.email || '',
        gender: item.gender || 'Other',
        phone: item.phoneNumber || '',
        role: item.role || '',
        supervisor: item.supervisor || 'N/A',
      }));

      setTeamMembers(mappedUsers);

      const uniqueSupervisors = [...new Set(
        users
          .filter(user => user.role === 'Supervisor')
          .map(user => user.name)
      )].sort();
      setSupervisors(['N/A', ...uniqueSupervisors]);

    } catch (error) {
      console.error("Failed to load users:", error);
      setError(`Failed to load users: ${error.message}.`);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredMembers = useMemo(() => {
    if (!searchTerm.trim()) return teamMembers;
    
    const searchLower = searchTerm.toLowerCase();
    return teamMembers.filter(member => (
      member.name.toLowerCase().includes(searchLower) ||
      member.email.toLowerCase().includes(searchLower) ||
      member.phone.toLowerCase().includes(searchLower)
    ));
  }, [teamMembers, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedMembers([]);
    setIsSelectAll(false);
  }, [searchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleNewMemberChange = (e) => {
    const { name, value } = e.target;
    setNewMember(prev => ({ ...prev, [name]: value }));
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewMember({ name: '', email: '', gender: '', phoneNumber: '', role: '', supervisor: '' });
  };

  // Handle individual selection
  const handleSelectMember = (memberId) => {
    setSelectedMembers(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
  };

  // Handle select all on current page
  const handleSelectAll = () => {
    if (isSelectAll) {
      setSelectedMembers([]);
    } else {
      const currentPageIds = currentMembers.map(member => member.id);
      setSelectedMembers(currentPageIds);
    }
    setIsSelectAll(!isSelectAll);
  };

  // Handle mass deletion
  const handleMassDelete = () => {
    if (selectedMembers.length === 0) {
      setError("Please select at least one member to delete.");
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedMembers.length} team member(s)?`)) {
      const updatedMembers = teamMembers.filter(member => !selectedMembers.includes(member.id));
      setTeamMembers(updatedMembers);
      setSelectedMembers([]);
      setIsSelectAll(false);
      setSuccessMessage(`Successfully deleted ${selectedMembers.length} team member(s).`);
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    }
  };

  // Handle single deletion
  const handleSingleDelete = (memberId, memberName) => {
    if (window.confirm(`Are you sure you want to delete ${memberName}?`)) {
      const updatedMembers = teamMembers.filter(member => member.id !== memberId);
      setTeamMembers(updatedMembers);
      setSelectedMembers(prev => prev.filter(id => id !== memberId));
      setSuccessMessage(`Successfully deleted ${memberName}.`);
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    }
  };

  const handleAddMemberSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    if (!newMember.name || !newMember.email || !newMember.role) {
      setError('Name, email, and role are required');
      setIsLoading(false);
      return;
    }

    if (teamMembers.some(member => member.email.toLowerCase() === newMember.email.toLowerCase())) {
      setError('Email already exists');
      setIsLoading(false);
      return;
    }

    const newUserId = `user_${Date.now()}`;
    
    const newUser = {
      userId: newUserId,
      name: newMember.name.trim(),
      email: newMember.email.trim().toLowerCase(),
      phoneNumber: newMember.phoneNumber || '',
      gender: newMember.gender || 'Other',
      role: newMember.role,
      supervisor: newMember.role === 'Supervisor' ? null : (newMember.supervisor === 'N/A' ? null : newMember.supervisor),
      password: '123456',
      is_active: true,
      login_method: 'email',
      creationTime: new Date().toISOString(),
      lastSignInTime: new Date().toISOString()
    };

    const updatedMembers = [...teamMembers, {
      id: newUserId,
      name: newUser.name,
      email: newUser.email,
      gender: newUser.gender,
      phone: newUser.phoneNumber,
      role: newUser.role,
      supervisor: newUser.supervisor || 'N/A'
    }];
    
    setTeamMembers(updatedMembers);
    
    if (newUser.role === 'Supervisor' && !supervisors.includes(newUser.name)) {
      setSupervisors(prev => [...prev, newUser.name].sort());
    }

    setSuccessMessage('User created successfully! Default password: 123456');
    closeModal();
    setIsLoading(false);

    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  const totalMembersCount = teamMembers.length;
  const supervisorsCount = teamMembers.filter(member => member.role === 'Supervisor').length;
  const salesAgentsCount = teamMembers.filter(member => 
    member.role === 'SalesAgent' || member.role === 'Sales' || member.role === 'Agent'
  ).length;

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-inter">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          body { font-family: 'Inter', sans-serif; }
          .modal-backdrop {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 极0.5);
            z-index: 1000;
          }
          .modal-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            padding: 2rem;
            border-radius: 0.5rem;
            z-index: 1001;
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
          }
        `}
      </style>

      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Team Management</h1>

        {successMessage && (
          <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg shadow-md mb-6 flex items-center justify-between">
            <p className="text-sm font-medium">{successMessage}</p>
            <button onClick={() => setSuccessMessage(null)} className="text-green-800 hover:text-green-900 focus:outline-none">
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-4 text-gray极-700">Loading team members...</div>
        )}
        {error && (
          <div className="text-center py-4 text-red-600 font-medium">{error}</div>
        )}

        {!isLoading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-[#333333] p-6 rounded-lg shadow-md flex items-center">
                <div className="text-[#F4A300] rounded-full p-3 mr-4">
                  <i className="fas fa-users text-2xl"></i>
                </div>
                <div>
                  <p className="text-[#F4A300]">Total Members</p>
                  <p className="text-2xl font-bold text-[#F4A300]">{totalMembersCount}</p>
                </div>
              </div>
              <div className="bg-[#333333] p-6 rounded-lg shadow-md flex items-center">
                <div className="text-[#F4A300] rounded-full p-3 mr-4">
                  <i className="fas fa-user-tie text-2xl"></i>
                </div>
                <div>
                  <p className="text-[#F4A300]">Supervisors</p>
                  <p className="text-2xl font-bold text-[#F4A300]">{supervisorsCount}</p>
                </div>
              </div>
              <div className="bg-[#333333] p-6 rounded-lg shadow-md flex items-center">
                <div className="text-[#F4A300] rounded-full p-3 mr-4">
                  <i className="fas fa-user-tag text-2xl"></i>
                </div>
                <div>
                  <p className="text-[#F4A300]">Sales Agents</p>
                  <p className="text-2xl font-bold text-[#F4A300]">{salesAgentsCount}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 mb-3 sm:mb-0">Team Members</h2>
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <div className="relative w-full sm:w-72">
                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="text"
                      placeholder="Search by name, email or phone"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F4A300] focus:border-[#F4A300]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                  <button
                    onClick={openModal}
                    className="bg-[#F4A300] text-white px-4 py-2 rounded-lg shadow-md hover:bg-[#333333] focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out flex items-center"
                  >
                    <i className="fas fa-user-plus mr-2"></i>
                    <span className="hidden sm:inline">Add Member</span>
                  </button>
                  {selectedMembers.length > 0 && (
                    <button
                      onClick={handleMassDelete}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-150 ease-in-out flex items-center"
                    >
                      <i className="fas fa-trash mr-2"></i>
                      <span>Delete ({selectedMembers.length})</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          checked={isSelectAll}
                          onChange={handleSelectAll}
                          className="form-checkbox h-4 w-4 text-[#F4A300] rounded"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium极 text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentMembers.length > 0 ? (
                      currentMembers.map((member) => (
                        <tr key={member.id}>
                          <td className="w-12 px-4 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedMembers.includes(member.id)}
                              onChange={() => handleSelectMember(member.id)}
                              className="form-checkbox h-4 w-4 text-[#F4A300] rounded"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{member.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
                              member.gender === 'Male' ? 'bg-blue-100 text-blue-800' : 
                              member.gender === 'Female' ? 'bg-pink-100 text-pink-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {member.gender}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.phone}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
                              member.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 
                              member.role === 'Supervisor' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {member.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.supervisor}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleSingleDelete(member.id, member.name)}
                              className="text-red-600 hover:text-red-900 focus:outline-none"
                              title="Delete member"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                          No team members found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="mt-4 flex justify-end items-center">
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-极500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    {[...Array(totalPages).keys()].map(number => (
                      <button
                        key={number + 1}
                        onClick={() => paginate(number + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === number + 1 
                            ? 'bg-[#F4A300] text-white border-[#F4A300]' 
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {number + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </>
        )}

        {/* Add Member Modal */}
        {isModalOpen && (
          <>
            <div className="modal-backdrop" onClick={closeModal}></div>
            <div className="modal-container">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Add New Team Member</h2>
                <button onClick极={closeModal} className="text-gray-500 hover:text-gray-700">
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <form onSubmit={handleAddMemberSubmit} className="space-y-4">
                <div>
                  <label htmlFor="newName" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    id="newName"
                    name极="name"
                    value={newMember.name}
                    onChange={handleNewMemberChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F4A300] focus:border-[#F4A300]"
                    placeholder="Enter Name"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="newEmail"
                    name="email"
                    value={newMember.email}
                    onChange={handleNewMemberChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F4A300] focus:border-[#F4极A300]"
                    placeholder="Enter Email"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="newGender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    id="newGender"
                    name="gender"
                    value={newMember.gender}
                    onChange={handleNewMemberChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F4A300] focus:border-[#F4A300]"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="newPhoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    id="newPhoneNumber"
                    name="phoneNumber"
                    value={newMember.phoneNumber}
                    onChange={handleNewMemberChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2极 focus:ring-[#F4A300] focus:border-[#F4A300]"
                    placeholder="Phone Number"
                  />
                </div>
                
                <div>
                  <label htmlFor="newRole" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select
                    id="newRole"
                    name="role"
                    value={newMember.role}
                    onChange={handleNewMemberChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F4A300] focus:border-[#F4A300]"
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="Agent">Sales Agent</option>
                    <option value="Supervisor">Supervisor</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                
                {newMember.role !== 'Supervisor' && newMember.role !== 'Admin' && (
                  <div>
                    <label htmlFor="newSupervisor" className="block text-sm font-medium text-gray-700 mb-1">Supervisor</label>
                    <select
                      id="newSupervisor"
                      name="supervisor"
                      value={newMember.supervisor}
                      onChange={handleNewMemberChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F4A300] focus:border-[#F4A300]"
                    >
                      {supervisors.map((sup, index) => (
                        <option key={index} value={sup}>{sup}</option>
                      ))}
                    </select>
                  </div>
                )}
                
                {error && (
                  <div className="text-red-500 text-sm">{error}</div>
                )}
                
                <div className="flex justify-end space极-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F4A300]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#F4A300] hover:bg-[#333333] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F4A300]"
                  >
                    Add Member
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterUser;