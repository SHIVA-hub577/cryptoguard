import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, User, ArrowRight, Loader2, KeyRound, CheckCircle2, RotateCcw, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

export function AuthPage() {
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(() => searchParams.get('mode') !== 'signup');
  const [step, setStep] = useState<'form' | 'otp'>('form'); // For signup OTP flow

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup') {
      setIsLogin(false);
      setStep('form');
    } else if (mode === 'login') {
      setIsLogin(true);
    }
  }, [searchParams]);

  // Form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const validateEmail = (val: string) => {
    return String(val)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!validateEmail(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('/api/auth/login', {
        email: email.trim().toLowerCase(),
        password,
      });

      if (response.data?.success && response.data.sessionToken) {
        login(response.data.sessionToken, response.data.user);
        navigate('/dashboard');
      } else {
        setErrorMsg('Authentication failed. Please check your credentials.');
      }
    } catch (err: any) {
      console.error('Login error', err);
      const msg = err.response?.data?.error || 'Failed to sign in. Please verify your email and password.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1: Send OTP for Signup
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('/api/auth/send-otp', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      if (response.data?.success) {
        setSuccessMsg(response.data.message || 'Verification code sent to your email.');
        setStep('otp');
        setResendCooldown(60); // 60 seconds cooldown
      }
    } catch (err: any) {
      console.error('Send OTP error', err);
      const msg = err.response?.data?.error || 'Failed to send verification code. Please check your email.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP & Complete Registration
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!otp || otp.trim().length !== 6) {
      setErrorMsg('Please enter the 6-digit code sent to your email.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('/api/auth/verify-otp', {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      });

      if (response.data?.success && response.data.sessionToken) {
        login(response.data.sessionToken, response.data.user);
        navigate('/dashboard');
      } else {
        setErrorMsg('Verification failed. Please check the code.');
      }
    } catch (err: any) {
      console.error('Verify OTP error', err);
      const msg = err.response?.data?.error || 'Invalid or expired verification code.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || isLoading) return;
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/auth/send-otp', {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      if (response.data?.success) {
        setSuccessMsg('A new verification code has been dispatched to your email.');
        setResendCooldown(60);
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || 'Failed to resend verification code.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-void flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-purple/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-cyan/15 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-bg-surface border border-border rounded-3xl p-8 shadow-2xl relative z-10"
      >
        {/* Header Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-brand-purple via-brand-glow to-brand-cyan rounded-2xl flex items-center justify-center shadow-xl shadow-brand-purple/20 mb-3 border border-white/10">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-white tracking-tight">
            {isLogin ? 'Welcome to CryptoGuard' : step === 'otp' ? 'Verify Your Email' : 'Create Free Account'}
          </h1>
          <p className="text-text-secondary text-xs mt-1.5 text-center max-w-xs">
            {isLogin
              ? 'Access real-time risk surveillance and AI trading insights.'
              : step === 'otp'
              ? `Enter the 6-digit OTP code sent to ${email}`
              : 'Join the institutional-grade crypto intelligence platform.'}
          </p>
        </div>

        {/* Tab Switcher (only shown when not on OTP step) */}
        {step === 'form' && (
          <div className="flex p-1 bg-bg-void rounded-xl border border-border mb-6">
            <button
              onClick={() => {
                setIsLogin(true);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                isLogin
                  ? 'bg-brand-purple text-white shadow-md'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                !isLogin
                  ? 'bg-brand-purple text-white shadow-md'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Feedback alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs text-center leading-relaxed">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/25 text-green-400 text-xs text-center leading-relaxed flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ======================================================== */}
          {/* LOGIN FORM                                               */}
          {/* ======================================================== */}
          {isLogin ? (
            <motion.form
              key="login"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleLoginSubmit}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-bg-elevated border border-border rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-brand-purple transition-colors placeholder:text-text-muted"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-bg-elevated border border-border rounded-xl py-3 pl-10 pr-11 text-sm text-white focus:outline-none focus:border-brand-purple transition-colors placeholder:text-text-muted"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-brand-purple to-brand-glow hover:opacity-95 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-brand-purple/25 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Verifying Session...
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          ) : step === 'form' ? (
            /* ======================================================== */
            /* SIGNUP STEP 1: Details Entry                             */
            /* ======================================================== */
            <motion.form
              key="signup-step-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSendOtp}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-bg-elevated border border-border rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-brand-purple transition-colors placeholder:text-text-muted"
                    placeholder="Alex Morgan"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-bg-elevated border border-border rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-brand-purple transition-colors placeholder:text-text-muted"
                    placeholder="name@example.com"
                  />
                </div>
                <span className="text-[11px] text-text-muted block">We will send a 6-digit OTP code to this email</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-bg-elevated border border-border rounded-xl py-3 pl-10 pr-11 text-sm text-white focus:outline-none focus:border-brand-purple transition-colors placeholder:text-text-muted"
                    placeholder="Minimum 8 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-brand-purple to-brand-glow hover:opacity-95 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-brand-purple/25 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Sending Email OTP...
                    </>
                  ) : (
                    <>
                      <span>Send Verification Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          ) : (
            /* ======================================================== */
            /* SIGNUP STEP 2: OTP Verification                         */
            /* ======================================================== */
            <motion.form
              key="signup-step-2-otp"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleVerifyOtp}
              className="space-y-5"
            >
              <div className="p-3.5 rounded-2xl bg-bg-void border border-border/80 text-center space-y-1">
                <span className="text-[11px] text-text-muted">Verification code sent to:</span>
                <p className="text-sm font-bold text-brand-cyan font-mono">{email}</p>
                <button
                  type="button"
                  onClick={() => {
                    setStep('form');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-[11px] text-text-muted hover:text-white underline inline-flex items-center gap-1 cursor-pointer pt-1"
                >
                  <ArrowLeft className="w-3 h-3" /> Edit Email Address
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block text-center">
                  Enter 6-Digit Code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-purple" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full bg-bg-elevated border-2 border-brand-purple/50 rounded-2xl py-3.5 pl-12 pr-4 text-center font-mono text-2xl font-bold tracking-[8px] text-white focus:outline-none focus:border-brand-purple shadow-inner"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs px-1">
                <span className="text-text-muted">Didn't receive code?</span>
                <button
                  type="button"
                  disabled={resendCooldown > 0 || isLoading}
                  onClick={handleResendOtp}
                  className={`font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                    resendCooldown > 0
                      ? 'text-text-muted cursor-not-allowed'
                      : 'text-brand-cyan hover:text-white'
                  }`}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full py-3.5 bg-gradient-to-r from-brand-purple to-brand-glow hover:opacity-95 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-brand-purple/25 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Verifying & Saving Session...
                    </>
                  ) : (
                    <>
                      <span>Verify & Launch Platform</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Footer info */}
        <div className="mt-6 pt-5 border-t border-border text-center">
          <p className="text-xs text-text-secondary">
            {isLogin ? (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    setIsLogin(false);
                    setStep('form');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-brand-cyan hover:text-white font-semibold transition-colors cursor-pointer"
                >
                  Create one now
                </button>
              </>
            ) : (
              <>
                Already registered?{' '}
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setStep('form');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-brand-cyan hover:text-white font-semibold transition-colors cursor-pointer"
                >
                  Sign in here
                </button>
              </>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
}