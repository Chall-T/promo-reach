import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema(
  {
    company: String,
    userId: String,
    cost: String,
    products: {
      type: [mongoose.Types.ObjectId],
      of: Number,
    },
  },
  { timestamps: true }
);

const TransactionModel = mongoose.model("Transaction", TransactionSchema);

export const createTransaction = (data) => new TransactionModel(data).save().then((transaction) => transaction.toObject());

export default TransactionModel;
