
import { Router } from "express";
import { auth } from "../middlewares/auth";
import { sanitizer } from "../middlewares/sanitizer";
import { validate } from "../middlewares/validation";
import { addMemberSchema, createGroupSchema, updateGroupSchema } from "../schemas/groupSchema";
import { handleAddMember, handleCreateGroup, handleDeleteGroup, handleGetGroupBalance, handleGetGroupDetails, handleGetGroups, handleRemoveMember, handleUpdateGroup } from "../controllers/groupControllers";


const router = Router();


router.use(auth);

router.post('/',sanitizer,validate(createGroupSchema),handleCreateGroup);
router.get('/',handleGetGroups);
router.get('/:groupId', handleGetGroupDetails);
router.put('/:groupId',sanitizer,validate(updateGroupSchema),handleUpdateGroup);
router.delete('/:groupId', handleDeleteGroup);

router.post('/:groupId/members',sanitizer,validate(addMemberSchema),handleAddMember);
router.delete('/:groupId/members/:memberId',handleRemoveMember);

router.get('/:groupId/balance',handleGetGroupBalance);

export default router;



