import React, { useRef, useState } from 'react';
// Note: axios and XLSX are not available in this environment, so
// API and file reading logic has been replaced with mock functions.
// This focuses on demonstrating the UI and form changes.

const AddProspect = () => {
  // Initialize form state
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    interest: '',
    method: '',
    site: '',
    comment: '',
    remark: '',
    periodTime: '',
  });

  // State to handle the "Other" contact method text input
  const [showOtherMethodInput, setShowOtherMethodInput] = useState(false);
  const [otherMethod, setOtherMethod] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [createdId, setCreatedId] = useState(null);
  
  // State for spreadsheet import
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState('');
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Check if the selected method is 'Other' to show the new input field
    if (name === 'method') {
      setShowOtherMethodInput(value === 'Other');
    }
  };

  const handleOtherMethodChange = (e) => {
    setOtherMethod(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);
    setSuccessMessage('');
    setCreatedId(null);
    
    // Mock API call
    console.log("Submitting form data:", formData);
    console.log("Custom method:", otherMethod);

    setTimeout(() => {
      // Simulate a successful response
      setSuccess(true);
      setSuccessMessage('Prospect saved successfully!');
      setCreatedId('mock-id-1234');
      setIsLoading(false);
      
      // Reset form
      setFormData({
        name: '',
        phoneNumber: '',
        interest: '',
        method: '',
        site: '',
        comment: '',
        remark: '',
        periodTime: '',
      });
      setOtherMethod('');
      setShowOtherMethodInput(false);
    }, 1500);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Mock file reading process
      setIsImporting(true);
      console.log("Reading file:", file.name);
      setTimeout(() => {
        setIsImporting(false);
        setImportSuccess("Successfully imported 5 prospects (mock data).");
        setImportError("");
      }, 2000);
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent = "Name,Phone Number,Interest,Contact Method,Site,Comment,Remark,Preferred Contact Time\n";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'prospects_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-8 w-full max-w-4xl mx-auto overflow-x-hidden">
      <h2 className="text-xl font-bold text-[#333333] mb-4">Add New Prospect</h2>
      
      {/* Status Messages */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {successMessage} {createdId && `(ID: ${createdId})`}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name Field */}
        <div>
          <label htmlFor="prospectName" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="prospectName"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
            placeholder="Enter prospect name"
            required
          />
        </div>

        {/* Phone Number Field */}
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
            placeholder="e.g., +1234567890"
            required
          />
        </div>

        {/* Interest Field */}
        <div>
          <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-1">
            Interest
          </label>
          <input
            type="text"
            id="interest"
            name="interest"
            value={formData.interest}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
            placeholder="e.g., UI/UX Design, Branding"
            required
          />
        </div>

        {/* Contact Method Field */}
        <div>
          <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Method
          </label>
          <select
            id="method"
            name="method"
            value={formData.method}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
            required
          >
            <option value="">Select method</option>
            <option value="Call">Call</option>
            <option value="Email">Email</option>
            <option value="Meeting">Meeting</option>
            <option value="Office Visit">Office Visit</option>
            <option value="Site Visit">Site Visit</option>
            <option value="Telemarketing">Telemarketing</option>
            <option value="Social Media">Social Media</option>
            <option value="Survey">Survey</option>
            <option value="Referral">Referral</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        {/* Conditional 'Other' method input field */}
        {showOtherMethodInput && (
          <div>
            <label htmlFor="otherMethod" className="block text-sm font-medium text-gray-700 mb-1">
              Specify Other Method
            </label>
            <input
              type="text"
              id="otherMethod"
              name="otherMethod"
              value={otherMethod}
              onChange={handleOtherMethodChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
              placeholder="e.g., Cold Call"
              required
            />
          </div>
        )}

        {/* Site Field */}
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="site" className="block text-sm font-medium text-gray-700 mb-1">
            Site
          </label>
          <input
            type="text"
            id="site"
            name="site"
            value={formData.site}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
            placeholder="e.g., Website, Referral, Social Media"
            required
          />
        </div>

        {/* Comment Field */}
        <div className="col-span-1 md:col-span-2">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Comment
          </label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
              placeholder="Add any relevant comments"
            ></textarea>
          </div>

          {/* Remark Field */}
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="remark" className="block text-sm font-medium text-gray-700 mb-1">
              Remark
            </label>
            <textarea
              id="remark"
              name="remark"
              value={formData.remark}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
              placeholder="Add any additional remarks"
            ></textarea>
          </div>

          {/* Preferred Contact Time */}
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="periodTime" className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Contact Time
            </label>
            <input
              type="text"
              id="periodTime"
              name="periodTime"
              value={formData.periodTime}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#F4A300] focus:border-[#F4A300] sm:text-sm"
              placeholder="e.g., Morning, Afternoon, 9 AM - 12 PM"
            />
          </div>

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                isLoading ? 'bg-gray-400' : 'bg-[#F4A300] hover:bg-yellow-600'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F4A300]`}
            >
              {isLoading ? 'Saving...' : 'Save Prospect'}
            </button>
          </div>
        </form>

        {/* Spreadsheet Import Section */}
        <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between">
          <h3 className="text-lg font-bold text-[#333333] mb-3 sm:mb-0">Upload Excel or CSV file</h3>
          <div className="flex space-x-2 w-full sm:w-auto">
            {/* Download Template Button */}
            <button
              onClick={handleDownloadTemplate}
              className="inline-flex items-center justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Template
            </button>
            
            {/* Import Button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xlsx, .xls, .csv"
              className="hidden" // Hide the default file input
            />
            <button
              onClick={() => fileInputRef.current.click()} // Trigger hidden input click
              disabled={isImporting}
              className={`inline-flex items-center justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                isImporting ? 'bg-gray-400' : 'bg-[#F4A300] hover:bg-yellow-600'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F4A300]`}
            >
              {isImporting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Importing...
                </>
              ) : (
                <>
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                  </svg>
                  Import from Spreadsheet
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Import Status Messages */}
        {(importError || importSuccess) && (
          <div className="mt-4 p-3 rounded-md text-center text-sm font-medium">
            {importError && (
              <p className="text-red-700 bg-red-100">{importError}</p>
            )}
            {importSuccess && (
              <p className="text-green-700 bg-green-100">{importSuccess}</p>
            )}
          </div>
        )}
      </div>
  );
};

export default AddProspect;
