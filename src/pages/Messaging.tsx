
import { useState, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Send, MessageCircle, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import SearchUsers from "@/components/SearchUsers";

type Message = {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
};

type Conversation = {
  id: string;
  name: string;
  lastMessage: string;
  unreadCount: number;
  avatar: string;
  lastActive: Date;
  messages: Message[];
};

interface User {
  id: string;
  username: string;
  avatar_url: string;
  display_name: string | null;
}

const Messaging = () => {
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, profile } = useAuth();
  
  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      // Get all conversations where the current user is a participant
      const { data: participations, error: participationsError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('profile_id', user?.id);

      if (participationsError) throw participationsError;

      if (participations && participations.length > 0) {
        const conversationIds = participations.map(p => p.conversation_id);
        
        // Get all conversations data
        const { data: conversationsData, error: conversationsError } = await supabase
          .from('conversations')
          .select('*')
          .in('id', conversationIds);

        if (conversationsError) throw conversationsError;

        // Format conversations data
        const formattedConversations: Conversation[] = await Promise.all(conversationsData.map(async (conv) => {
          // Get last message
          const { data: messagesData } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1);
          
          let lastMessage = "No messages yet";
          let lastActiveTime = conv.updated_at;
          
          if (messagesData && messagesData.length > 0) {
            lastMessage = messagesData[0].content;
            lastActiveTime = messagesData[0].created_at;
          }

          // For non-group conversations, get the other participant
          let name = conv.name;
          let avatar = "?";

          if (!conv.is_group) {
            const { data: participants } = await supabase
              .from('conversation_participants')
              .select('profile_id')
              .eq('conversation_id', conv.id)
              .neq('profile_id', user?.id);

            if (participants && participants.length > 0) {
              const otherId = participants[0].profile_id;
              
              const { data: otherUser } = await supabase
                .from('profiles')
                .select('username, display_name, avatar_url')
                .eq('id', otherId)
                .single();

              if (otherUser) {
                name = otherUser.display_name || otherUser.username;
                avatar = otherUser.avatar_url ? otherUser.avatar_url.charAt(0).toUpperCase() : name.charAt(0).toUpperCase();
              }
            }
          }

          // Get unread messages count
          const { data: participants } = await supabase
            .from('conversation_participants')
            .select('last_read')
            .eq('conversation_id', conv.id)
            .eq('profile_id', user?.id)
            .single();

          const lastRead = participants?.last_read;
          
          const { count, error: countError } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .gt('created_at', lastRead)
            .neq('sender_id', user?.id);

          if (countError) throw countError;

          return {
            id: conv.id,
            name: name,
            lastMessage: lastMessage,
            unreadCount: count || 0,
            avatar: avatar,
            lastActive: new Date(lastActiveTime),
            messages: []
          };
        }));

        // Sort by last active time
        formattedConversations.sort((a, b) => b.lastActive.getTime() - a.lastActive.getTime());
        
        setConversations(formattedConversations);
        
        // Set active conversation to the first one if not already set
        if (!activeConversation && formattedConversations.length > 0) {
          setActiveConversation(formattedConversations[0].id);
          fetchMessages(formattedConversations[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
      toast.error("Failed to load conversations");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('id, content, sender_id, created_at')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Update last read timestamp
      await supabase
        .from('conversation_participants')
        .update({ last_read: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('profile_id', user?.id);

      if (messagesData) {
        const currentConversation = conversations.find(c => c.id === conversationId);
        if (currentConversation) {
          const updatedMessages = messagesData.map(msg => ({
            id: msg.id,
            text: msg.content,
            sender: msg.sender_id === user?.id ? "me" : "other",
            timestamp: new Date(msg.created_at)
          }));

          // Update the conversation in state
          setConversations(prevConversations => 
            prevConversations.map(conv => 
              conv.id === conversationId 
                ? {...conv, messages: updatedMessages, unreadCount: 0} 
                : conv
            )
          );
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    }
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversation(id);
    fetchMessages(id);
  };

  const handleSelectUser = async (selectedUser: User) => {
    try {
      // Check if conversation already exists
      const { data: existingConversation, error: checkError } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('profile_id', user?.id);

      if (checkError) throw checkError;

      if (existingConversation && existingConversation.length > 0) {
        const conversationIds = existingConversation.map(c => c.conversation_id);
        
        const { data: matchingConversations, error: matchError } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('profile_id', selectedUser.id)
          .in('conversation_id', conversationIds);

        if (matchError) throw matchError;
        
        if (matchingConversations && matchingConversations.length > 0) {
          // Conversation exists, open it
          const conversationId = matchingConversations[0].conversation_id;
          setActiveConversation(conversationId);
          fetchMessages(conversationId);
          
          // Refresh conversations to ensure it's in the list
          fetchConversations();
          return;
        }
      }
      
      // Create new conversation
      const { data: newConversation, error: createError } = await supabase
        .from('conversations')
        .insert({ is_group: false })
        .select()
        .single();

      if (createError) throw createError;
      
      // Add participants
      const participants = [
        { conversation_id: newConversation.id, profile_id: user?.id },
        { conversation_id: newConversation.id, profile_id: selectedUser.id }
      ];

      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .insert(participants);

      if (participantsError) throw participantsError;
      
      // Refresh conversations and set active
      await fetchConversations();
      setActiveConversation(newConversation.id);

      toast.success(`Started conversation with ${selectedUser.display_name || selectedUser.username}`);
    } catch (error) {
      console.error("Error creating conversation:", error);
      toast.error("Failed to start conversation");
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation || !user?.id) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: activeConversation,
          sender_id: user.id,
          content: newMessage,
        });

      if (error) throw error;
      
      // Update conversation's updated_at
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', activeConversation);
      
      // Reset the input field
      setNewMessage("");
      
      // Fetch updated messages
      fetchMessages(activeConversation);
      
      // Refresh conversation list to update last message
      fetchConversations();
      
      // Simulate earning credits for activity
      if (profile) {
        // Add credits
        const { error: creditError } = await supabase
          .from('transactions')
          .insert({
            profile_id: user.id,
            amount: 5,
            transaction_type: 'message_sent',
            description: 'Credits earned for sending a message'
          });
        
        if (!creditError) {
          // Update user credits
          await supabase
            .from('profiles')
            .update({ credits: profile.credits + 5 })
            .eq('id', user.id);
          
          // Refresh user profile to show updated credits
          await supabase.auth.refreshSession();

          toast.success("You earned 5 credits for sending a message");
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
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
          
          <SearchUsers onSelectUser={handleSelectUser} />
          
          <Separator className="my-4" />
        </div>
        
        {isLoading ? (
          <div className="p-4 text-center">
            <p className="text-muted-foreground">Loading conversations...</p>
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-muted-foreground">No conversations yet.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Search for users to start chatting!
            </p>
          </div>
        ) : (
          conversations.map(conversation => (
            <div 
              key={conversation.id} 
              onClick={() => handleSelectConversation(conversation.id)}
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
          ))
        )}
      </div>

      {/* Chat Area */}
      <div className="hidden md:flex flex-col flex-1 overflow-hidden">
        {activeConversation && currentChat ? (
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
              {currentChat?.messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No messages yet</h3>
                    <p className="text-muted-foreground">
                      Send a message to start the conversation
                    </p>
                  </div>
                </div>
              ) : (
                currentChat?.messages.map(message => (
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
                ))
              )}
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
                Choose a conversation to start messaging or search for a user
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
