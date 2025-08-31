import React, { useState, useEffect } from 'react';
import { FiSettings, FiUser, FiLock, FiBell, FiMoon, FiSun, FiSave } from 'react-icons/fi';

// Import your local data
import localData from '../data.json';

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [saveStatus, setSaveStatus] = useState('');

  // Load user data from localStorage or localData
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    let user;
    
    if (userId) {
      // Find user in local data
      user = localData.users.find(u => u.userId === userId);
    }
    
    // If no user found, use the first user as demo
    if (!user && localData.users.length > 0) {
      user = localData.users[0];
    }
    
    if (user) {
      setUserData(user);
      // Split full name into first and last name
      const nameParts = user.name ? user.name.split(' ') : ['', ''];
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    // Simulate saving data
    setSaveStatus('saving');
    
    setTimeout(() => {
      // In a real app, you would save to your backend here
      // For demo, we'll just update localStorage
      if (userData) {
        const updatedUser = {
          ...userData,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phoneNumber: formData.phoneNumber
        };
        
        // Update preferences in localStorage
        localStorage.setItem('darkMode', darkMode);
        localStorage.setItem('notifications', notifications);
        localStorage.setItem('emailUpdates', emailUpdates);
        
        setSaveStatus('saved');
        
        // Reset status after 2 seconds
        setTimeout(() => setSaveStatus(''), 2000);
      }
    }, 1000);
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">First Name</label>
            <input 
              type="text" 
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Last Name</label>
            <input 
              type="text" 
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Email</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Phone Number</label>
            <input 
              type="tel" 
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiBell className="mr-2" />
              <span>Notifications</span>
            </div>
            <button 
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 focus:outline-none ${notifications ? 'bg-[#F4C430]' : 'bg-gray-300'}`}
            >
              <span className={`w-5 h-5 rounded-full transform transition-transform duration-300 ${notifications ? 'translate-x-6 bg-white' : 'translate-x-1 bg-white'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiSun className="mr-2" />
              <span>Email Updates</span>
            </div>
            <button 
              onClick={() => setEmailUpdates(!emailUpdates)}
              className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 focus:outline-none ${emailUpdates ? 'bg-[#F4C430]' : 'bg-gray-300'}`}
            >
              <span className={`w-5 h-5 rounded-full transform transition-transform duration-300 ${emailUpdates ? 'translate-x-6 bg-white' : 'translate-x-1 bg-white'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Change Password</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Current Password</label>
            <input 
              type="password" 
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">New Password</label>
            <input 
              type="password" 
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Confirm New Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Email Notifications</div>
              <div className="text-sm text-gray-500">Receive emails about your account activity</div>
            </div>
            <button 
              onClick={() => setEmailUpdates(!emailUpdates)}
              className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 focus:outline-none ${emailUpdates ? 'bg-[#F4C430]' : 'bg-gray-300'}`}
            >
              <span className={`w-5 h-5 rounded-full transform transition-transform duration-300 ${emailUpdates ? 'translate-x-6 bg-white' : 'translate-x-1 bg-white'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Push Notifications</div>
              <div className="text-sm text-gray-500">Receive push notifications on your device</div>
            </div>
            <button 
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full flex items-center transition-colors duration-300 focus:outline-none ${notifications ? 'bg-[#F4C430]' : 'bg-gray-300'}`}
            >
              <span className={`w-5 h-5 rounded-full transform transition-transform duration-300 ${notifications ? 'translate-x-6 bg-white' : 'translate-x-1 bg-white'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <FiSettings className="text-2xl mr-3 text-[#F4C430]" />
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="md:col-span-1">
            <nav className="space-y-2">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center transition-colors ${
                  activeTab === 'profile' 
                    ? 'bg-[#F4C430] text-white' 
                    : darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white shadow-sm hover:bg-gray-100'
                }`}
              >
                <FiUser className="mr-3" />
                Profile
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center transition-colors ${
                  activeTab === 'security' 
                    ? 'bg-[#F4C430] text-white' 
                    : darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white shadow-sm hover:bg-gray-100'
                }`}
              >
                <FiLock className="mr-3" />
                Security
              </button>
              <button 
                onClick={() => setActiveTab('notifications')}
                className={`w-full text-left px-4 py-2 rounded-lg flex items-center transition-colors ${
                  activeTab === 'notifications' 
                    ? 'bg-[#F4C430] text-white' 
                    : darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white shadow-sm hover:bg-gray-100'
                }`}
              >
                <FiBell className="mr-3" />
                Notifications
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className={`p-6 rounded-xl transition-colors ${darkMode ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                {activeTab === 'profile' && <FiUser className="mr-2" />}
                {activeTab === 'security' && <FiLock className="mr-2" />}
                {activeTab === 'notifications' && <FiBell className="mr-2" />}
                {activeTab === 'profile' && 'Account Settings'}
                {activeTab === 'security' && 'Security Settings'}
                {activeTab === 'notifications' && 'Notification Settings'}
              </h2>

              {activeTab === 'profile' && renderProfileTab()}
              {activeTab === 'security' && renderSecurityTab()}
              {activeTab === 'notifications' && renderNotificationsTab()}

              {/* Save Button */}
              <div className="pt-6 flex items-center">
                <button 
                  onClick={handleSave}
                  disabled={saveStatus === 'saving'}
                  className="px-6 py-2 bg-[#F4C430] text-white rounded-lg hover:bg-[#e6b82a] transition-colors flex items-center disabled:opacity-70"
                >
                  <FiSave className="mr-2" />
                  {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                </button>
                {saveStatus === 'saved' && (
                  <span className="ml-4 text-green-500">✓ Changes saved successfully!</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;