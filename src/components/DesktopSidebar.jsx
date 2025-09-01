import React, { useContext } from 'react';
import NavItem from './NavItem';
import { UserContext } from '../context/UserContext';
import img from '../assets/savannacrm.png'

const DesktopSidebar = ({
  isSidebarOpen,
  activeItem,
  isProspectOpen,
  handleItemClick,
  handleSubItemClick,
  toggleSidebar,
  role
}) => {
  const { user } = useContext(UserContext);

  // Common links for the 'Prospect' dropdown
  const commonLinks = [
    { index: 1, name: 'Add Prospect', path: 'Add', icon: (
      <svg className="w-4 h-4 ms-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    )},
    { index: 2, name: 'View Prospect', path: 'View', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ms-1">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.575 3.01 9.963 7.823a1.012 1.012 0 010 .638C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.575-3.01-9.963-7.823z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )},
  ];

  // Define the top-level navigation items for Sales role
  const salesTopLevelLinks = [
    { 
      index: 1, 
      name: 'Dashboard', 
      path: 'Dashboard', 
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      )
    },
    // Prospect will be inserted manually to handle its submenu
    { 
      index: 3, 
      name: 'Leads', 
      path: 'Leads', 
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h2a2 2 0 002-2V4a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2m0 0a2 2 0 100 4 2 2 0 000-4zm0 0l-2.5-2.5M7 13h10v4H7v-4zm0 0a2 2 0 100-4 2 2 0 000 4zm0 0l-2.5-2.5M7 7h10v4H7V7zm0 0a2 2 0 100-4 2 2 0 000 4zm0 0l-2.5-2.5" />
      )
    },
  ];

  // Define the top-level navigation items for Supervisor role
  const supervisorTopLevelLinks = [
    {
      index: 1,
      name: 'Dashboard',
      path: 'Dashboard',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      )
    },
    {
      index: 2,
      name: 'Register-agents',
      path: 'RegisterAgents',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      )
    },
    // Prospect will be inserted manually to handle its submenu
    {
      index: 4,
      name: 'Assign Leads',
      path: 'AssignLeads',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      )
    },
    {
      index: 5,
      name: 'Office and Site Visits',
      path: 'SiteVisits',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      )
    },
    {
      index: 6,
      name: 'Sales',
      path: 'Sales',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      )
    }
  ];

  // Define the top-level navigation items for Manager role
  const managerTopLevelLinks = [
    {
      index: 1,
      name: 'Home',
      path: 'Dashboard',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      )
    },
    {
      index: 2,
      name: 'Register User',
      path: 'RegisterUser',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      )
    },
    {
      index: 3,
      name: 'Add Prospect',
      path: 'AddProspect',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      )
    },
    {
      index: 4,
      name: 'Assign Leads',
      path: 'DashboardAssignLeads',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      )
    },
    {
      index: 5,
      name: 'Prospect Report',
      path: 'ProspectReport',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      )
    },
    {
      index: 6,
      name: 'Sales Report',
      path: 'SalesReport',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      )
    },
    {
      index: 7,
      name: 'Client Visits',
      path: 'ClientVisits',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      )
    },
    {
      index: 8,
      name: 'Attendance',
      path: 'Attendance',
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      )
    }
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen pt-10 z-50 hidden md:flex flex-col bg-[#333333]
      ${isSidebarOpen ? 'w-64' : 'w-20'}
      p-4 transition-all duration-300 ease-in-out overflow-hidden`}
    >
      {/* Header Section - Fixed */}
      <div className="flex-shrink-0">
        <div className={`flex ${isSidebarOpen ? 'justify-between items-center' : 'flex-col items-center'} mb-6`}>
          {/* Logo and Brand Name */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg">
              <img src={img} alt="Savanna CRM Logo" className="w-8 h-8 object-contain" />
            </div>
            {isSidebarOpen && (
              <span className="text-xl font-bold text-white">Savanna</span>
            )}
          </div>

          {/* Toggle Button */}
          <button 
            onClick={toggleSidebar} 
            className="text-gray-300 hover:text-white focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Nav Section */}
      <nav className="flex-grow mb-8">
        {isSidebarOpen && (
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-4 px-2">
            OVERVIEW
          </h3>
        )}
        <ul className="space-y-2">
          {(role === 'Sales Agent' || role === 'Agent') && (
            // Render Sales-specific links
            <>
              {salesTopLevelLinks.map((link) => (
                <NavItem
                  key={link.index}
                  name={link.name}
                  icon={link.icon}
                  isActive={activeItem === link.path}
                  isSidebarOpen={isSidebarOpen}
                  onClick={() => handleItemClick(link.path)}
                />
              ))}
              {/* Prospect Dropdown for Sales role */}
              <NavItem
                name="Prospect"
                icon={
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001
                  1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1
                  0 011 1v2a1 1 0 001 1h2a1 1
                  0 001-1v-6.586l.293.293a1 1
                  0 001.414-1.414l-7-7z"
                  />
                }
                isActive={activeItem === 'Prospect' || activeItem === 'Add' || activeItem === 'View'}
                isSidebarOpen={isSidebarOpen}
                onClick={() => handleItemClick('Prospect')}
                hasSubmenu={true}
                isSubmenuOpen={isProspectOpen}
              >
                {isProspectOpen && (
                  <ul className={`ml-${isSidebarOpen ? '8' : '0'} mt-2 space-y-2`}>
                    {commonLinks.map((link) => (
                      <li
                        key={link.index}
                        className="flex items-center gap-2 text-gray-300 hover:text-[#F4A300] cursor-pointer px-2 py-2 rounded-lg"
                        onClick={() => handleSubItemClick(link.path)}
                      >
                        {link.icon}
                        {isSidebarOpen && <span>{link.name}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </NavItem>
            </>
          )}

          {role === 'Supervisor' && (
            // Render Supervisor-specific links in desired order
            <>
              {supervisorTopLevelLinks.map((link) => (
                <NavItem
                  key={link.index}
                  name={link.name}
                  icon={link.icon}
                  isActive={activeItem === link.path}
                  isSidebarOpen={isSidebarOpen}
                  onClick={() => handleItemClick(link.path)}
                />
              ))}

              {/* Prospect Dropdown for Supervisor role */}
              <NavItem
                name="Prospect"
                icon={
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001
                  1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1
                  0 011 1v2a1 1 0 001 1h2a1 1
                  0 001-1v-6.586l.293.293a1 1
                  0 001.414-1.414l-7-7z"
                  />
                }
                isActive={activeItem === 'Prospect' || activeItem === 'Add' || activeItem === 'View'}
                isSidebarOpen={isSidebarOpen}
                onClick={() => handleItemClick('Prospect')}
                hasSubmenu={true}
                isSubmenuOpen={isProspectOpen}
              >
                {isProspectOpen && (
                  <ul className={`ml-${isSidebarOpen ? '8' : '0'} mt-2 space-y-2`}>
                    {commonLinks.map((link) => (
                      <li
                        key={link.index}
                        className="flex items-center gap-2 text-gray-300 hover:text-[#F4A300] cursor-pointer px-2 py-2 rounded-lg"
                        onClick={() => handleSubItemClick(link.path)}
                      >
                        {link.icon}
                        {isSidebarOpen && <span>{link.name}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </NavItem>
            </>
          )}

          {role === 'Manager' && (
            // Render Manager-specific links
            <>
              {managerTopLevelLinks.map((link) => (
                <NavItem
                  key={link.index}
                  name={link.name}
                  icon={link.icon}
                  isActive={activeItem === link.path}
                  isSidebarOpen={isSidebarOpen}
                  onClick={() => handleItemClick(link.path)}
                />
              ))}
            </>
          )}
        </ul>
      </nav>

      {/* Footer User Info - Fixed at bottom */}
      <div className="flex-shrink-0 mt-auto pt-4 border-t border-gray-700">
        <h1 className={`font-bold text-center ${isSidebarOpen ? 'text-base' : 'text-sm'} text-gray-300`}>
          {isSidebarOpen ? user : user?.charAt(0)?.toUpperCase()}
        </h1>
      </div>
    </aside>
  );
};

export default DesktopSidebar;