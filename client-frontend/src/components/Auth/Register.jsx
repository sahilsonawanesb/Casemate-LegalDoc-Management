// frontend/src/components/auth/Register.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import { Eye, EyeOff, User, Mail, Lock, Phone, Loader2, Shield, Users, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export const Register = () => {
  
  const [formData, setFormData] = useState({
      name : '',
      email : '',
      password : '',
      confirmPassword : '',
      role : 'attorney',
      phone : '',
  });

 const [showPassword, setShowPassword] = useState(false);
 const [showConfirmPassword, setShowConfirmPassword] = useState(false);

 const {register, isLoading, isAuthenticated} = useAuth();

 const navigate = useNavigate();

 useEffect(() => {
    if(isAuthenticated){
      navigate('/dashboard');
    }
 }, [isAuthenticated, navigate]);


 const handleChange = (e) => {
    const {name, value} = e.target;

    setFormData(prev => ({
      ...prev,
      [name] : value
    }));
    
 }

 const handleSubmit = async(e) => {

    e.preventDefault();

    // validations:
    if(!formData.name || !formData.email || !formData.password){
      toast.error('Please fill all required feilds');
      return;
    }
    try{
      const res = await register(formData);
      toast.success('Account created successfully! Welcome to CaseMate');
    if(res.success){
      navigate('/dashboard');
    }
    }catch(error){
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
    
 }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-60 right-24 w-20 h-20 border border-white rounded-lg rotate-45"></div>
          <div className="absolute bottom-32 left-24 w-14 h-14 border-2 border-white rounded-full"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-start p-16 text-white">

          <div className="mb-12">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
              <span className="text-white text-3xl font-bold">CM</span>
            </div>
            <h1 className="text-5xl font-bold mb-4 leading-tight">
              Welcome<br />Back
            </h1>
            <p className="text-xl text-indigo-100 leading-relaxed">
              Continue managing your legal cases with powerful tools and insights
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Secure & Compliant</h3>
                <p className="text-blue-100">Bank-level security for your legal documents</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Team Collaboration</h3>
                <p className="text-blue-100">Work seamlessly with your legal team</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Document Management</h3>
                <p className="text-blue-100">Organize and access cases effortlessly</p>
              </div>
            </div>
          </div>
        
        </div>
      </div>

  
  

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-white text-2xl font-bold">CM</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
          </div>
          <div className="hidden lg:block mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
            <p className="text-slate-600">Join thousands of legal professionals</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          

            <form onSubmit={handleSubmit} className="space-y-4">
             
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-slate-900 placeholder-slate-400"
                    placeholder="John Doe"
                  />
                </div>
              </div>

             
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-slate-900 placeholder-slate-400"
                    placeholder="john@lawfirm.com"
                  />
                </div>
              </div>

            
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full cursor-pointer px-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-slate-900 bg-white"
                  >
                    <option value="attorney">Attorney</option>
                    <option value="assistant">Legal Assistant</option>
                    <option value="client">Client</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">
                    Phone (Optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-slate-900 placeholder-slate-400"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              </div>

         
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength="6"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-slate-900 placeholder-slate-400"
                    placeholder="Create password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 cursor-pointer" /> : <Eye className="h-4 w-4 cursor-pointer" />}
                  </button>
                </div>
                
              
              </div>

             
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 text-slate-900 placeholder-slate-400"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center mt-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

     
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;