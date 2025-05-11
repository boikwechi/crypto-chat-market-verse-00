
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "@/components/ui/sonner";

const Profile = () => {
  const [name, setName] = useState("Alex Johnson");
  const [bio, setBio] = useState("Crypto enthusiast and tech lover");
  const [email, setEmail] = useState("alex@example.com");
  const [notifications, setNotifications] = useState(true);
  const { theme } = useTheme();
  
  const handleSave = () => {
    toast.success("Profile updated successfully!");
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      
      <Card className="mb-6 p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="h-20 w-20 border-2 border-cryptoPurple">
            <img src="https://i.pravatar.cc/100?img=52" alt="User avatar" />
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">{name}</h2>
            <p className="text-muted-foreground">{bio}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Input 
              id="bio" 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
            />
          </div>
          
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </Card>
      
      <Card className="mb-6 p-6">
        <h2 className="text-xl font-semibold mb-4">Appearance</h2>
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Theme</h3>
            <p className="text-sm text-muted-foreground">
              Currently using: {theme.charAt(0).toUpperCase() + theme.slice(1)} theme
            </p>
          </div>
          <ThemeToggle />
        </div>
      </Card>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications" className="font-medium">Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive alerts for new messages and activities</p>
            </div>
            <Switch 
              id="notifications" 
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
