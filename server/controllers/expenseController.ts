import { Request,Response } from "express";
import {createExpense,getExpenseForGroup,deleteExpense,updateExpense} from '../services/expenseService'
import {findOrCreateFriendGroup, getGroupDetails, findFriendGroup} from '../services/groupService'
import {prismaClient} from '../lib/prisma'


export const handleCreateExpense = async(req:Request,res:Response)=>{
    try{

        const {groupId, description, amount, category, splits } = req.body;
        const payerId = req.user!.id;

        // authorization check -> payer -> group ka memebr hona chiaye mitra
        
        const group = await getGroupDetails(groupId);
        const isPayerMember = group.members.some((member)=>member.userId === payerId);

        if(!isPayerMember){
             return res.status(403).json({ error: 'Forbidden: You must be a member of the group to add an expense.' });
        }

        // Minimum 2 people - required for expense
        if (group.members.length < 2) {
            return res.status(400).json({ 
                error: 'At least 2 members are required in the group to create an expense.' 
            });
        }

        // ab yeh check kro ki saare users jo split mein hai they are the member of group
        const groupMemberIds = new Set(group.members.map(m=>m.userId)); // Set bnana padega bro 

        for(const split of splits){
            if(!groupMemberIds.has(split.userId)){
                return res.status(400).json({ error: `User with ID ${split.userId} is not a member of this group.` });
            }
        }

        // ab apna kaam  -> group mein split create krna
        const newExpense = await createExpense({
      payerId,
      groupId,
      description,
      amount,
      category,
      splits,
    });

        res.status(201).json({ message: 'Expense created successfully', expense: newExpense });

    }catch(e:any){
        res.status(400).json({ error: e.message });
    }
}



export const handleGetExpensesForGroup = async(req:Request,res:Response)=>{
    try{

        const {groupId} = req.params;
        const userId = req.user!.id;

        // authorize -> user -> group ka member hona chaiye
        const group = await getGroupDetails(groupId as string);
        const isMember = group.members.some((member)=>member.userId === userId);

        if(!isMember){
            return res.status(403).json({ error: 'Forbidden: You are not a member of this group.' });
        }

        const expenses = await getExpenseForGroup(groupId as string);
        res.status(200).json(expenses);

    }catch(e:any){
        res.status(500).json({ error: 'Failed to fetch expenses.' });
    }
}



export const handleUpdateExpense = async(req:Request,res:Response)=>{
    try{

        const {expenseId} = req.params;
        const userId = req.user!.id;

        //  Authorize -> mtlb jo member edit kr rha hai usi ne pay kiya hai na 
        const expense = await prismaClient.expense.findUnique({
            where:{
                id:expenseId as string
            }
        })

        if(!expense){
             return res.status(404).json({ error: 'Expense not found.' });
        }

        if(expense.payerId !== userId) {
        return res.status(403).json({ error: 'Forbidden: Only the payer can update the expense.' });
    }

    const updatedExpense = await updateExpense(expenseId as string, req.body);

    res.status(200).json({ message: 'Expense updated successfully', expense: updatedExpense });

    }catch(e:any){
         res.status(400).json({ error: e.message });
    }
}

export const handleDeleteExpense  = async(req:Request,res:Response)=>{
    try{

        const {expenseId} = req.params;
        const userId = req.user!.id;

       // Authorize -> jo user hai woh original payer hai yaa nhi 
       const expense = await prismaClient.expense.findUnique({
        where:{
            id:expenseId as string
        }
       })

       if(!expense){
         return res.status(404).json({ error: 'Expense not found.' });
       }

    if (expense.payerId !== userId) {
      return res.status(403).json({ error: 'Forbidden: Only the payer can delete the expense.' });
    }

     await deleteExpense(expenseId as string);
    res.status(200).json({ message: 'Expense deleted successfully.' });
        

    }catch(e:any){
         res.status(400).json({ error: e.message });
    }
}

export const handleCreateFriendExpense = async (req: Request, res: Response) => {
  try {
    const { description, amount, category, splits, friendId } = req.body;
    const payerId = req.user!.id;

    
    const group = await findOrCreateFriendGroup(payerId, friendId);

    
   const newExpense = await createExpense({
      payerId,
      groupId: group.id, 
      description,
      amount,
      category,
      splits,
    });

    res.status(201).json(newExpense);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};





export const handleGetFriendExpenses = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user!.id;
    const { friendId } = req.params;

    // console.log('friend expenses:', { currentUserId, friendId });

    // Validate friendId
    if (!friendId) {
      return res.status(400).json({ error: 'Friend ID is required' });
    }

    // Find the hidden group between current user and friend
    const hiddenGroup = await findFriendGroup(currentUserId, friendId);
    
    if (!hiddenGroup) {
      // console.log('No hidden group found, returning empty array');
      // If no hidden group exists, return empty array (no expenses yet)
      return res.json([]);
    }

    // console.log('Hidden group found:', hiddenGroup.id);

    // Get all expenses from the hidden group
    const expenses = await prismaClient.expense.findMany({
      where: {
        groupId: hiddenGroup.id,
      },
      include: {
        payer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        splits: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        group: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // console.log(`Found ${expenses.length} friend expenses`);
    
    // Log each expense for debugging
    // expenses.forEach((expense, index) => {
    //   console.log(`   Expense ${index + 1}:`, {
    //     id: expense.id,
    //     description: expense.description,
    //     amount: expense.amount,
    //     payer: expense.payer.name,
    //     splitsCount: expense.splits.length,
    //   });
    // });

    res.json(expenses);
  } catch (error: any) {
    // console.error('Error fetching friend expenses:', error);
    res.status(500).json({ error: error.message });
  }
};


