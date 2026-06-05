import { Request, Response } from 'express';
import {
  createGroup,
  getGroupsForUser,
  getGroupDetails,
  updateGroup,
  deleteGroup,
  addMemberToGroup,
  removeMemberFromGroup,
} from '../services/groupService'
import { prismaClient } from '../lib/prisma';

import {calculateGroupBalance} from '../services/balanceService'

//  CREATE | READ 
export const handleCreateGroup = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const creatorId = req.user!.id;
    const newGroup = await createGroup(name, creatorId);
    res.status(201).json({ message: 'Group created successfully', group: newGroup });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};



export const handleGetGroups = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const groups = await getGroupsForUser(userId);
    res.status(200).json(groups);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
};

export const handleGetGroupDetails = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const userId = req.user!.id;
    const group = await getGroupDetails(groupId as string);
    const isMember = group.members.some((member) => member.userId === userId);
    if (!isMember) {
      return res.status(403).json({ error: 'Forbidden: You are not a member of this group' });
    }
    res.status(200).json(group);
  } catch (error: any) {
    res.status(404).json({ error: 'Group not found' });
  }
};

//  UPDATE | DELETE 
export const handleUpdateGroup = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const { name } = req.body;
    const userId = req.user!.id;
    const group = await getGroupDetails(groupId as string);
    const isMember = group.members.some((member) => member.userId === userId);
    if (!isMember) {
      return res.status(403).json({ error: 'Forbidden: You are not a member of this group' });
    }
    const updatedGroup = await updateGroup(groupId as string, name);
    res.status(200).json({ message: 'Group updated successfully', group: updatedGroup });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const handleDeleteGroup = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const userId = req.user!.id;
    const group = await prismaClient.group.findUnique({ where: { id: groupId as string } });
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    if (group.creatorId !== userId) {
      return res.status(403).json({ error: 'Forbidden: Only the group creator can delete it' });
    }
    await deleteGroup(groupId as string);
    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};




export const handleAddMember = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const { email } = req.body;
    const addedByUserId = req.user!.id;

    // Ensure the user adding a member is part of the group
    const group = await getGroupDetails(groupId as string);
    const isMember = group.members.some((member) => member.userId === addedByUserId);
    if (!isMember) {
        return res.status(403).json({ error: "Forbidden: You must be a member to add others." });
    }

    const newMember = await addMemberToGroup(groupId as string, email, addedByUserId);
    
    res.status(201).json({ 
      message: 'Member added successfully', 
      member: newMember,
      type: 'MEMBER_ADDED' 
    });
    
  } catch (error: any) {
    
    if (error.message === 'INVITATION_SENT') {
      return res.status(200).json({ 
        message: 'Invitation sent to non-registered user',
        type: 'INVITATION_SENT' // we add this type for frontend
      });
    }
    
    res.status(400).json({ error: error.message });
  }
};































export const handleRemoveMember = async (req: Request, res: Response) => {
  try {
    const { groupId, memberId } = req.params;
    const removerId = req.user!.id;
    const group = await prismaClient.group.findUnique({ where: { id: groupId as string } });
    if (!group) {
        return res.status(404).json({ error: "Group not found" });
    }

    // Allow removal if the remover is the group creator OR if they are removing themself - leaving the group
    const isCreator = group.creatorId === removerId;
    const isSelfRemoval = removerId === memberId;

    if (!isCreator && !isSelfRemoval) {
        return res.status(403).json({ error: "Forbidden: You can only remove yourself or be removed by the creator." });
    }
    
    // group creater - Dont be remove or prevent from remove
    if (isCreator && isSelfRemoval) {
        return res.status(400).json({ error: "Group creator cannot leave the group. Delete the group instead." });
    }

    await removeMemberFromGroup(groupId as string, memberId as string);
    res.status(200).json({ message: 'Member removed successfully' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};



// Balance Wala 


export const handleGetGroupBalance = async(req:Request,res:Response)=>{
    try{

        const {groupId} = req.params;

        if(!groupId){
            return res.status(400).json({ error: 'Group ID is required' });
        }

        const userId = req.user!.id;

        // User -> group ka memeber hona chaiye
        
        const group = await getGroupDetails(groupId);

        const isMember = group.members.some((memeber)=>memeber.userId === userId);

        if(!isMember){
            return res.status(403).json({ error: 'Forbidden: You are not a member of this group.' });
        }

        // Apni balance wali sevice ko call kr lo 

        const balanceData = await calculateGroupBalance(groupId);
        res.status(200).json(balanceData);



    }catch(e:any){
        res.status(500).json({ e: 'Failed to calculate group balance.' });
    }
}
