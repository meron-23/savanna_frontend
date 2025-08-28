import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';

// Import your local data
import localData from '../data.json';

const AuthForm = () => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser, setRole, setUserData } = useContext(UserContext);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');
    setError('');

    // Simulate API call delay
    setTimeout(() => {
      // Find user in local data
      const user = localData.users.find(u => u.email === formData.email);
      
      if (user) {
        // Check password (in real app, this would be hashed)
        if (user.password === formData.password) {
          setSuccessMessage('Login successful!');
          
          // Store user data
          localStorage.setItem('userId', user.userId);
          localStorage.setItem('userData', JSON.stringify(user));
          
          // Update context
          setUser(user.name);
          setRole(user.role);
          // setUserData(user);

          // Navigate based on role
          if (user.role === "Admin") {
            navigate('/admin');
          } else if (["Agent", "Sales Agent", "Manager", "Supervisor"].includes(user.role)) {
            navigate('/dashboard');
          } else {
            navigate('/');
          }
        } else {
          setError('Invalid password');
        }
      } else {
        setError('No account found with this email');
      }
      
      setIsLoading(false);
    }, 800); // Simulate network delay
  };

  // Mock Google login for demo
  const mockGoogleLogin = () => {
    setIsLoading(true);
    setError('');
    
    setTimeout(() => {
      const googleUser = {
        userId: "google_demo_user",
        name: "Google User",
        email: "googleuser@example.com",
        role: "Agent",
        phoneNumber: "000-000-0000",
        gender: "Other",
        supervisor: null
      };
      
      localStorage.setItem('userId', googleUser.userId);
      localStorage.setItem('userData', JSON.stringify(googleUser));
      
      setUser(googleUser.name);
      setRole(googleUser.role);
      setUserData(googleUser);
      
      navigate('/dashboard');
      setIsLoading(false);
    }, 800);
  };

  // Pre-fill demo credentials for easier testing
  useEffect(() => {
    setFormData({
      email: 'demo@gmail.com',
      password: '123456'
    });
  }, []);

  return (
    <div className="w-full max-w-sm">
      <h2 className="block sm:hidden text-2xl font-bold text-center mb-2 text-[#F4A300]">
        Savanna
      </h2>

      <h2 className="text-3xl font-bold text-center mb-2 text-charcoal">
        Welcome Back
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Enter your email and password to access your account.
      </p>
      
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded" role="alert">
        <p className="font-bold">Demo Mode</p>
        <p>Using local data storage - no server required</p>
        <p className="text-sm mt-1">Pre-filled with demo credentials</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <div className="relative">
            <input
              name="email"
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#F4A300]"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <div className="relative">
            <input
              name="password"
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[#F4A300]"
              required
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span className="text-gray-700">Remember Me</span>
          </label>
          <Link to="/forgot-password" className="text-[#F4A300] hover:underline">
            Forgot Your Password?
          </Link>
        </div>
        
        {successMessage && (
          <div className="p-3 bg-green-100 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-[#F4A300] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200 ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-opacity-90'
          }`}
        >
          {isLoading ? 'Logging In...' : 'Log In'}
        </button>
      </form>

      <div className="flex items-center my-6">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-gray-500">Or Login With</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <div className="flex justify-center">
        <button 
          onClick={mockGoogleLogin}
          disabled={isLoading}
          className="flex-1 max-w-xs flex items-center justify-center border border-gray-300 rounded py-2 text-gray-700 hover:bg-gray-50 transition duration-200 disabled:opacity-50"
        >
          <FcGoogle className="mr-2 text-lg" /> Google
        </button>
      </div>

      <div className="mt-6 p-3 bg-blue-50 rounded-md">
        <p className="text-center text-blue-700 text-sm font-medium">
          Demo Accounts:
        </p>
        <div className="text-xs text-blue-600 mt-1 text-center">
          <div>demo@gmail.com / 123456 (Manager)</div>
          <div>deguyibeltal918@gmail.com / test123 (Sales Agent)</div>
          <div>mohammed@example.com / 123456 (Supervisor)</div>
        </div>
      </div>

      <p className="text-center text-gray-600 text-sm mt-6">
        Don't have an account? Contact your administrator to be added.
      </p>
    </div>
  );
};

export default AuthForm;