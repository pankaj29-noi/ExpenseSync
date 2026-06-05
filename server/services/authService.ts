import { supabase } from '../lib/supabase';
import { prismaClient } from '../lib/prisma';
import type { Session, User } from '@supabase/supabase-js';
import type { User as PrismaUser } from '@prisma/client';
import {config} from 'dotenv'
config();

export const registerUser = async (name: string, email: string, password: string): Promise<PrismaUser> => {
    
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true, 
        user_metadata: { name: name },
    });

    if (authError) {
        throw new Error(`Supabase auth error: ${authError.message}`);
    }

    if (!authData.user) {
        throw new Error('User could not be created in Supabase.');
    }

    
    try {
        
        for (let i = 0; i < 5; i++) {
            const newUserProfile = await prismaClient.user.findUnique({
                where: { id: authData.user.id },
            });
            if (newUserProfile) {
                return newUserProfile; 
            }
            
            await new Promise((resolve) => setTimeout(resolve, 200));
        }
       
        throw new Error('User profile was not created in the database in time.');

    } catch (prismaError: any) {
        
        await supabase.auth.admin.deleteUser(authData.user.id);
        throw new Error(`Prisma fetch error: ${prismaError.message}`);
    }
};



export const loginUser = async (email: string, password: string): Promise<Session> => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        throw new Error(error.message);
    }


    if (!data.session) {
        throw new Error('Login successful, but no session was created. MFA might be required.');
    }
    
    return data.session;
};




export const logoutUser = async (accessToken?: string): Promise<void> => {
    try {
        
        const { error } = await supabase.auth.signOut();

        if (error) {
            throw new Error(error.message);
        }

       
        if (accessToken && process.env.SUPABASE_SERVICE_ROLE_KEY) {
            const { error: adminError } = await supabase.auth.admin.signOut(accessToken);
            if (adminError) {
                console.log('Admin signout warning:', adminError.message);
                
            }
        }

    } catch (error) {
        throw error;
    }
};







export const changePassword = async (
    userEmail: string, 
    currentPassword: string, 
    newPassword: string
): Promise<{ access_token: string; refresh_token: string }> => {
    try {
        
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: userEmail,
            password: currentPassword,
        });

        if (signInError) {
            throw new Error('Current password is not correct.');
        }

        
        const { error: updateError } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (updateError) {
            throw new Error(`Failed to update password: ${updateError.message}`);
        }

        
        const { data: newSession, error: newSessionError } = await supabase.auth.signInWithPassword({
            email: userEmail,
            password: newPassword
        });

        if (newSessionError || !newSession.session) {
            throw new Error('Failed to create new session after password change');
        }

        
        return {
            access_token: newSession.session.access_token,
            refresh_token: newSession.session.refresh_token
        };

    } catch (error) {
        throw error;
    }
};
