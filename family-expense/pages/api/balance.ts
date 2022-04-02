import moment from "moment";
import nc from "next-connect";
import dbConnect from "../../lib/mongodb";
import { Entry } from "../../models/Entry";

const handler = nc()
  .get((req, res) => {
    return getBalance(req, res);
  })

async function getBalance(req, res) {
  try {
    await dbConnect();

    const selectedMonth = req.query['month']
    const nextMonth = moment(selectedMonth).add(1, "months").format("YYYY-MM-DD")

    const totalIncExpense = await Entry.aggregate([
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
        $match:{
          createdAt:{
              $gte: new Date(selectedMonth),
              $lt: new Date(nextMonth)
          }
        }
      },
      {
          $group: {
            _id: "$categories.type",
            total: { $sum: "$amount" }
        }
      }
    ]);

    const totalIncome = totalIncExpense.find(item => item._id == 'income')?.total || 0
    const totalExpense = totalIncExpense.find(item => item._id == 'expense')?.total || 0

    return res.json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense
    });
  } catch (error) {
    console.log(error)
    return res.json({
      error: new Error(error).message,
    });
  }
}

export default handler;