import { Request, Response } from "express";
import { getGroupDetails } from "../services/groupService";
import { createSettlement, completeSettlement } from "../services/settlementService";

export const handleCreateSettlement = async (req: Request, res: Response) => {
  try {
    const { amount, groupId, receiverId } = req.body;
    const payerId = req.user!.id;

    if (payerId === receiverId)
      return res.status(400).json({ error: "Cannot settle with yourself" });

    const group = await getGroupDetails(groupId);
    const members = new Set(group.members.map((m) => m.userId));

    if (!members.has(payerId) || !members.has(receiverId))
      return res.status(403).json({ error: "Both must be group members" });

    const result = await createSettlement(payerId, receiverId, groupId, amount);

    return res.status(201).json({
      message: "Settlement created",
      settlement: result.settlement,
      expense: result.expense
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};


// remeber it - important Hai yeh
export const handleCompleteSettlement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updated = await completeSettlement(id);
    return res.json({ message: "Settlement completed", settlement: updated });

  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};
