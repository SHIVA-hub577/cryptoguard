import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

declare global {
  interface Window {
    phoneEmailListener: (userObj: { user_json_url: string }) => void;
  }
}

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Define the listener that phone.email will call upon successful verification
    window.phoneEmailListener = (userObj) => {
      const { user_json_url } = userObj;
      console.log("Phone.Email verification successful. URL:", user_json_url);
      
      setIsLoading(true);
      setErrorMsg('Phone verified. Finalizing login...');

      // 2. Send the URL to your backend to securely fetch user data
      // As per your guide, this is where you'd call your Node.js endpoint.
      /*
      fetch("http://localhost:5000/api/verify-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_json_url })
      })
      .then(res => res.json())
      .then(verifiedUser => {
        console.log("Verified User from backend:", verifiedUser);
        login(verifiedUser.phone_number); // Login with verified phone
        navigate('/dashboard');
      })
      .catch(err => {
        console.error(err);
        setErrorMsg("Phone verification failed. Please try again.");
        setIsLoading(false);
      });
      */

      // 3. For hackathon demo: Simulate successful login after verification
      setTimeout(() => {
        login(`user_phone_${user_json_url.slice(-10)}`);
        setIsLoading(false);
        navigate('/dashboard');
      }, 1500);
    };

    // 4. Dynamically load the phone.email script (React-friendly way)
    const script = document.createElement('script');
    script.src = "https://www.phone.email/sign_in_button_v1.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [login, navigate]);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!validateEmail(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      login(email);
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-bg-void flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-purple/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-cyan/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-bg-surface border border-border rounded-2xl p-8 shadow-2xl relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-purple to-brand-cyan rounded-xl flex items-center justify-center shadow-lg shadow-brand-purple/20 mb-4">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display font-bold text-2xl text-center">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-text-secondary text-sm mt-2 text-center">
            {isLogin ? 'Access your risk dashboard and AI insights.' : 'Start analyzing crypto risks today.'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="email"
                required
                pattern="^\S+@\S+\.\S+$"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-bg-elevated border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-purple transition-colors"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-bg-elevated border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-brand-purple transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isLoading && !errorMsg.startsWith('Phone') ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink mx-4 text-xs text-text-muted uppercase">Or</span>
          <div className="flex-grow border-t border-border"></div>
        </div>

        {/* --- Phone.Email OTP Login Button --- */}
        {/* This div is automatically detected by the phone.email script */}
        <div className="pe_signin_button" data-client-id="11069078944237683366"></div>

        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-sm text-text-secondary">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-brand-cyan hover:text-white font-medium transition-colors"
            >
              {isLogin ? 'Join Now' : 'Sign In'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}