import { Request, Response } from "express";
import {getProfile,updateProfile} from '../services/profileService'


// yehan pr apun jo bhi handler likh rhe hai usme kuch bhi return nhi krenge kyu ki yeh sb wahan pr handle ho chuka hai -> in Services


export const handleGetProfile = async(req:Request,res:Response)=>{

    try{

        const userId = req.user!.id; // ! <--> ? => diffn between both

        const userProfile = await getProfile(userId);


        res.status(200).json(userProfile);

    }catch(e:any){
         res.status(404).json({ e: 'Profile not found' });
    }

}


export const handleUpdateProfile= async(req:Request,res:Response)=>{
    try{

        const userId = req.user!.id;

        const updatedProfile = await updateProfile(userId,req.body);

        res.status(200).json({ message: 'Profile updated successfully', user: updatedProfile });
    }catch(e:any){
        res.status(400).json({ error: e.message });
    }
}
