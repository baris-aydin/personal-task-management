import mongoose, { Schema } from "mongoose";

export interface ListDoc extends mongoose.Document {
  id: string;            // string id to match frontend TaskList.id
  userId: mongoose.Types.ObjectId;
  name: string;
  icon: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ListSchema = new Schema<ListDoc>(
  {
    id: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    name: { type: String, required: true, trim: true },
    icon: { type: String, required: true, trim: true },
    color: { type: String }
  },
  { timestamps: true }
);

ListSchema.index({ userId: 1, id: 1 }, { unique: true });

export const List = mongoose.model<ListDoc>("List", ListSchema);
