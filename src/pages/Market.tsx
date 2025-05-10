
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bitcoin, TrendingUp, TrendingDown, ChartBar } from "lucide-react";

type CryptoData = {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change: number;
  volume: number;
  marketCap: number;
  logo: string;
};

const Market = () => {
  const [activeTab, setActiveTab] = useState("all");
  
  const cryptoData: CryptoData[] = [
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      price: 63842.12,
      change: 2.45,
      volume: 38573921543,
      marketCap: 1247483921543,
      logo: "B"
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      price: 3457.89,
      change: 1.23,
      volume: 17592745832,
      marketCap: 415738291053,
      logo: "E"
    },
    {
      id: "solana",
      name: "Solana",
      symbol: "SOL",
      price: 142.56,
      change: 5.67,
      volume: 6583921543,
      marketCap: 61489275432,
      logo: "S"
    },
    {
      id: "cardano",
      name: "Cardano",
      symbol: "ADA",
      price: 0.58,
      change: -1.24,
      volume: 1587392154,
      marketCap: 20574839215,
      logo: "A"
    },
    {
      id: "ripple",
      name: "Ripple",
      symbol: "XRP",
      price: 0.52,
      change: -0.75,
      volume: 2093847563,
      marketCap: 27492847563,
      logo: "X"
    },
    {
      id: "polkadot",
      name: "Polkadot",
      symbol: "DOT",
      price: 7.34,
      change: 3.21,
      volume: 928475638,
      marketCap: 9475638291,
      logo: "D"
    }
  ];

  // Sort by most traded (volume)
  const sortedByVolume = [...cryptoData].sort((a, b) => b.volume - a.volume);
  
  // Filter by trending (positive change)
  const trendingUp = [...cryptoData].filter(coin => coin.change > 0).sort((a, b) => b.change - a.change);
  
  // Filter by trending down (negative change)
  const trendingDown = [...cryptoData].filter(coin => coin.change < 0).sort((a, b) => a.change - b.change);

  const formatNumber = (num: number) => {
    if (num >= 1e12) {
      return (num / 1e12).toFixed(2) + 'T';
    }
    if (num >= 1e9) {
      return (num / 1e9).toFixed(2) + 'B';
    }
    if (num >= 1e6) {
      return (num / 1e6).toFixed(2) + 'M';
    }
    if (num >= 1e3) {
      return (num / 1e3).toFixed(2) + 'K';
    }
    return num.toFixed(2);
  };

  const getDisplayData = () => {
    switch (activeTab) {
      case 'trending-up':
        return trendingUp;
      case 'trending-down':
        return trendingDown;
      default:
        return sortedByVolume;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Crypto Market</h1>
        <div className="text-sm flex items-center bg-secondary px-3 py-1 rounded-md">
          <ChartBar className="h-4 w-4 mr-2 text-cryptoPurple" />
          <span>Market Cap: <span className="font-medium">${formatNumber(1785940000000)}</span></span>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Market Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="all" className="flex items-center">
                <Bitcoin className="h-4 w-4 mr-2" />
                Most Traded
              </TabsTrigger>
              <TabsTrigger value="trending-up" className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Trending Up
              </TabsTrigger>
              <TabsTrigger value="trending-down" className="flex items-center">
                <TrendingDown className="h-4 w-4 mr-2" />
                Trending Down
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-muted-foreground border-b">
                      <th className="text-left py-3 pl-4">Asset</th>
                      <th className="text-right py-3">Price</th>
                      <th className="text-right py-3">24h Change</th>
                      <th className="text-right py-3 pr-4">Volume</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getDisplayData().map((coin) => (
                      <tr key={coin.id} className="border-b last:border-b-0 hover:bg-muted/50">
                        <td className="py-4 pl-4">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-cryptoPurple-light flex items-center justify-center text-white mr-3">
                              {coin.logo}
                            </div>
                            <div>
                              <div className="font-medium">{coin.name}</div>
                              <div className="text-muted-foreground text-xs">{coin.symbol}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-right py-4 font-medium">
                          ${coin.price.toLocaleString()}
                        </td>
                        <td className={`text-right py-4 ${
                          coin.change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {coin.change >= 0 ? '+' : ''}{coin.change}%
                        </td>
                        <td className="text-right py-4 pr-4 text-muted-foreground">
                          ${formatNumber(coin.volume)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Bitcoin className="h-5 w-5 mr-2 text-cryptoPurple" />
              Convert Credits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Convert your earned credits to cryptocurrency
            </p>
            <button className="crypto-button w-full">
              Exchange Credits
            </button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-cryptoPurple" />
              Top Gainers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {trendingUp.slice(0, 3).map(coin => (
                <div key={coin.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-6 w-6 rounded-full bg-cryptoPurple-light flex items-center justify-center text-white text-xs mr-2">
                      {coin.logo}
                    </div>
                    <span>{coin.symbol}</span>
                  </div>
                  <span className="text-green-600">+{coin.change}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <ChartBar className="h-5 w-5 mr-2 text-cryptoPurple" />
              Market Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Cryptocurrencies:</span>
                <span>22,384</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Markets:</span>
                <span>31,748</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">BTC Dominance:</span>
                <span>48.7%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Market;
