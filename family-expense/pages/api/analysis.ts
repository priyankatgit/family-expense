import moment from "moment";
import nc from "next-connect";
import dbConnect from "../../lib/mongodb";
import { Entry } from "../../models/Entry";
import {getSession} from 'next-auth/react'
import { ObjectId } from "mongodb"; 
import { IUser } from "./auth/[...nextauth]";

const handler = nc().get((req, res) => {
  return getExpensesByCategory(req, res);
});

async function getExpensesByCategory(req, res) {
  try {
    const session = await getSession({ req });
    const sessionUser = session?.user as IUser

    await dbConnect();

    const selectedMonth = req.query["month"];
    const nextMonth = moment(selectedMonth)
      .add(1, "months")
      .format("YYYY-MM-DD");

    const expensesByCat = await Entry.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categories",
          pipeline: [
            {
              $match: {
                type: {
                  $eq: "expense",
                },
              },
            },
          ],
        },
      },
      { $unwind: "$categories" },
      {
        $match: {
          userId: {
            $eq: new ObjectId(sessionUser.userId),
          },
          createdAt: {
            $gte: new Date(selectedMonth),
            $lt: new Date(nextMonth),
          },
        },
      },
      {
        $group: {
          _id: "$categories.name",
          value: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          value: 1,
          type: "$_id",
        },
      },
    ]);

    return res.json(expensesByCat);
  } catch (error) {
    console.log(error);
    return res.json({
      error: new Error(error).message,
    });
  }
}

export default handler;
