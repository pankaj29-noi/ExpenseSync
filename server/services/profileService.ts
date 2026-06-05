import {User} from "@prisma/client";
import {prismaClient} from '../lib/prisma';
import {supabase} from '../lib/supabase'


// yeh update ke liye hai -> jb bhi apne ko services mein update jaisa kuch krna ho to iska dhayan rakhio
interface userProfile{
    name?:string,
    email?:string,
}



export const getProfile = async(userId:string):Promise<User> => {
    const userProfile = await prismaClient.user.findUniqueOrThrow({
        where:{
            id:userId,
        }
    })

    return userProfile;
}


// export const updateProfile = async(userId:string, dataToUpdate:userProfile):Promise<User> => {
//     //Use regular auth update instead of admin API
//     if(dataToUpdate.email){
//         const { data: { user }, error: authError } = await supabase.auth.updateUser({
//             email: dataToUpdate.email,
//         });

//         if(authError){
//             throw new Error(`Failed to update email in Supabase: ${authError.message}`);
//         }
//     }

//     const updatedProfile = await prismaClient.user.update({
//         where:{
//             id:userId
//         },
//         data: dataToUpdate
//     })
    
//     return updatedProfile;
// }



import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);

export const updateProfile = async (userId: string, dataToUpdate: userProfile) => {
 
  if (dataToUpdate.email) {
    const { data: user, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      email: dataToUpdate.email,
    });

    if (error) {
      throw new Error(`Failed to update email in Supabase: ${error.message}`);
    }
  }

  const updatedProfile = await prismaClient.user.update({
    where: { id: userId },
    data: dataToUpdate
  });

  return updatedProfile;
};

