
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Profile = () => {
  const { profile, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    display_name: "",
    bio: "",
    wallet_address: ""
  });
  
  const [notifications, setNotifications] = useState(true);
  const { theme } = useTheme();
  
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        display_name: profile.display_name || "",
        bio: profile.bio || "",
        wallet_address: profile.wallet_address || ""
      });
      setIsLoading(false);
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    if (!profile) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: formData.display_name,
          bio: formData.bio,
          wallet_address: formData.wallet_address,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);

      if (error) {
        throw error;
      }

      await refreshProfile();
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error("Failed to update profile: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading || !profile) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-cryptoPurple" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      
      <Card className="mb-6 p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Avatar className="h-20 w-20 border-2 border-cryptoPurple">
            <img 
              src={profile.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.username}`} 
              alt="User avatar" 
            />
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">{profile.display_name || profile.username}</h2>
            <p className="text-muted-foreground">{profile.bio || "No bio yet"}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              value={formData.username}
              disabled
              className="bg-muted"
            />
            <p className="text-sm text-muted-foreground">Username cannot be changed</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="display_name">Display Name</Label>
            <Input 
              id="display_name" 
              value={formData.display_name} 
              onChange={handleInputChange} 
              placeholder="How you want to be known"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Input 
              id="bio" 
              value={formData.bio} 
              onChange={handleInputChange} 
              placeholder="Tell us about yourself"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="wallet_address">Wallet Address</Label>
            <Input 
              id="wallet_address" 
              value={formData.wallet_address} 
              onChange={handleInputChange} 
              placeholder="Your blockchain wallet address"
            />
          </div>
          
          <Button 
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : "Save Changes"}
          </Button>
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
