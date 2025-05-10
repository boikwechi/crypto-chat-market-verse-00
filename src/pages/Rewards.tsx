
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, MessageCircle, Send, ChartPie } from "lucide-react";

type Reward = {
  id: number;
  type: string;
  amount: number;
  description: string;
  timestamp: Date;
  icon: JSX.Element;
};

type Achievement = {
  id: number;
  name: string;
  description: string;
  progress: number;
  total: number;
  reward: number;
  completed: boolean;
};

const Rewards = () => {
  const rewardHistory: Reward[] = [
    {
      id: 1,
      type: "Message",
      amount: 5,
      description: "Sent a message to Alice",
      timestamp: new Date(Date.now() - 15 * 60000), // 15 minutes ago
      icon: <MessageCircle className="h-4 w-4" />
    },
    {
      id: 2,
      type: "Share",
      amount: 10,
      description: "Shared market analysis",
      timestamp: new Date(Date.now() - 3 * 3600000), // 3 hours ago
      icon: <Send className="h-4 w-4" />
    },
    {
      id: 3,
      type: "Login",
      amount: 20,
      description: "7-day login streak",
      timestamp: new Date(Date.now() - 24 * 3600000), // 1 day ago
      icon: <Wallet className="h-4 w-4" />
    },
    {
      id: 4,
      type: "Referral",
      amount: 50,
      description: "Bob Smith joined using your link",
      timestamp: new Date(Date.now() - 2 * 24 * 3600000), // 2 days ago
      icon: <ChartPie className="h-4 w-4" />
    }
  ];

  const achievements: Achievement[] = [
    {
      id: 1,
      name: "Messaging Pro",
      description: "Send 50 messages to earn a bonus",
      progress: 18,
      total: 50,
      reward: 100,
      completed: false
    },
    {
      id: 2,
      name: "Crypto Maven",
      description: "Check market trends for 7 consecutive days",
      progress: 5,
      total: 7,
      reward: 75,
      completed: false
    },
    {
      id: 3,
      name: "Network Builder",
      description: "Add 10 contacts to your network",
      progress: 10,
      total: 10,
      reward: 150,
      completed: true
    }
  ];

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) {
      return `Just now`;
    }
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes}m ago`;
    }
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours}h ago`;
    }
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Rewards Center</h1>
        <div className="crypto-button flex items-center">
          <Wallet className="h-4 w-4 mr-2" />
          <span>120 Credits</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Activity Rewards</CardTitle>
            <CardDescription>Earn credits for your actions in the app</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rewardHistory.map(reward => (
                <div key={reward.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-cryptoPurple-light flex items-center justify-center text-white mr-3">
                      {reward.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{reward.type} Reward</h4>
                      <p className="text-sm text-muted-foreground">{reward.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-cryptoPurple">+{reward.amount} Credits</div>
                    <div className="text-xs text-muted-foreground">{formatTimeAgo(reward.timestamp)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Credit Usage</CardTitle>
            <CardDescription>How you've used your credits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Available Credits</span>
                <span className="text-cryptoPurple font-bold">120</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>BTC Conversion</span>
                  <span>45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>ETH Conversion</span>
                  <span>30%</span>
                </div>
                <Progress value={30} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Saved</span>
                  <span>25%</span>
                </div>
                <Progress value={25} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Achievement Progress</CardTitle>
          <CardDescription>Complete tasks to earn bonus credits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map(achievement => (
              <div 
                key={achievement.id} 
                className={`border rounded-lg p-4 ${
                  achievement.completed 
                    ? 'border-green-500 bg-green-50 dark:bg-green-950/20' 
                    : 'border-muted'
                }`}
              >
                <h3 className="font-medium flex items-center">
                  {achievement.name}
                  {achievement.completed && (
                    <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                      Complete
                    </span>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  {achievement.description}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>
                      {achievement.progress} / {achievement.total}
                    </span>
                    <span className="text-cryptoPurple font-medium">
                      +{achievement.reward} Credits
                    </span>
                  </div>
                  <Progress 
                    value={(achievement.progress / achievement.total) * 100} 
                    className="h-1.5"
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Ways to Earn</CardTitle>
          <CardDescription>Activities that reward you with credits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border rounded-lg p-4 text-center">
              <div className="h-12 w-12 rounded-full bg-cryptoPurple/10 text-cryptoPurple flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="font-medium">Messaging</h3>
              <p className="text-sm text-muted-foreground mt-1">
                5 credits per message
              </p>
            </div>
            
            <div className="border rounded-lg p-4 text-center">
              <div className="h-12 w-12 rounded-full bg-cryptoPurple/10 text-cryptoPurple flex items-center justify-center mx-auto mb-3">
                <Send className="h-6 w-6" />
              </div>
              <h3 className="font-medium">Sharing</h3>
              <p className="text-sm text-muted-foreground mt-1">
                10 credits per share
              </p>
            </div>
            
            <div className="border rounded-lg p-4 text-center">
              <div className="h-12 w-12 rounded-full bg-cryptoPurple/10 text-cryptoPurple flex items-center justify-center mx-auto mb-3">
                <ChartPie className="h-6 w-6" />
              </div>
              <h3 className="font-medium">Referrals</h3>
              <p className="text-sm text-muted-foreground mt-1">
                50 credits per referral
              </p>
            </div>
            
            <div className="border rounded-lg p-4 text-center">
              <div className="h-12 w-12 rounded-full bg-cryptoPurple/10 text-cryptoPurple flex items-center justify-center mx-auto mb-3">
                <Wallet className="h-6 w-6" />
              </div>
              <h3 className="font-medium">Daily Login</h3>
              <p className="text-sm text-muted-foreground mt-1">
                20 credits per streak
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Rewards;
