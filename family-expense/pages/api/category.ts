import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";
import dbConnect from "../../lib/mongodb";
import { Category } from "../../models/Entry";

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
    await dbConnect();
    const categories = await Category.find().sort({ _id: -1 });

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
    await dbConnect();

    const reqData = JSON.parse(req.body);
    await Category.findOneAndRemove({
      _id: new ObjectId(reqData["_id"]),
    });

    return res.json({});
  } catch (e) {
    return res.json({
      error: (e as Error).message,
    });
  }
}

export default handler;