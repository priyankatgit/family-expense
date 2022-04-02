import moment from "moment";
import { ObjectId } from "mongodb";
import nc from "next-connect";
import dbConnect from "../../lib/mongodb";
import { Entry } from "../../models/Entry";

const handler = nc()
  .get((req, res) => {
    return getEntries(req, res);
  })
  .post((req, res) => {
    return addEntry(req, res);
  })
  .delete(async (req, res) => {
    return deleteEntry(req, res);
  });

async function getEntries(req, res) {
  try {
    await dbConnect();
    // TODO: Check what happens if in case of ORM like Prisma or Mongoose. Are those library handles connection closing in better way?
    // Make sure you close all cursors. Mongo server iss woeful to close connection automatically. Make sure to 1st store the response, then manually close the cursor on each end point.
    // https://github.com/vercel/next.js/discussions/12229#discussioncomment-363517

    const selectedMonth = req.query['month']
    const nextMonth = moment(selectedMonth).add(1, "months").format("YYYY-MM-DD")

    const entries = await Entry.aggregate([
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categories",
        },
      },
      { $unwind: "$categories" },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $match:{
          createdAt:{
              $gte: new Date(selectedMonth),
              $lt: new Date(nextMonth)
          }
        }
      },
      {
        $project: {
          _id: 1,
          entryDetail: 1,
          amount: 1,
          createdAt: 1,
          entryCategory: "$categories.name",
          entryCategoryType: "$categories.type",
          userDisplayName: "$user.name",
          userImage: "$user.image",
        },
      },
    ]);

    return res.json({
      data: entries,
    });
  } catch (error) {
    console.log(error)
    return res.json({
      error: new Error(error).message,
    });
  }
}

async function addEntry(req, res) {
  try {
    await dbConnect();
    const entry = await Entry.create(JSON.parse(req.body));

    return res.json({
      id: entry._id,
    });
  } catch (error) {
    return res.json({
      error: new Error(error).message,
    });
  }
}

async function deleteEntry(req, res) {
  try {
    await dbConnect();

    const reqData = JSON.parse(req.body);
    await Entry.findOneAndRemove({
      _id: new ObjectId(reqData["_id"]),
    });

    return res.json({});
  } catch (error) {
    return res.json({
      error: new Error(error).message,
    });
  }
}

export default handler;
