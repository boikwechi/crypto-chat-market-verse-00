
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useTheme } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Camera, Loader2, Trash2, QrCode, Wallet } from "lucide-react";

const Profile = () => {
  const { profile, refreshProfile, deleteAccount, updateProfilePicture } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    display_name: "",
    bio: "",
    wallet_address: "",
    connected_apps: {} as Record<string, boolean>
  });
  
  const [notifications, setNotifications] = useState(true);
  const { theme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Mock blockchain apps for demo
  const blockchainApps = [
    { id: "metamask", name: "MetaMask", logo: "🦊" },
    { id: "wallet_connect", name: "WalletConnect", logo: "🔗" },
    { id: "coinbase", name: "Coinbase Wallet", logo: "💰" },
    { id: "phantom", name: "Phantom", logo: "👻" }
  ];
  
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        display_name: profile.display_name || "",
        bio: profile.bio || "",
        wallet_address: profile.wallet_address || "",
        connected_apps: profile.connected_apps || {}
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
          connected_apps: formData.connected_apps,
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
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 5MB.");
      return;
    }
    
    // Check file type
    if (!file.type.includes('image/')) {
      toast.error("Only image files are allowed.");
      return;
    }
    
    setIsUploading(true);
    try {
      await updateProfilePicture(file);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  const handleConnectApp = (appId: string) => {
    // In a real app, this would trigger an OAuth flow or wallet connection
    // For demo purposes, we'll just toggle the connection status
    setFormData(prev => ({
      ...prev,
      connected_apps: {
        ...prev.connected_apps,
        [appId]: !prev.connected_apps?.[appId]
      }
    }));
    
    toast.success(`${blockchainApps.find(app => app.id === appId)?.name} ${formData.connected_apps?.[appId] ? 'disconnected' : 'connected'} successfully!`);
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
          <div className="relative">
            <Avatar className="h-20 w-20 border-2 border-cryptoPurple">
              {profile.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt="User avatar"
                  className="h-full w-full object-cover" 
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-muted text-xl font-semibold">
                  {profile.display_name?.charAt(0) || profile.username?.charAt(0)}
                </div>
              )}
            </Avatar>
            
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
            
            <Button 
              size="icon"
              className="absolute -bottom-2 -right-2 rounded-full"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </Button>
          </div>
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
            <div className="flex justify-between items-center">
              <Label htmlFor="wallet_address">Wallet Address</Label>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <QrCode className="mr-2 h-4 w-4" />
                    Scan QR
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Scan QR Code</DialogTitle>
                    <DialogDescription>
                      Scan a QR code with your wallet address
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex justify-center py-4">
                    <div className="bg-white p-4 rounded">
                      <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                        <p className="text-sm text-gray-500">Camera access needed</p>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => toast.error("Camera access not available in demo")}>
                      Enable Camera
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            <Input 
              id="wallet_address" 
              value={formData.wallet_address} 
              onChange={handleInputChange} 
              placeholder="Your blockchain wallet address"
            />
          </div>
          
          <div className="space-y-3">
            <Label>Connected Blockchain Apps</Label>
            <div className="grid grid-cols-2 gap-2">
              {blockchainApps.map(app => (
                <Button
                  key={app.id}
                  variant={formData.connected_apps?.[app.id] ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => handleConnectApp(app.id)}
                >
                  <span className="mr-2">{app.logo}</span>
                  <span>{app.name}</span>
                  {formData.connected_apps?.[app.id] && (
                    <span className="ml-auto text-xs bg-primary-foreground text-primary rounded-full px-2 py-1">
                      Connected
                    </span>
                  )}
                </Button>
              ))}
            </div>
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
      
      <Card className="mb-6 p-6">
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
      
      <Card className="p-6 border-destructive">
        <h2 className="text-xl font-semibold mb-4 text-destructive">Danger Zone</h2>
        
        <div>
          <p className="text-sm mb-4">
            Permanently delete your account and all of your content. This action cannot be undone.
          </p>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={deleteAccount} className="bg-destructive text-destructive-foreground">
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
