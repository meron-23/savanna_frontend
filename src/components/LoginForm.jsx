import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';

// Import your local data
import localData from '../data.json';

const AuthForm = () => {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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

          // Navigate based on role
          if (user.role === "Admin") {
            navigate('/admin');
          } else if (["Agent", "SalesAgent", "Manager", "Supervisor"].includes(user.role)) {
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
    <div className="h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="w-full max-w-sm mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#F4A300] mb-2">Savanna</h1>
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 mt-2 text-sm">
            Enter your email and password to access your account.
          </p>
        </div>
        
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 mb-4 rounded text-sm">
          <p className="font-bold">Demo Mode</p>
          <p>Pre-filled with demo credentials</p>
        </div>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F4A300] focus:border-[#F4A300] text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                id="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F4A300] focus:border-[#F4A300] text-sm pr-10"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <FiEyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <FiEye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 rounded" />
              <span className="text-gray-700">Remember Me</span>
            </label>
            <Link to="/forgot-password" className="text-[#F4A300] hover:underline">
              Forgot Password?
            </Link>
          </div>
          
          {successMessage && (
            <div className="p-2 bg-green-100 text-green-700 rounded-md text-sm">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="p-2 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#F4A300] text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F4A300] transition-colors text-sm ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#e69500]'
            }`}
          >
            {isLoading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-2 text-gray-500 text-xs">Or continue with</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="flex justify-center mb-4">
          <button 
            onClick={mockGoogleLogin}
            disabled={isLoading}
            className="flex items-center justify-center w-full border border-gray-300 rounded-md py-2 px-4 bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm"
          >
            <FcGoogle className="mr-2" /> 
            <span>Google</span>
          </button>
        </div>

        <div className="p-2 bg-blue-50 rounded-md mb-3">
          <p className="text-center text-blue-700 text-xs font-medium">
            Demo Accounts
          </p>
          <div className="text-xs text-blue-600 mt-1 text-center">
            <div>Manager: demo@gmail.com / 123456 </div>
            <div>Sales Agent: chala@gmail.com / 123456</div>
            <div>Supervisor: mohammed@example.com / 123456</div>
          </div>
        </div>

        <p className="text-center text-gray-500 text-xs">
          Don't have an account? Contact your administrator.
        </p>
      </div>

      <style jsx>{`
        body {
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default AuthForm;