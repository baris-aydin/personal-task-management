import { Router } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { List } from "../models/List";
import { config } from "../config";
import { requireAuth, AuthedRequest } from "../middleware/auth";

const router = Router();

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters")
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

const DEFAULT_LISTS = [
  { id: "inbox", name: "Inbox", icon: "inbox" },
  { id: "personal", name: "Personal", icon: "user" },
  { id: "work", name: "Work", icon: "briefcase" },
  { id: "shopping", name: "Shopping", icon: "shopping-cart" }
];

router.post("/register", async (req, res) => {
  const parsed = RegisterSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { email, password } = parsed.data;

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ error: "Email already in use" });

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ email, passwordHash });

  // Seed default lists for this user (so your UI works immediately)
  await List.insertMany(DEFAULT_LISTS.map(l => ({ ...l, userId: user._id })));

  const token = jwt.sign({ userId: user._id.toString() }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  });

  res.status(201).json({ token });
});

router.post("/login", async (req, res) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { email, password } = parsed.data;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user._id.toString() }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  });

  res.json({ token });
});

router.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  res.json({ userId: req.userId });
});

export default router;
