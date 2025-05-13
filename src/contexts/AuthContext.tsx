
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: any | null;
  isLoading: boolean;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signUpWithPhone: (phone: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithPhone: (phone: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  updateProfilePicture: (file: File) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Function to fetch user profile from the profiles table
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in fetchProfile:", error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  // Set up authentication listener
  useEffect(() => {
    setIsLoading(true);

    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Defer profile fetching to avoid Supabase client deadlock
        if (currentSession?.user) {
          setTimeout(() => {
            fetchProfile(currentSession.user.id).then(profileData => {
              setProfile(profileData);
              setIsLoading(false);
            });
          }, 0);
        } else {
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    // Then check for the initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      if (initialSession?.user) {
        fetchProfile(initialSession.user.id).then(profileData => {
          setProfile(profileData);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }
        }
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      toast.success("Account created! Check your email for confirmation.");
      return;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };
  
  const signUpWithPhone = async (phone: string, password: string, username: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        phone,
        password,
        options: {
          data: { username }
        }
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      toast.success("Account created! Verify your phone number with the code sent.");
      return;
    } catch (error) {
      console.error("Signup with phone error:", error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      toast.success("Signed in successfully!");
      navigate("/");
      return;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };
  
  const signInWithPhone = async (phone: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        phone,
        password,
      });

      if (error) {
        toast.error(error.message);
        throw error;
      }

      toast.success("Signed in successfully!");
      navigate("/");
      return;
    } catch (error) {
      console.error("Login with phone error:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      toast.success("Signed out successfully");
      navigate("/auth");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };
  
  const deleteAccount = async () => {
    try {
      if (!user) {
        toast.error("No user logged in");
        return;
      }

      // Delete user data from database
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (profileError) throw profileError;
      
      // Delete the user authentication account
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
      
      if (authError) {
        // Fallback to sign out if admin delete fails
        await supabase.auth.signOut();
        toast.error("Could not completely delete account. Please contact support.");
        navigate("/auth");
        return;
      }
      
      toast.success("Account deleted successfully");
      navigate("/auth");
    } catch (error: any) {
      console.error("Delete account error:", error);
      toast.error(`Failed to delete account: ${error.message}`);
    }
  };
  
  const updateProfilePicture = async (file: File): Promise<string | null> => {
    try {
      if (!user) {
        toast.error("No user logged in");
        return null;
      }
      
      // Create a unique file path for the avatar
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${user.id}/${Date.now()}.${fileExt}`;
      
      // Upload the file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      // Update the user's profile with the new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);
        
      if (updateError) throw updateError;
      
      // Refresh the profile to get updated data
      await refreshProfile();
      
      toast.success("Profile picture updated successfully");
      return publicUrl;
    } catch (error: any) {
      console.error("Update profile picture error:", error);
      toast.error(`Failed to update profile picture: ${error.message}`);
      return null;
    }
  };

  const value = {
    user,
    session,
    profile,
    isLoading,
    signUp,
    signUpWithPhone,
    signIn,
    signInWithPhone,
    signOut,
    refreshProfile,
    deleteAccount,
    updateProfilePicture,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}
