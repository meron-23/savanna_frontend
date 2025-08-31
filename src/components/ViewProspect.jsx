import React, { useState, useEffect } from 'react';

// Import your local data
import localData from '../data.json';

// New Modal Component embedded in the same file
const EditProspectModal = ({ prospect, onSave, onCancel }) => {
  const [editedData, setEditedData] = useState({});

  // Calculate if the prospect is editable within 24 hours of dateNow
  const isEditableWithin24Hours = (new Date() - new Date(prospect.dateNow)) / (1000 * 60 * 60) < 24;

  useEffect(() => {
    // Initialize editedData when the modal opens with the current prospect data
    setEditedData({ ...prospect });
  }, [prospect]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const renderInputField = (fieldName, label, isAlwaysEditable = false, type = 'text') => {
    const isDisabled = !isAlwaysEditable && !isEditableWithin24Hours;
    const value = editedData[fieldName] || '';

    return (
      <div className="mb-4">
        <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        {fieldName === 'remark' || fieldName === 'comment' ? (
          <textarea
            id={fieldName}
            name={fieldName}
            value={value}
            onChange={handleChange}
            disabled={isDisabled}
            rows={3}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm
              ${isDisabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300]'}`}
          ></textarea>
        ) : (
          <input
            type={type}
            id={fieldName}
            name={fieldName}
            value={type === 'date' && value ? new Date(value).toISOString().split('T')[0] : value}
            onChange={handleChange}
            disabled={isDisabled}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm sm:text-sm
              ${isDisabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300]'}`}
          />
        )}
        {!isAlwaysEditable && !isEditableWithin24Hours && (
          <p className="text-xs text-red-500 mt-1">Editable only within 24 hours of creation.</p>
        )}
      </div>
    );
  };
  
  const handleSave = (e) => {
    e.preventDefault();
    const dataToSend = { ...editedData };

    if (dataToSend.date) {
      dataToSend.date = new Date(dataToSend.date).toISOString().split('T')[0];
    }
    
    if (dataToSend.dateNow) {
        dataToSend.dateNow = new Date(dataToSend.dateNow).toISOString().split('T')[0];
    }

    onSave(dataToSend);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md md:max-w-lg lg:max-w-xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-[#333333] mb-4">Edit Prospect: {prospect?.name}</h3>
        <form onSubmit={handleSave}>
          {renderInputField('name', 'Name')}
          {renderInputField('phoneNumber', 'Phone Number')}
          {renderInputField('interest', 'Interest')}
          {renderInputField('method', 'Method')}
          {renderInputField('site', 'Site')}
          {renderInputField('periodTime', 'Period Time')}
          {renderInputField('date', 'Date', false, 'date')}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Now</label>
            <p className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-700 text-sm">
              {prospect.dateNow ? new Date(prospect.dateNow).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          {renderInputField('comment', 'Comment')}
          {renderInputField('remark', 'Remark', true)}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#F4A300] text-white rounded-md hover:bg-[#E09400] focus:outline-none focus:ring-2 focus:ring-[#F4A300] focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main component
const ViewProspect = () => {
  const [prospects, setProspects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProspectToEdit, setCurrentProspectToEdit] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [selectedProspects, setSelectedProspects] = useState([]);

  // Load data from local JSON
  useEffect(() => {
    try {
      const prospectsData = localData.prospects || [];
      
      // Sort prospects by date in descending order
      const sortedProspects = prospectsData.sort((a, b) => {
        return new Date(b.dateNow) - new Date(a.dateNow);
      });
      
      setProspects(sortedProspects);
    } catch (err) {
      console.error("Error loading prospects:", err);
      setError("Failed to load prospects data.");
    }
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setSelectedProspects([]); // Clear selection on search
  };

  const filteredProspects = prospects.filter(prospect =>
    prospect && (
      (prospect.name && prospect.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (prospect.phoneNumber && prospect.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (prospect.interest && prospect.interest.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (prospect.method && prospect.method.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (prospect.site && prospect.site.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (prospect.comment && prospect.comment.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (prospect.remark && prospect.remark.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (prospect.periodTime && prospect.periodTime.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (prospect.date && new Date(prospect.date).toLocaleDateString().toLowerCase().includes(searchTerm.toLowerCase())) ||
      (prospect.dateNow && new Date(prospect.dateNow).toLocaleDateString().toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  const handleEditClick = (prospect) => {
    setCurrentProspectToEdit(prospect);
    setShowEditModal(true);
  };

  const handleSendMessage = (phoneNumber) => {
    // For now, let's just log the phone number and alert
    console.log(`Sending message to: ${phoneNumber}`);
    alert(`Simulating sending a message to: ${phoneNumber}`);
  };

  const handleSaveEdit = (updatedData) => {
    if (!updatedData.id) {
      console.error("Prospect ID is missing for update.");
      setError("Failed to save changes: Prospect ID not found.");
      return;
    }
    
    try {
      const updatedProspects = prospects.map(prospect => 
        prospect.id === updatedData.id ? { ...prospect, ...updatedData } : prospect
      );
      
      setProspects(updatedProspects);
      setShowEditModal(false);
      setCurrentProspectToEdit(null);
      
      setSuccessMessage('Prospect updated successfully! ✅');
      setTimeout(() => setSuccessMessage(null), 5000);
      
    } catch (error) {
      console.error("Failed to save prospect:", error);
      setError("Failed to save changes. Please try again.");
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setCurrentProspectToEdit(null);
  };
  
  // New handlers for bulk selection and messaging
  const handleCheckboxChange = (id) => {
    setSelectedProspects(prevSelected =>
      prevSelected.includes(id)
        ? prevSelected.filter(prospectId => prospectId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAllChange = (event) => {
    if (event.target.checked) {
      const allFilteredIds = filteredProspects.map(prospect => prospect.id);
      setSelectedProspects(allFilteredIds);
    } else {
      setSelectedProspects([]);
    }
  };

  const handleSendMessageToSelected = () => {
    const numbersToMessage = prospects
      .filter(p => selectedProspects.includes(p.id))
      .map(p => p.phoneNumber);
      
    if (numbersToMessage.length > 0) {
      alert(`Simulating sending a message to ${numbersToMessage.length} prospects: \n${numbersToMessage.join(', ')}`);
      setSuccessMessage(`Messages sent to ${numbersToMessage.length} prospects! 📧`);
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  };

  const allFilteredAreSelected = filteredProspects.length > 0 && selectedProspects.length === filteredProspects.length;
  const someAreSelected = selectedProspects.length > 0 && selectedProspects.length < filteredProspects.length;

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-full flex justify-center items-center h-48">
        <p className="text-gray-600 text-lg">Loading prospects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 w-full flex justify-center items-center h-48">
        <p className="text-red-600 text-lg font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 overflow-hidden">
      {/* Success Message Banner */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}

      {/* Header and Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div className='flex flex-col space-y-1'>
          <h2 className="text-2xl font-bold text-[#333333]">
            Prospect Management
          </h2>
          <p className="text-gray-600 text-sm md:text-base">{prospects.length} Total Prospects</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search all fields..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] w-full sm:text-sm"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            onClick={handleSendMessageToSelected}
            disabled={selectedProspects.length === 0}
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors duration-200
              ${selectedProspects.length > 0 ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            Message Selected ({selectedProspects.length})
          </button>
        </div>
      </div>

      {/* No Prospects Found Message */}
      {filteredProspects.length === 0 && !isLoading && !error ? (
        <p className="text-gray-600 text-center py-8">No matching prospects found. Try a different search term.</p>
      ) : (
        /* Table Container with Horizontal Scroll */
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-3 py-3 w-10 text-left">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-[#F4A300] border-gray-300 rounded focus:ring-[#F4A300] cursor-pointer"
                    checked={allFilteredAreSelected}
                    ref={input => {
                      if (input) {
                        input.indeterminate = someAreSelected;
                      }
                    }}
                    onChange={handleSelectAllChange}
                  />
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap sm:px-4">
                  Name
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap sm:px-4">
                  Phone
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-4">
                  Interest
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap sm:px-4">
                  Method
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-4">
                  Site
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap sm:px-4">
                  Period Time
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap sm:px-4">
                  Date
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap sm:px-4">
                  Date Now
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-4">
                  Comment
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-4">
                  Remark
                </th>
                <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProspects.map((prospect) => (
                prospect && (
                  <tr key={prospect.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 align-top">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-[#F4A300] border-gray-300 rounded focus:ring-[#F4A300] cursor-pointer"
                        checked={selectedProspects.includes(prospect.id)}
                        onChange={() => handleCheckboxChange(prospect.id)}
                      />
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-900 align-top sm:px-4">
                      <div className="line-clamp-2">{prospect.name}</div>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500 align-top whitespace-nowrap sm:px-4">
                      {prospect.phoneNumber}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500 align-top sm:px-4">
                      <div className="line-clamp-2">{prospect.interest}</div>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500 align-top whitespace-nowrap sm:px-4">
                      {prospect.method}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500 align-top sm:px-4">
                      <div className="line-clamp-2">{prospect.site}</div>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500 align-top whitespace-nowrap sm:px-4">
                      {prospect.periodTime}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500 align-top whitespace-nowrap sm:px-4">
                      {prospect.date ? new Date(prospect.date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500 align-top whitespace-nowrap sm:px-4">
                      {prospect.dateNow ? new Date(prospect.dateNow).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500 align-top sm:px-4">
                      <div className="line-clamp-2">{prospect.comment || 'N/A'}</div>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500 align-top sm:px-4">
                      <div className="line-clamp-2">{prospect.remark || 'N/A'}</div>
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500 align-top whitespace-nowrap sm:px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(prospect)}
                          className="bg-[#F4A300] hover:bg-[#E09400] text-white px-3 py-1 rounded-md text-xs font-medium shadow-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleSendMessage(prospect.phoneNumber)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-xs font-medium shadow-sm"
                        >
                          Message
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Prospect Modal */}
      {showEditModal && currentProspectToEdit && (
        <EditProspectModal
          prospect={currentProspectToEdit}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
}

export default ViewProspect;