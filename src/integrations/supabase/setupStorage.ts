
import { supabase } from './client';

export const setupStorage = async () => {
  // Check if avatars bucket exists, create if not
  const { data: buckets } = await supabase.storage.listBuckets();
  
  if (!buckets?.find(bucket => bucket.name === 'avatars')) {
    const { data, error } = await supabase.storage.createBucket('avatars', {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024, // 5MB
    });
    
    if (error) {
      console.error('Error creating avatars bucket:', error);
    } else {
      console.log('Created avatars bucket successfully');
    }
  }
};

// Setup storage on app initialization
setupStorage().catch(console.error);
