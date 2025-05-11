
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageCircle, Bitcoin, Wallet, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { toast } from "@/components/ui/sonner";

const Navbar = () => {
  const location = useLocation();
  const [credits, setCredits] = useState(120);
  const [isLoggedIn, setIsLoggedIn] = useState(true); // For demo purposes

  const handleLogout = () => {
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
    // In a real app, you would handle actual logout functionality
  };

  const navItems = [
    { 
      name: "Messages", 
      path: "/", 
      icon: <MessageCircle className="h-5 w-5" /> 
    },
    { 
      name: "Market", 
      path: "/market", 
      icon: <Bitcoin className="h-5 w-5" /> 
    },
    { 
      name: "Rewards", 
      path: "/rewards", 
      icon: <Wallet className="h-5 w-5" /> 
    },
    { 
      name: "Profile", 
      path: "/profile", 
      icon: <User className="h-5 w-5" /> 
    }
  ];

  return (
    <>
      {/* Top navbar for desktop */}
      <div className="hidden md:block fixed top-0 left-0 right-0 h-16 border-b bg-background z-50">
        <div className="container h-full mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-cryptoPurple">CryptoChat</h1>
          </div>
          
          <div className="flex items-center space-x-6">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md transition-colors",
                  location.pathname === item.path 
                    ? "text-cryptoPurple font-medium" 
                    : "text-muted-foreground hover:text-cryptoPurple"
                )}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="crypto-button flex items-center">
              <Wallet className="h-4 w-4 mr-2" />
              <span>{credits} Credits</span>
            </div>
            
            <ThemeToggle />
            
            {isLoggedIn ? (
              <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="outline" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom navbar for mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t z-50">
        <div className="grid grid-cols-4 h-full">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center",
                location.pathname === item.path 
                  ? "text-cryptoPurple" 
                  : "text-muted-foreground"
              )}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;
