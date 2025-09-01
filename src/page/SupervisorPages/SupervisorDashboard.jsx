import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FiX } from 'react-icons/fi';

const API_BASE_URL = 'http://localhost:5000/api';
const COLORS = ['#333333', '#FFD700', '#F4C430', '#FF8042'];

const SupervisorDashboard = ({ user }) => {
  const [dashboardData, setDashboardData] = useState({
    loading: true,
    error: null,
    stats: {
      totalProspects: 7435,
      totalFeedbacks: 198,
      officeVisits: 65,
      totalSales: 7,
      siteVisits: 285,
      salesAmount: 160027140
    },
    agentsPerformance: [
      { name: 'Team A', totalSales: 100, officeVisits: 45, siteVisits: 55 },
      { name: 'Team B', totalSales: 90, officeVisits: 42, siteVisits: 48 },
      { name: 'Team C', totalSales: 60, officeVisits: 30, siteVisits: 30 },
      { name: 'Team D', totalSales: 30, officeVisits: 15, siteVisits: 15 }
    ],
    visitDistribution: [
      { name: 'Site Visits', value: 57 },
      { name: 'Office Visits', value: 19 },
      { name: 'Other', value: 24 }
    ],
    salesTrend: [
      { name: 'Mon', sales: 40 },
      { name: 'Tue', sales: 35 },
      { name: 'Wed', sales: 50 },
      { name: 'Thu', sales: 45 },
      { name: 'Fri', sales: 30 },
      { name: 'Sat', sales: 20 },
      { name: 'Sun', sales: 15 }
    ],
    recentFeedbacks: []
  });

  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date()
  });

  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedData, setSelectedData] = useState([]);
  const [modalTitle, setModalTitle] = useState('');

  // Mock data for demonstration
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
    { id: 1, property: 'Apartment A1', client: 'John Doe', agent: 'Agent 1', amount: 4500000, date: '2023-10-15' },
    { id: 2, property: 'Villa V2', client: 'Jane Smith', agent: 'Agent 2', amount: 12000000, date: '2023-10-16' },
    { id: 3, property: 'Commercial C3', client: 'Robert Johnson', agent: 'Agent 3', amount: 8500000, date: '2023-10-17' },
    { id: 4, property: 'Apartment A4', client: 'Sarah Williams', agent: 'Agent 1', amount: 5000000, date: '2023-10-18' },
    { id: 5, property: 'Villa V5', client: 'Michael Brown', agent: 'Agent 2', amount: 15000000, date: '2023-10-19' }
  ];

  const mockVisitsData = [
    { id: 1, type: 'Site Visit', client: 'John Doe', agent: 'Agent 1', property: 'Apartment A1', date: '2023-10-15' },
    { id: 2, type: 'Office Visit', client: 'Jane Smith', agent: 'Agent 2', property: 'Villa V2', date: '2023-10-16' },
    { id: 3, type: 'Site Visit', client: 'Robert Johnson', agent: 'Agent 3', property: 'Commercial C3', date: '2023-10-17' },
    { id: 4, type: 'Office Visit', client: 'Sarah Williams', agent: 'Agent 1', property: 'Apartment A4', date: '2023-10-18' },
    { id: 5, type: 'Site Visit', client: 'Michael Brown', agent: 'Agent 2', property: 'Villa V5', date: '2023-10-19' }
  ];

  const mockAgentsData = [
    { id: 1, name: 'Agent 1', team: 'Team A', prospects: 45, sales: 12, visits: 25 },
    { id: 2, name: 'Agent 2', team: 'Team A', prospects: 38, sales: 8, visits: 20 },
    { id: 3, name: 'Agent 3', team: 'Team B', prospects: 52, sales: 15, visits: 30 },
    { id: 4, name: 'Agent 4', team: 'Team B', prospects: 41, sales: 10, visits: 22 },
    { id: 5, name: 'Agent 5', team: 'Team C', prospects: 35, sales: 7, visits: 18 }
  ];

  const mockTodaysActivityData = [
    { id: 1, type: 'Site Visit', client: 'Michael Brown', agent: 'Agent 2', property: 'Villa V5', time: '09:30 AM' },
    { id: 2, type: 'Follow-up Call', client: 'Sarah Williams', agent: 'Agent 1', property: 'Apartment A4', time: '11:15 AM' },
    { id: 3, type: 'New Prospect', client: 'Emily Johnson', agent: 'Agent 3', property: 'Commercial C3', time: '02:45 PM' },
    { id: 4, type: 'Office Visit', client: 'David Wilson', agent: 'Agent 4', property: 'Villa V6', time: '04:00 PM' }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        setDashboardData(prev => ({ ...prev, loading: true, error: null }));
        
        // For now using mock data
        setTimeout(() => {
          setDashboardData(prev => ({ ...prev, loading: false }));
        }, 1000);
      } catch (error) {
        setDashboardData(prev => ({
          ...prev,
          loading: false,
          error: error.response?.data?.message || 'Failed to load dashboard data'
        }));
      }
    };

    loadData();
  }, [dateRange]);

  const handleDateChange = (e, type) => {
    setDateRange(prev => ({
      ...prev,
      [type]: new Date(e.target.value)
    }));
  };

  const handleCardClick = (cardType) => {
    setSelectedCard(cardType);
    
    let data = [];
    let title = '';
    
    switch(cardType) {
      case 'totalProspects':
        data = mockProspectsData;
        title = 'All Prospects';
        break;
      case 'totalFeedbacks':
        data = mockProspectsData.filter(p => p.status === 'contacted' || p.status === 'interested');
        title = 'Prospects This Week';
        break;
      case 'officeVisits':
        data = mockProspectsData.filter(p => {
          const prospectDate = new Date(p.date);
          const today = new Date();
          return prospectDate.toDateString() === today.toDateString();
        });
        title = 'Prospects Today';
        break;
      case 'totalSales':
        data = mockSalesData;
        title = 'Total Sales';
        break;
      case 'siteVisits':
        data = mockVisitsData.filter(v => v.type === 'Site Visit');
        title = 'Site Visits';
        break;
      case 'salesAmount':
        data = mockSalesData;
        title = 'Sales Amount Details';
        break;
      case 'totalAgents':
        data = mockAgentsData;
        title = 'All Agents';
        break;
      case 'todaysActivity':
        data = mockTodaysActivityData;
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

  if (dashboardData.loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  if (dashboardData.error) {
    return <div className="text-red-500 p-4">Error: {dashboardData.error}</div>;
  }

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Function to render the appropriate table based on the selected card
  const renderTable = () => {
    switch(selectedCard) {
      case 'totalProspects':
      case 'totalFeedbacks':
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interest</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {selectedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.phone}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.interest}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{item.status}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      
      case 'totalSales':
      case 'salesAmount':
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {selectedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.property}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.client}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.agent}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.amount.toLocaleString()} ETB</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      
      case 'siteVisits':
      case 'officeVisits':
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {selectedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.type}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.client}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.agent}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.property}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      
      case 'totalAgents':
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Team</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prospects</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sales</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visits</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {selectedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.team}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.prospects}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.sales}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.visits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      
      case 'todaysActivity':
        return (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agent</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Property</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {selectedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.type}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.client}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.agent}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.property}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      
      default:
        return (
          <div className="flex justify-center items-center h-32">
            <p className="text-gray-500">No data available</p>
          </div>
        );
    }
  };

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name || 'Supervisor'}!</h1>
          <p className="text-gray-600">Role: Supervisor</p>
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

      {/* Performance Overview */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
        <h4 className="font-medium text-gray-600 mb-4">Role Supervisor</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div onClick={() => handleCardClick('totalProspects')} className="cursor-pointer">
            <StatCard title="Total Prospects" value={dashboardData.stats.totalProspects} />
          </div>
          <div onClick={() => handleCardClick('totalFeedbacks')} className="cursor-pointer">
            <StatCard title="Prospects This Week" value={dashboardData.stats.totalFeedbacks} />
          </div>
          <div onClick={() => handleCardClick('officeVisits')} className="cursor-pointer">
            <StatCard title="Prospects Today" value={dashboardData.stats.officeVisits} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div onClick={() => handleCardClick('salesAmount')} className="cursor-pointer">
            <StatCard title="Total Sales Amount" value={`${dashboardData.stats.salesAmount.toLocaleString()} ETB`} />
          </div>
          <div onClick={() => handleCardClick('totalSales')} className="cursor-pointer">
            <StatCard title="Total Sold Properties" value={dashboardData.stats.totalSales} />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Agent Performance Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Agent Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.agentsPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalSales" fill="#F4C430" name="Total Sales" />
                <Bar dataKey="officeVisits" fill="#FF8042" name="Office Visits" />
                <Bar dataKey="siteVisits" fill="#333333" name="Site Visits" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Trend Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Weekly Sales Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.salesTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#F4C430" name="Sales" />
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
            <div onClick={() => handleCardClick('totalAgents')} className="cursor-pointer">
              <StatCardSmall title="Total Agents" value="20" />
            </div>
            <div onClick={() => handleCardClick('siteVisits')} className="cursor-pointer">
              <StatCardSmall title="Total Site Visits" value={dashboardData.stats.siteVisits} />
            </div>
            <div onClick={() => handleCardClick('officeVisits')} className="cursor-pointer">
              <StatCardSmall title="Total Office Visits" value={dashboardData.stats.officeVisits} />
            </div>
            <div onClick={() => handleCardClick('todaysActivity')} className="cursor-pointer">
              <StatCardSmall title="Today's Activity" value="350" />
            </div>
          </div>
        </div>

        {/* Visits Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Visits Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dashboardData.visitDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={renderCustomizedLabel}
                >
                  {dashboardData.visitDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Client Feedback</h3>
          {dashboardData.recentFeedbacks && dashboardData.recentFeedbacks.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {dashboardData.recentFeedbacks.map((feedback, index) => (
                <li key={index} className="py-3">
                  <p className="text-sm font-medium text-gray-900">{feedback.clientName}</p>
                  <p className="text-sm text-gray-500">{feedback.feedback}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No recent feedback available.</p>
          )}
        </div>
      </div>

      {/* Modal for showing detailed table */}
      {selectedCard && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center p-4 z-50">
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
                  {renderTable()}
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

// Reusable StatCard components
const StatCard = ({ title, value }) => (
  <div className="bg-[#333333] p-4 rounded-lg hover:bg-[#444444] transition-colors">
    <h5 className="text-[#F4A300] mb-2">{title}</h5>
    <p className="text-2xl font-bold text-[#F4A300]">{value}</p>
  </div>
);

const StatCardSmall = ({ title, value }) => (
  <div className="bg-[#333333] p-4 rounded-lg hover:bg-[#444444] transition-colors">
    <h5 className="text-[#F4A300]">{title}</h5>
    <p className="text-xl font-bold text-[#F4A300]">{value}</p>
  </div>
);

export default SupervisorDashboard;