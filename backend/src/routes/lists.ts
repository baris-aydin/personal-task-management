import { Router } from "express";
import { z } from "zod";
import { requireAuth, AuthedRequest } from "../middleware/auth";
import { List } from "../models/List";

const router = Router();

const CreateListSchema = z.object({
  id: z.string().min(1),          // frontend can send crypto.randomUUID()
  name: z.string().min(1),
  icon: z.string().min(1),
  color: z.string().optional()
});

router.get("/", requireAuth, async (req: AuthedRequest, res) => {
  const lists = await List.find({ userId: req.userId }).sort({ createdAt: 1 }).lean();
  res.json({ lists: lists.map(({ _id, __v, userId, ...rest }) => rest) });
});

router.post("/", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = CreateListSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const created = await List.create({ ...parsed.data, userId: req.userId });
  const { _id, __v, userId, ...list } = created.toObject();
  res.status(201).json({ list });
});

router.delete("/:id", requireAuth, async (req: AuthedRequest, res) => {
  const id = req.params.id;
  // (Optional) prevent deleting default ids on server too:
  if (["inbox", "personal", "work", "shopping"].includes(id)) {
    return res.status(400).json({ error: "Default lists cannot be deleted" });
  }

  const deleted = await List.deleteOne({ userId: req.userId, id });
  if (deleted.deletedCount === 0) return res.status(404).json({ error: "List not found" });
  res.status(204).send();
});

export default router;
