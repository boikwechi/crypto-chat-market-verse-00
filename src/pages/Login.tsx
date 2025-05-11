
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Mock login function - In a real app, this would connect to your backend
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // For demo purposes, any login is successful
      toast.success("Login successful!");
      setIsLoggedIn(true);
      
      // Navigate to main app after successful login
      navigate("/");
    } catch (error) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // If already logged in, redirect to home
  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">
      {/* Blurry transparent background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cryptoPurple/30 to-cryptoPurple-dark/40 backdrop-blur-md z-0"></div>
      
      {/* Login form */}
      <div className="w-full max-w-md z-10 p-8 rounded-xl bg-white/20 dark:bg-cryptoBlack/40 backdrop-blur-lg border border-white/20 dark:border-white/10 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-cryptoPurple dark:text-white mb-1">CryptoChat</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">Sign in to access your account</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-200">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-white/50 dark:bg-cryptoBlack/50"
              required
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-200">Password</Label>
              <Link to="/forgot-password" className="text-xs text-cryptoPurple hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/50 dark:bg-cryptoBlack/50"
              required
            />
          </div>
          
          <Button
            type="submit"
            className="w-full crypto-button"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600 dark:text-gray-300">Don't have an account? </span>
          <Link to="/register" className="text-cryptoPurple hover:underline font-medium">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
