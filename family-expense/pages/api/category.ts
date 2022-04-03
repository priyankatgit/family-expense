import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import {IUser} from "./auth/[...nextauth]"
import nc from "next-connect";
import dbConnect from "../../lib/mongodb";
import { Category, Entry } from "../../models/Entry";
import {getSession} from 'next-auth/react'

const handler = nc<NextApiRequest, NextApiResponse>()
  .get((req, res) => {
    getCategories(req, res);
  })
  .post((req, res) => {
    addCategory(req, res);
  })
  .delete(async (req, res) => {
    deleteCategory(req, res);
  });

async function getCategories(req:NextApiRequest, res:NextApiResponse) {
  try {
    const session = await getSession({ req });
    const sessionUser = session?.user as IUser

    await dbConnect();
    const categories = await Category.find({userId: new ObjectId(sessionUser.userId)}).sort({ _id: -1 });

    return res.json({
      data: categories,
    });
  } catch (e) {
    return res.json({
      error: (e as Error).message,
    });
  }
}

async function addCategory(req:NextApiRequest, res:NextApiResponse) {
  try {
    await dbConnect();
    const category = await Category.create(JSON.parse(req.body));

    return res.json({
      id: category._id,
      amt: category.amount
    });
  } catch (e) {
    return res.json({
      error: (e as Error).message,
    });
  }
}

async function deleteCategory(req:NextApiRequest, res:NextApiResponse) {
  try {
    const reqData = JSON.parse(req.body);
    const categoryId = new ObjectId(reqData["_id"])

    await dbConnect();
    const referencedCount = await Entry.count({categoryId: categoryId})
    if(referencedCount > 0) {
      return res.json({error: "Cannot be deleted. It is been used in Entries."})
    }

    await Category.findOneAndRemove({
      _id: categoryId,
    });

    return res.json({});
  } catch (e) {
    return res.json({
      error: (e as Error).message,
    });
  }
}

export default handler;