// frontend/src/components/auth/Login.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import { Eye, EyeOff, Mail, Lock, Loader2, Shield, Zap, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export const Login = () => {
 const [formData, setFormData] = useState({
    email : '',
    password : ''
 });
const [showPassword, setShowPassword] = useState(false);
 const {isLoading, isAuthenticated, login} = useAuth();
 const navigate = useNavigate();
 
 useEffect(() => {
    if(isAuthenticated){
      navigate('/dashboard');
    }
 }, [isAuthenticated, navigate]);

  // handle input change.
  const handleChange = (e) => {
      const {name, value} = e.target;
      setFormData(prev => ({
        ...prev,
        [name] : value
      }))
  }
   
const handleSubmit = async(e) => {
  e.preventDefault();

  // validations:
  if(!formData.email || !formData.password){
    toast.error('Please fill all required feilds');
  }
  
  try{
  const res = await login(formData);
  toast.success('Login successfull! Welcome back!');
  if(res.success){
    navigate('/dashboard');
  }
  }catch(error){
     toast.error(error.response?.data?.message || 'Login failed. Please try again.');
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

          {/* Benefits */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Lightning Fast</h3>
                <p className="text-indigo-100">Quick access to all your cases and documents</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Always Secure</h3>
                <p className="text-indigo-100">Your data protected with enterprise-grade security</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">24/7 Access</h3>
                <p className="text-indigo-100">Work on your cases anytime, anywhere</p>
              </div>
            </div>
          </div>

        
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
         
          <div className="lg:hidden text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4">
              <span className="text-white text-2xl font-bold">CM</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome Back</h1>
          </div>

          <div className="hidden lg:block mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Sign In</h2>
            <p className="text-slate-600">Access your CaseMate dashboard</p>
          </div>

       
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
         

            <form onSubmit={handleSubmit} className="space-y-5">
           
              <div>
               
                <label htmlFor='email' className='block text-sm font-medium text-slate-700 mb-2'>
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    id='email'
                    name='email'
                    type='email'
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 text-slate-900 placeholder-slate-400"
                    placeholder='Enter your email'
                  />
                </div>
              </div>

       
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 text-slate-900 placeholder-slate-400"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

           
              <div className="flex items-center justify-between text-sm pt-2">
              
                <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                  Forgot password?
                </Link>
              </div>

          
              <button
                type="submit"
                disabled={isLoading}
                className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center mt-8"
              >
                {
                  isLoading ? (
                    <>
                    <Loader2 w-4 h-4 animate-spin mr-2 />
                    SignIn....
                    </>
                  ) : (
                    'SignIn'
                  )
                }
              </button>
            </form>

            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-slate-200"></div>
              <span className="px-4 text-sm text-slate-500">or</span>
              <div className="flex-1 border-t border-slate-200"></div>
            </div>

            <div className="text-center">
              <p className="text-slate-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};