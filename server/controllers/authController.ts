
import { Request,Response } from "express";
import {changePassword, loginUser,logoutUser,registerUser} from '../services/authService'

export const handleRegiter= async(req:Request,res:Response)=>{
    try{

        const {name,email,password} = req.body;

        const newUser = await registerUser(name, email, password);
        res.status(201).json({ message: 'User registered successfully', user: newUser });

    }catch(e:any){
        res.status(400).json({ error: e.message });
    }
}


export const handleLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const session = await loginUser(email, password);
    res.status(200).json({ message: 'Login successful', session });
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};


export const handleLogout = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    await logoutUser(token); 
    
    res.status(200).json({ message: 'Logout successful' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


export const handleChangePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user!; 

    const { access_token, refresh_token } = await changePassword(user.email!, currentPassword, newPassword);

    res.status(200).json({ 
      message: 'Password updated successfully',
      access_token: access_token,
      refresh_token: refresh_token
    });

  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};