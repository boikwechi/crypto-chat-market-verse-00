
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Wallet, User, Send, ChartBar } from "lucide-react";

const Profile = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <div className="crypto-button flex items-center">
          <Wallet className="h-4 w-4 mr-2" />
          <span>120 Credits</span>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-cryptoPurple to-cryptoPurple-dark" />
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end -mt-12 sm:-mt-16 gap-4 sm:gap-6">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background">
              <div className="bg-cryptoPurple text-white flex items-center justify-center h-full w-full text-4xl">
                <User className="h-12 w-12" />
              </div>
            </Avatar>
            <div className="space-y-1 flex-1">
              <h2 className="text-2xl font-bold">John Doe</h2>
              <p className="text-muted-foreground">CryptoChat User since May 2025</p>
            </div>
            <Button className="crypto-button sm:self-center">Edit Profile</Button>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" defaultValue="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue="johndoe" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" defaultValue="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="walletAddress">Crypto wallet address</Label>
              <Input id="walletAddress" defaultValue="0x1a2b3c4d5e6f7g8h9i0j..." />
            </div>
            
            <div className="flex justify-end">
              <Button className="crypto-button">Save Changes</Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-cryptoPurple flex items-center justify-center text-white mr-3">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="font-medium">Total Credits</span>
                  </div>
                </div>
                <div className="text-xl font-bold">120</div>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium mb-2">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Send className="h-4 w-4 mr-2" />
                    Convert to Crypto
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <ChartBar className="h-4 w-4 mr-2" />
                    View Transaction History
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <Button className="w-full crypto-button">Update Password</Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between border rounded-lg p-4">
              <div>
                <h3 className="font-medium">Messages</h3>
                <p className="text-sm text-muted-foreground">
                  Get notified about new messages
                </p>
              </div>
              <div className="h-6 w-12 bg-cryptoPurple rounded-full relative">
                <div className="h-4 w-4 bg-white rounded-full absolute top-1 right-1"></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between border rounded-lg p-4">
              <div>
                <h3 className="font-medium">Market Alerts</h3>
                <p className="text-sm text-muted-foreground">
                  Price change notifications
                </p>
              </div>
              <div className="h-6 w-12 bg-cryptoPurple rounded-full relative">
                <div className="h-4 w-4 bg-white rounded-full absolute top-1 right-1"></div>
              </div>
            </div>
            
            <div className="flex items-center justify-between border rounded-lg p-4">
              <div>
                <h3 className="font-medium">Reward Updates</h3>
                <p className="text-sm text-muted-foreground">
                  Notifications about credit earnings
                </p>
              </div>
              <div className="h-6 w-12 bg-cryptoPurple rounded-full relative">
                <div className="h-4 w-4 bg-white rounded-full absolute top-1 right-1"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
