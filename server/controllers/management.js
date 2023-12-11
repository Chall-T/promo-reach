import mongoose from "mongoose";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import pkg from 'lodash';
const {get} = pkg;

export const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");
    res.status(200).json(admins);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getUserPerformance = async (req, res) => {
  try {
    const userId = get(req, 'identity._id');
    const userWithStats = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "affiliatestats",
          localField: "_id",
          foreignField: "userId",
          as: "affiliateStats",
        },
      },
      { $unwind: "$affiliateStats" },
    ]);
    const saleTransactions = await Promise.all(
      userWithStats[0].affiliateStats.affiliateSales.map((userId) => {
        return Transaction.findById(userId);
      })
    );
    const filteredSaleTransactions = saleTransactions.filter(
      (transaction) => transaction !== null
    );
    const user = JSON.parse(JSON.stringify(userWithStats[0]));
    delete user.authentication
    res
      .status(200)
      .json({ user: user, sales: filteredSaleTransactions });
  } catch (error) {
    console.log(error)
    res.status(404).json({ message: error.message });
  }
};
