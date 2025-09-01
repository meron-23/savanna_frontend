import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FiX } from 'react-icons/fi';

const ManagerDashboard = ({ user }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedData, setSelectedData] = useState([]);
  const [modalTitle, setModalTitle] = useState('');

  // Sample data for charts
  const weeklyVisitsData = [
    { name: 'Team A', visits: 100 },
    { name: 'Team B', visits: 90 },
    { name: 'Team C', visits: 60 },
    { name: 'Team D', visits: 30 }
  ];

  const comparisonData = [
    { name: 'Mon', lastWeek: 40, thisWeek: 45 },
    { name: 'Tue', lastWeek: 35, thisWeek: 42 },
    { name: 'Wed', lastWeek: 50, thisWeek: 55 },
    { name: 'Thu', lastWeek: 45, thisWeek: 50 },
    { name: 'Fri', lastWeek: 30, thisWeek: 38 },
    { name: 'Sat', lastWeek: 20, thisWeek: 25 },
    { name: 'Sun', lastWeek: 15, thisWeek: 18 }
  ];

  const visitsDistribution = [
    { name: 'Site Visits', value: 57 },
    { name: 'Office Visits', value: 19 },
    { name: 'Other', value: 24 }
  ];

  const salesSourceData = [
    { name: 'Sales Team', value: 85 },
    { name: 'Digital Dept', value: 14 },
    { name: 'Other', value: 1 }
  ];

  // Mock data for tables
  const mockProspectsData = [
  { id: 1, name: 'John Doe', phone: '0911223344', interest: 'Apartment', status: 'contacted', date: '2025-09-01', agent: 'Agent 1' }, // today
  { id: 2, name: 'Jane Smith', phone: '0922334455', interest: 'Villa', status: 'interested', date: '2025-09-02', agent: 'Agent 2' },
  { id: 3, name: 'Robert Johnson', phone: '0933445566', interest: 'Commercial', status: 'qualified', date: '2025-09-03', agent: 'Agent 3' },
  { id: 4, name: 'Sarah Williams', phone: '0944556677', interest: 'Apartment', status: 'converted', date: '2025-09-04', agent: 'Agent 1' },
  { id: 5, name: 'Michael Brown', phone: '0955667788', interest: 'Villa', status: 'closed', date: '2025-09-05', agent: 'Agent 2' },
  { id: 6, name: 'Emily Davis', phone: '0966778899', interest: 'Office Space', status: 'interested', date: '2025-09-06', agent: 'Agent 3' },
  { id: 7, name: 'David Wilson', phone: '0977889900', interest: 'Penthouse', status: 'contacted', date: '2025-09-07', agent: 'Agent 2' }
];


  const mockSalesData = [
    { id: 1, property: 'Apartment A1', client: 'John Doe', agent: 'Agent 1', amount: 4500000, date: '2023-10-15', supervisor: 'Supervisor A' },
    { id: 2, property: 'Villa V2', client: 'Jane Smith', agent: 'Agent 2', amount: 12000000, date: '2023-10-16', supervisor: 'Supervisor B' },
    { id: 3, property: 'Commercial C3', client: 'Robert Johnson', agent: 'Agent 3', amount: 8500000, date: '2023-10-17', supervisor: 'Supervisor A' },
    { id: 4, property: 'Apartment A4', client: 'Sarah Williams', agent: 'Agent 1', amount: 5000000, date: '2023-10-18', supervisor: 'Supervisor A' },
    { id: 5, property: 'Villa V5', client: 'Michael Brown', agent: 'Agent 2', amount: 15000000, date: '2023-10-19', supervisor: 'Supervisor B' }
  ];

  const mockVisitsData = [
    { id: 1, type: 'Site Visit', client: 'John Doe', agent: 'Agent 1', property: 'Apartment A1', date: '2023-10-15', supervisor: 'Supervisor A' },
    { id: 2, type: 'Office Visit', client: 'Jane Smith', agent: 'Agent 2', property: 'Villa V2', date: '2023-10-16', supervisor: 'Supervisor B' },
    { id: 3, type: 'Site Visit', client: 'Robert Johnson', agent: 'Agent 3', property: 'Commercial C3', date: '2023-10-17', supervisor: 'Supervisor A' },
    { id: 4, type: 'Office Visit', client: 'Sarah Williams', agent: 'Agent 1', property: 'Apartment A4', date: '2023-10-18', supervisor: 'Supervisor A' },
    { id: 5, type: 'Site Visit', client: 'Michael Brown', agent: 'Agent 2', property: 'Villa V5', date: '2023-10-19', supervisor: 'Supervisor B' }
  ];

  const mockTeamData = [
    { id: 1, name: 'Supervisor A', team: 'Team A', prospects: 45, sales: 12, visits: 25, agents: 5 },
    { id: 2, name: 'Supervisor B', team: 'Team B', prospects: 38, sales: 8, visits: 20, agents: 4 },
    { id: 3, name: 'Supervisor C', team: 'Team C', prospects: 52, sales: 15, visits: 30, agents: 6 },
    { id: 4, name: 'Supervisor D', team: 'Team D', prospects: 41, sales: 10, visits: 22, agents: 5 }
  ];

  const mockAgentData = [
    { id: 1, name: 'Agent 1', team: 'Team A', supervisor: 'Supervisor A', prospects: 15, sales: 5, visits: 10 },
    { id: 2, name: 'Agent 2', team: 'Team A', supervisor: 'Supervisor A', prospects: 12, sales: 3, visits: 8 },
    { id: 3, name: 'Agent 3', team: 'Team B', supervisor: 'Supervisor B', prospects: 18, sales: 6, visits: 12 },
    { id: 4, name: 'Agent 4', team: 'Team B', supervisor: 'Supervisor B', prospects: 10, sales: 2, visits: 6 },
    { id: 5, name: 'Agent 5', team: 'Team C', supervisor: 'Supervisor C', prospects: 20, sales: 7, visits: 15 }
  ];

  const COLORS = ['#333333', '#FFD700', '#F4C430'];

  const handleCardClick = (cardType) => {
    setSelectedCard(cardType);
    
    let data = [];
    let title = '';
    
    switch(cardType) {
      case 'totalProspects':
        data = mockProspectsData;
        title = 'All Prospects';
        break;
      case 'prospectsThisWeek':
        data = mockProspectsData.filter(p => {
          const prospectDate = new Date(p.date);
          const weekStart = new Date();
          weekStart.setDate(weekStart.getDate() - weekStart.getDay());
          return prospectDate >= weekStart;
        });
        title = 'Prospects This Week';
        break;
      case 'prospectsToday':
        data = mockProspectsData.filter(p => {
          const prospectDate = new Date(p.date);
          const today = new Date();
          return prospectDate.toDateString() === today.toDateString();
        });
        title = "Today's Prospects";
        break;
      case 'totalSalesAmount':
        data = mockSalesData;
        title = 'Sales Amount Details';
        break;
      case 'totalSoldProperties':
        data = mockSalesData;
        title = 'Sold Properties';
        break;
      case 'totalSupervisors':
        data = mockTeamData;
        title = 'Supervisors Performance';
        break;
      case 'totalSalesAgents':
        data = mockAgentData;
        title = 'Sales Agents Performance';
        break;
      case 'totalSiteVisits':
        data = mockVisitsData.filter(v => v.type === 'Site Visit');
        title = 'Site Visits';
        break;
      case 'totalOtherVisits':
        data = mockVisitsData.filter(v => v.type === 'Office Visit');
        title = 'Office Visits';
        break;
      case 'todaysActivity':
        data = [...mockVisitsData, ...mockProspectsData].filter(item => {
          const itemDate = new Date(item.date);
          const today = new Date();
          return itemDate.toDateString() === today.toDateString();
        });
        title = "Today's Activity";
        break;
      default:
        data = [];
        title = 'Details';
    }
    
    setSelectedData(data);
    setModalTitle(title);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
    setSelectedData([]);
    setModalTitle('');
  };

  return (
    <div className="p-6">
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome, Back!</h1>
          <p className="text-gray-600">Role: Manager</p>
          <p className="text-gray-800 mt-2">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>
      
      <div className="mb-8">
        {/* Performance Overview */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
          <h4 className="font-medium text-gray-600 mb-4">Role Manager</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div 
              className="bg-[#333333] p-4 rounded-lg cursor-pointer hover:bg-[#444444] transition-colors"
              onClick={() => handleCardClick('totalProspects')}
            >
              <h5 className="text-[#F4A300] mb-2">Total Prospects</h5>
              <p className="text-[#F4A300] text-2xl font-bold">100</p>
            </div>
            <div 
              className="bg-[#333333] p-4 rounded-lg cursor-pointer hover:bg-[#444444] transition-colors"
              onClick={() => handleCardClick('prospectsThisWeek')}
            >
              <h5 className="text-[#F4A300] mb-2">Prospects This Week</h5>
              <p className="text-[#F4A300] text-2xl font-bold">7</p>
            </div>
            <div 
              className="bg-[#333333] p-4 rounded-lg cursor-pointer hover:bg-[#444444] transition-colors"
              onClick={() => handleCardClick('prospectsToday')}
            >
              <h5 className="text-[#F4A300] mb-2">Prospects Today</h5>
              <p className="text-[#F4A300] text-2xl font-bold">1</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div 
              className="bg-[#333333] p-4 rounded-lg cursor-pointer hover:bg-[#444444] transition-colors"
              onClick={() => handleCardClick('totalSalesAmount')}
            >
              <h5 className="text-[#F4A300] mb-2">Total Sales Amount</h5>
              <p className="text-[#F4A300] text-2xl font-bold">160,027,140 ETB</p>
            </div>
            <div 
              className="bg-[#333333] p-4 rounded-lg cursor-pointer hover:bg-[#444444] transition-colors"
              onClick={() => handleCardClick('totalSoldProperties')}
            >
              <h5 className="text-[#F4A300] mb-2">Total Sold Properties</h5>
              <p className="text-[#F4A300] text-2xl font-bold">7</p>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Visits Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Weekly Office & Site Visits per Team</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyVisitsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="visits" fill="#F4C430" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Comparison Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Last Week vs. This Week Visits</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="lastWeek" fill="#F4C430" />
                  <Bar dataKey="thisWeek" fill="#333333" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Stats and Pie Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Visits Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Visits Summary</h3>
            <div className="space-y-4">
              <div 
                className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                onClick={() => handleCardClick('totalSupervisors')}
              >
                <h5 className="text-gray-600">Total Supervisors</h5>
                <p className="text-xl font-bold">2</p>
              </div>
              <div 
                className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                onClick={() => handleCardClick('totalOtherVisits')}
              >
                <h5 className="text-gray-600">Total Office Visits</h5>
                <p className="text-xl font-bold">42</p>
              </div>
              <div 
                className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                onClick={() => handleCardClick('totalSalesAgents')}
              >
                <h5 className="text-gray-600">Total Sales Agents</h5>
                <p className="text-xl font-bold">20</p>
              </div>
              <div 
                className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                onClick={() => handleCardClick('totalSiteVisits')}
              >
                <h5 className="text-gray-600">Total Site Visits</h5>
                <p className="text-xl font-bold">285</p>
              </div>
              <div 
                className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                onClick={() => handleCardClick('todaysActivity')}
              >
                <h5 className="text-gray-600">Today's Activity</h5>
                <p className="text-xl font-bold">350</p>
              </div>
            </div>
          </div>

          {/* Visits Distribution */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Office vs Site Visits Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={visitsDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {visitsDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sales Source */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Sales Source Breakdown</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={salesSourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {salesSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for showing detailed table */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">{modalTitle}</h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-4">
              {selectedData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {selectedCard === 'totalProspects' || selectedCard === 'prospectsThisWeek' || selectedCard === 'prospectsToday' ? (
                          <>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interest</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          </>
                        ) : selectedCard === 'totalSalesAmount' || selectedCard === 'totalSoldProperties' ? (
                          <>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supervisor</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          </>
                        ) : selectedCard === 'totalSiteVisits' || selectedCard === 'totalOtherVisits' || selectedCard === 'todaysActivity' ? (
                          <>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supervisor</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          </>
                        ) : selectedCard === 'totalSupervisors' ? (
                          <>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prospects</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sales</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visits</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agents</th>
                          </>
                        ) : selectedCard === 'totalSalesAgents' ? (
                          <>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supervisor</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prospects</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sales</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visits</th>
                          </>
                        ) : null}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedData.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          {selectedCard === 'totalProspects' || selectedCard === 'prospectsThisWeek' || selectedCard === 'prospectsToday' ? (
                            <>
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.phone}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.interest}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{item.status}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.agent}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                            </>
                          ) : selectedCard === 'totalSalesAmount' || selectedCard === 'totalSoldProperties' ? (
                            <>
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.property}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.client}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.agent}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.supervisor}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.amount.toLocaleString()} ETB</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                            </>
                          ) : selectedCard === 'totalSiteVisits' || selectedCard === 'totalOtherVisits' || selectedCard === 'todaysActivity' ? (
                            <>
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.type}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.client}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.agent}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.supervisor}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.property}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                            </>
                          ) : selectedCard === 'totalSupervisors' ? (
                            <>
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.team}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.prospects}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.sales}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.visits}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.agents}</td>
                            </>
                          ) : selectedCard === 'totalSalesAgents' ? (
                            <>
                              <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.team}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.supervisor}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.prospects}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.sales}</td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.visits}</td>
                            </>
                          ) : null}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex justify-center items-center h-32">
                  <p className="text-gray-500">No data available</p>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Showing {selectedData.length} records
              </p>
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;