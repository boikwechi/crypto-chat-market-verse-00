
import { useState } from "react";
import { Search, UserRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { toast } from "@/components/ui/sonner";

interface User {
  id: string;
  username: string;
  avatar_url: string;
  display_name: string | null;
  email?: string;
  phone?: string;
}

interface SearchUsersProps {
  onSelectUser: (user: User) => void;
}

export default function SearchUsers({ onSelectUser }: SearchUsersProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { user } = useAuth();

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }
    
    setIsSearching(true);

    try {
      // Enhanced query to search by username, display_name, email, or phone
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, avatar_url, display_name, email, phone")
        .or(`username.ilike.%${query}%, display_name.ilike.%${query}%, email.ilike.%${query}%, phone.ilike.%${query}%`)
        .neq("id", user?.id || "")
        .limit(10);

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      console.error("Error searching users:", error);
      toast.error("Failed to search users");
    } finally {
      setIsSearching(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      // Reset search when closing
      setSearchQuery("");
      setUsers([]);
    }
  };

  const handleSelectUser = (selectedUser: User) => {
    onSelectUser(selectedUser);
    setOpen(false);
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="w-full justify-start text-muted-foreground" 
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        <span>Search users by name, email or phone...</span>
      </Button>

      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <CommandInput 
          placeholder="Search for users by name, email or phone..." 
          value={searchQuery}
          onValueChange={(value) => {
            setSearchQuery(value);
            handleSearch(value);
          }}
        />
        <CommandList>
          {isSearching ? (
            <div className="flex items-center justify-center p-4">
              <p className="text-sm text-muted-foreground">Searching...</p>
            </div>
          ) : (
            <>
              <CommandEmpty>No users found.</CommandEmpty>
              <CommandGroup heading="Users">
                {users.map((user) => (
                  <CommandItem
                    key={user.id}
                    onSelect={() => handleSelectUser(user)}
                    className="flex items-center"
                  >
                    <Avatar className="h-8 w-8 mr-2">
                      <div className="bg-cryptoPurple text-white flex items-center justify-center h-full w-full">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt={user.username} />
                        ) : (
                          <UserRound className="h-4 w-4" />
                        )}
                      </div>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">
                        {user.display_name || user.username}
                      </p>
                      <div className="flex flex-col text-xs text-muted-foreground">
                        {user.display_name && (
                          <span>@{user.username}</span>
                        )}
                        {user.email && (
                          <span className="truncate">{user.email}</span>
                        )}
                        {user.phone && (
                          <span>{user.phone}</span>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
