import React, { useState } from 'react';
import { useSearchParams, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertCircle, Shield, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { authAPI } from '../services/api';

const Login = () => {
  const { login, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminLogin = searchParams.get('admin') === 'true';
  const from = location.state?.from?.pathname || (isAdminLogin ? '/admin' : '/');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetToken = searchParams.get('token');
  const isResetPassword = !!resetToken;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isForgotPassword) {
      if (!email) {
        setErrorMsg('Email field is required.');
        return;
      }

      setLoading(true);
      try {
        let res;
        if (isAdminLogin) {
          res = await authAPI.adminForgotPassword({ email });
        } else {
          res = await authAPI.forgotPassword({ email });
        }
        setSuccessMsg(res.data.message || 'Email sent successfully. Please check your inbox and spam.');
        setIsForgotPassword(false);
      } catch (err) {
        setErrorMsg(err.response?.data?.message || 'Failed to send reset link.');
      }
      setLoading(false);
      return;
    }

    if (isResetPassword) {
      if (!password || !confirmPassword) {
        setErrorMsg('Please enter and confirm your new password.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }

      setLoading(true);
      try {
        const res = await authAPI.resetPassword({ token: resetToken, newPassword: password });
        setSuccessMsg(res.data.message || 'Password reset successful. You can now login.');
        // clear the token from url
        navigate('/login', { replace: true });
      } catch (err) {
        setErrorMsg(err.response?.data?.message || 'Failed to reset password.');
      }
      setLoading(false);
      return;
    }

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const res = await login(email, password, isAdminLogin);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMsg(res.message);
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-blue-400 border-r-transparent border-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white pt-28 pb-20 overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none"></div>

      <div className="w-full max-w-md px-4 sm:px-6 relative z-10">
        <div className="glass-panel border border-slate-800/80 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {isAdminLogin && (
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent"></div>
          )}

          <div className="text-center mb-8">
            <div className={`w-16 h-16 rounded-full bg-slate-100 border flex items-center justify-center mx-auto mb-4 ${isAdminLogin ? 'border-blue-400 glow-shadow-blue' : 'border-slate-800'}`}>
              {isAdminLogin ? (
                <Shield className="w-8 h-8 text-blue-400" />
              ) : (
                <LogIn className="w-8 h-8 text-black" />
              )}
            </div>
            <h1 className="font-orbitron font-extrabold text-2xl text-black tracking-wider mb-2">
              {isResetPassword ? 'RESET PASSWORD' : (isAdminLogin ? 'ADMIN PORTAL' : 'USER LOGIN')}
            </h1>
            <p className={`text-[10px] font-orbitron tracking-widest uppercase ${isAdminLogin ? 'text-[#3b82f6] text-glow-blue' : 'text-slate-500'}`}>
              {isResetPassword ? 'Enter new secure key' : (isAdminLogin ? 'Secure Access Clearance Required' : 'Access your account')}
            </p>
          </div>

          {errorMsg && (
            <div className="flex items-start space-x-2 border border-red-500/30 bg-red-500/5 rounded-lg p-4 text-xs text-red-400 mb-6">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="flex items-start space-x-2 border border-green-500/30 bg-green-500/5 rounded-lg p-4 text-xs text-green-400 mb-6">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isResetPassword && (
              <div>
                <label className="block text-xs font-orbitron font-bold text-slate-500 mb-2">Email Coordinate</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-800 rounded-lg px-4 py-3 text-sm text-black focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors outline-none"
                  placeholder="Enter your email"
                  required
                />
              </div>
            )}

            {(!isForgotPassword || isResetPassword) && (
              <div>
                <label className="block text-xs font-orbitron font-bold text-slate-500 mb-2">
                  {isResetPassword ? 'New Access Key' : 'Access Key'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-800 rounded-lg px-4 py-3 pr-12 text-sm text-black focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors outline-none"
                    placeholder={isResetPassword ? "Enter new password" : "Enter your password"}
                    required={!isForgotPassword || isResetPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {isResetPassword && (
              <div>
                <label className="block text-xs font-orbitron font-bold text-slate-500 mb-2">
                  Confirm Access Key
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-50/50 border border-slate-800 rounded-lg px-4 py-3 pr-12 text-sm text-black focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] transition-colors outline-none"
                    placeholder="Confirm new password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Removed inline confirm password fields since they go to a link now */}

            {!isForgotPassword && !isResetPassword && (
              <div className="flex justify-end mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(true);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-xs text-[#3b82f6] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded text-xs flex items-center justify-center font-bold tracking-wider transition-all ${isAdminLogin ? 'btn-cyber' : 'bg-black text-white hover:bg-slate-800 border border-black'}`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-t-white border-r-transparent border-slate-700 rounded-full animate-spin"></div>
              ) : (
                <span>{isResetPassword ? 'RESET PASSWORD' : (isForgotPassword ? 'SEND RESET LINK' : (isAdminLogin ? 'ADMIN LOGIN' : 'USER LOGIN'))}</span>
              )}
            </button>

            {isForgotPassword && !isResetPassword && (
              <button
                type="button"
                onClick={() => setIsForgotPassword(false)}
                className="w-full py-3 mt-3 rounded text-xs flex items-center justify-center font-bold tracking-wider text-slate-500 hover:text-black border border-slate-300 transition-all"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> CANCEL
              </button>
            )}

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
