import mongoose, { Schema } from "mongoose";

export interface TaskDoc extends mongoose.Document {
  id: string;            // string id to match frontend Task.id
  userId: mongoose.Types.ObjectId;
  title: string;
  notes?: string;
  completed: boolean;
  dueDate?: string;
  listId: string;
  createdAt: string;     // ISO string to match your frontend type
  updatedAt: Date;
}

const TaskSchema = new Schema<TaskDoc>(
  {
    id: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    title: { type: String, required: true, trim: true },
    notes: { type: String },
    completed: { type: Boolean, default: false },
    dueDate: { type: String },
    listId: { type: String, required: true },
    createdAt: { type: String, required: true }
  },
  { timestamps: true }
);

TaskSchema.index({ userId: 1, id: 1 }, { unique: true });

export const Task = mongoose.model<TaskDoc>("Task", TaskSchema);
