//https://hackernoon.com/how-to-link-mongoose-and-typescript-for-a-single-source-of-truth-94o3uqc

import mongoose, { Document, Model, Schema, Types } from "mongoose";

type ID = Types.ObjectId

interface ICategory{
  name: string,
  type: string,
  monthlyReoccurs: boolean,
  amount?: number,
  createdAt: Date
}

interface ICategoryDoc extends ICategory, Document {}

const ObjectId = Schema.Types.ObjectId;
const categorySchemaFields:Record<keyof ICategory, any> = {
  name: {
    type: String,
    required: [true, "You forget to provide category name!"],
  },
  type: {
    type: String,
    required: [true, "You forget to set category type!"],
  },
  monthlyReoccurs: {
    type: Boolean,
    default: false
  },
  amount: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  }
}

const categorySchema = new Schema(categorySchemaFields);

const entrySchema = new Schema({
  entryDetail: {
    type: String
  },
  categoryId: {
    type: ObjectId,
    required: [true, "You forget to provide category!"],
  },
  amount: {
    type: Number
  },
  userId: {
    type: ObjectId,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const userSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  image: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Category = mongoose.models?.Category || mongoose.model<ICategoryDoc>("Category", categorySchema);
const Entry = mongoose.models?.Entry || mongoose.model("Entry", entrySchema);
const User = mongoose.models?.User || mongoose.model("User", userSchema);

export { Category, Entry, User };
export type { ICategoryDoc, ID };
