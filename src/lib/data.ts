import { supabase } from './supabase';
import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string | null;
}

export interface Meeting {
  id: string;
  organizer_id: string;
  topic: string;
  date: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
  organizer?: User;
}

export interface Resource {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export async function createInitialUsers() {
  const users = [
    {
      name: 'יפעת איתן',
      email: 'yifat@aaa-ins.co.il',
      avatar_url: null
    },
    {
      name: 'אורי חמודיס',
      email: 'uri@aaa-ins.co.il',
      avatar_url: null
    },
    {
      name: 'זיו רוט',
      email: 'ziv@aaa-ins.co.il',
      avatar_url: null
    },
    {
      name: 'אלעד עמרם',
      email: 'elad@aaa-ins.co.il',
      avatar_url: null
    },
    {
      name: 'רן ליבנה',
      email: 'ran@aaa-ins.co.il',
      avatar_url: null
    },
    {
      name: 'פנינה ליבנה',
      email: 'pnina@aaa-ins.co.il',
      avatar_url: null
    },
    {
      name: 'טל פלד חדד',
      email: 'tal@aaa-ins.co.il',
      avatar_url: null
    },
    {
      name: 'שירות iClaim',
      email: 'service@aaa-ins.co.il',
      avatar_url: null
    }
  ];

  const createdUsers = [];

  for (const user of users) {
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', user.email)
      .single();

    if (!existingUser) {
      const { data, error } = await supabase
        .from('users')
        .insert(user)
        .select()
        .single();

      if (error) {
        console.error(`Error creating user ${user.name}:`, error);
      } else {
        console.log(`Created user: ${user.name}`);
        createdUsers.push(data);
      }
    } else {
      console.log(`User ${user.name} already exists`);
      createdUsers.push(existingUser);
    }
  }

  return createdUsers;
}

export async function uploadUserImages() {
  try {
    // Create avatars bucket if it doesn't exist
    const { data: buckets } = await supabase.storage.listBuckets();
    const avatarsBucketExists = buckets?.some(bucket => bucket.name === 'avatars');
    
    if (!avatarsBucketExists) {
      const { error } = await supabase.storage.createBucket('avatars', {
        public: true,
        fileSizeLimit: 1024 * 1024 * 2 // 2MB
      });
      
      if (error) {
        console.error('Error creating avatars bucket:', error);
        return;
      }
      console.log('Created avatars bucket');
    }

    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*');

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }

    // Map of email to image file path
    const imageMap = {
      'yifat@aaa-ins.co.il': '/home/ubuntu/upload/Ee_TTjU9gpDGMyvLRBtfK_9aa7608012b240379f490c21e3f274fd (1).jpg',
      'uri@aaa-ins.co.il': '/home/ubuntu/upload/7qZk4aTxcDAGgoYv1dT0F_1c92046b378e4d86a6024bdfd0aac763.jpg',
      'ziv@aaa-ins.co.il': '/home/ubuntu/ziv_image.jpg',
      'elad@aaa-ins.co.il': '/home/ubuntu/upload/LTMqoBGVIgkmS99tl0p6m_02d88f42682845a99eb7b7d6094ee45c.jpg',
      'ran@aaa-ins.co.il': '/home/ubuntu/ran_pnina_images/ran_image.png',
      'pnina@aaa-ins.co.il': '/home/ubuntu/ran_pnina_images/pnina_image.png'
    };

    // Upload images for each user
    for (const user of users || []) {
      const imagePath = imageMap[user.email];
      
      if (!imagePath) {
        console.log(`No image found for user: ${user.name}`);
        continue;
      }

      try {
        // Read the image file
        const fileBuffer = fs.readFileSync(imagePath);
        const fileExt = path.extname(imagePath).substring(1);
        const fileName = `${user.id}.${fileExt}`;
        
        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, fileBuffer, {
            contentType: `image/${fileExt}`,
            upsert: true
          });

        if (uploadError) {
          console.error(`Error uploading avatar for ${user.name}:`, uploadError);
          continue;
        }

        // Get the public URL
        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);

        // Update user record with avatar URL
        const { error: updateError } = await supabase
          .from('users')
          .update({ avatar_url: data.publicUrl })
          .eq('id', user.id);

        if (updateError) {
          console.error(`Error updating avatar URL for ${user.name}:`, updateError);
        } else {
          console.log(`Updated avatar for ${user.name}: ${data.publicUrl}`);
        }
      } catch (error) {
        console.error(`Error processing image for ${user.name}:`, error);
      }
    }

    console.log('User image upload process completed');
  } catch (error) {
    console.error('Error in uploadUserImages:', error);
  }
}