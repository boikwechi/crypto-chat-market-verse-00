
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Send, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  id: number;
  text: string;
  sender: string;
  timestamp: Date;
};

type Conversation = {
  id: number;
  name: string;
  lastMessage: string;
  unreadCount: number;
  avatar: string;
  lastActive: Date;
  messages: Message[];
};

const Messaging = () => {
  const [activeConversation, setActiveConversation] = useState<number | null>(1);
  const [newMessage, setNewMessage] = useState("");
  
  const conversations: Conversation[] = [
    {
      id: 1,
      name: "Alice Johnson",
      lastMessage: "Did you see the latest update?",
      unreadCount: 2,
      avatar: "A",
      lastActive: new Date(Date.now() - 15 * 60000), // 15 min ago
      messages: [
        { id: 1, text: "Hey there! Have you checked the new crypto prices today?", sender: "other", timestamp: new Date(Date.now() - 3600000) },
        { id: 2, text: "Yeah, Bitcoin is going up again!", sender: "me", timestamp: new Date(Date.now() - 3500000) },
        { id: 3, text: "I earned 50 credits from our last conversation", sender: "other", timestamp: new Date(Date.now() - 3400000) },
        { id: 4, text: "That's awesome! I'm saving mine to convert to ETH", sender: "me", timestamp: new Date(Date.now() - 3300000) },
        { id: 5, text: "Smart move. Did you see the latest update?", sender: "other", timestamp: new Date(Date.now() - 3200000) },
      ]
    },
    {
      id: 2,
      name: "Bob Smith",
      lastMessage: "How's your trading going?",
      unreadCount: 0,
      avatar: "B",
      lastActive: new Date(Date.now() - 2 * 3600000), // 2 hours ago
      messages: [
        { id: 1, text: "How's your trading going?", sender: "other", timestamp: new Date(Date.now() - 7200000) },
      ]
    },
    {
      id: 3,
      name: "Crypto Group",
      lastMessage: "Charlie: Just bought more BTC!",
      unreadCount: 5,
      avatar: "C",
      lastActive: new Date(Date.now() - 10 * 60000), // 10 min ago
      messages: [
        { id: 1, text: "Charlie: Just bought more BTC!", sender: "other", timestamp: new Date(Date.now() - 600000) },
      ]
    }
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return;
    
    // In a real app, we would send the message to an API
    console.log("Sending message:", newMessage);
    
    // Reset the input field
    setNewMessage("");
    
    // Simulate earning credits for activity
    const toast = document.createEvent("CustomEvent");
    toast.initCustomEvent("toast", false, true, {
      title: "Credits Earned!",
      description: "You earned 5 credits for sending a message",
    });
    document.dispatchEvent(toast);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const currentChat = conversations.find(conv => conv.id === activeConversation);

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar - Conversations List */}
      <div className="w-full md:w-1/3 lg:w-1/4 border-r overflow-y-auto flex-shrink-0">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Messages</h2>
            <Button size="sm" variant="ghost" className="rounded-full">
              <MessageCircle className="h-5 w-5" />
            </Button>
          </div>
          <Input placeholder="Search conversations..." className="mb-4" />
        </div>
        
        {conversations.map(conversation => (
          <div 
            key={conversation.id} 
            onClick={() => setActiveConversation(conversation.id)}
            className={cn(
              "flex items-center p-4 hover:bg-muted/50 cursor-pointer",
              activeConversation === conversation.id && "bg-muted"
            )}
          >
            <Avatar className="h-10 w-10 mr-3">
              <div className="bg-cryptoPurple text-white flex items-center justify-center h-full w-full">
                {conversation.avatar}
              </div>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium truncate">{conversation.name}</h3>
                <span className="text-xs text-muted-foreground">
                  {formatTime(conversation.lastActive)}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-muted-foreground truncate">
                  {conversation.lastMessage}
                </p>
                {conversation.unreadCount > 0 && (
                  <span className="bg-cryptoPurple text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div className="hidden md:flex flex-col flex-1 overflow-hidden">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center">
              <Avatar className="h-8 w-8 mr-3">
                <div className="bg-cryptoPurple text-white flex items-center justify-center h-full w-full">
                  {currentChat?.avatar}
                </div>
              </Avatar>
              <div>
                <h3 className="font-medium">{currentChat?.name}</h3>
                <p className="text-xs text-muted-foreground">
                  Last active {formatTime(currentChat?.lastActive || new Date())}
                </p>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentChat?.messages.map(message => (
                <div key={message.id} className={cn(
                  "flex",
                  message.sender === "me" ? "justify-end" : "justify-start"
                )}>
                  <div className={cn(
                    "max-w-[80%] p-3 rounded-lg",
                    message.sender === "me" 
                      ? "bg-cryptoPurple text-white rounded-br-none" 
                      : "bg-muted rounded-bl-none"
                  )}>
                    <p>{message.text}</p>
                    <div className={cn(
                      "text-xs mt-1",
                      message.sender === "me" ? "text-white/70" : "text-muted-foreground"
                    )}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input 
                  placeholder="Type a message..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} className="crypto-button">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-center mt-2">
                <span className="text-xs text-muted-foreground">
                  Send a message to earn 5 credits
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Select a conversation</h3>
              <p className="text-muted-foreground">
                Choose a conversation to start messaging
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile placeholder */}
      <div className="md:hidden flex-1 flex items-center justify-center">
        <div className="text-center p-4">
          <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">Tap a conversation</h3>
          <p className="text-muted-foreground">
            Select a conversation from the list to view it
          </p>
        </div>
      </div>
    </div>
  );
};

export default Messaging;
