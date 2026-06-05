import { Router } from "express";
import { auth } from "../middlewares/auth";
import { sanitizer } from "../middlewares/sanitizer";
import { validate } from "../middlewares/validation";
import { createSettlementSchema } from "../schemas/settlementSchema";
import { handleCreateSettlement, handleCompleteSettlement } from "../controllers/settlementController";

const router = Router();
router.use(auth);

router.post(
  "/",
  sanitizer,
  validate(createSettlementSchema),
  handleCreateSettlement
);

router.patch("/:id/complete", handleCompleteSettlement);

export default router;
