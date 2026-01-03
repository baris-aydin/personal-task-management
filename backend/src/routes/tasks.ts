import { Router } from "express";
import { z } from "zod";
import { requireAuth, AuthedRequest } from "../middleware/auth";
import { Task } from "../models/Task";

const router = Router();

const CreateTaskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  notes: z.string().optional(),
  dueDate: z.string().optional(),
  listId: z.string().min(1),
  createdAt: z.string().min(1),
  completed: z.boolean().optional()
});

const UpdateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  notes: z.string().optional(),
  dueDate: z.string().optional(),
  listId: z.string().min(1).optional(),
  completed: z.boolean().optional()
});

router.get("/", requireAuth, async (req: AuthedRequest, res) => {
  const listId = typeof req.query.listId === "string" ? req.query.listId : undefined;

  const q: any = { userId: req.userId };
  if (listId) q.listId = listId;

  const tasks = await Task.find(q).sort({ createdAt: -1 }).lean();
  res.json({ tasks: tasks.map(({ _id, __v, userId, ...rest }) => rest) });
});

router.post("/", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = CreateTaskSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const created = await Task.create({
    ...parsed.data,
    completed: parsed.data.completed ?? false,
    userId: req.userId
  });

  const { _id, __v, userId, ...task } = created.toObject();
  res.status(201).json({ task });
});

router.patch("/:id", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = UpdateTaskSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const updated = await Task.findOneAndUpdate(
    { userId: req.userId, id: req.params.id },
    { $set: parsed.data },
    { new: true }
  ).lean();

  if (!updated) return res.status(404).json({ error: "Task not found" });

  const { _id, __v, userId, ...task } = updated as any;
  res.json({ task });
});

router.delete("/:id", requireAuth, async (req: AuthedRequest, res) => {
  const deleted = await Task.deleteOne({ userId: req.userId, id: req.params.id });
  if (deleted.deletedCount === 0) return res.status(404).json({ error: "Task not found" });
  res.status(204).send();
});

export default router;
