import mongoose, { Schema }  from "mongoose";

const OverallStatSchema = new mongoose.Schema(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      require: true
    },
    totalCustomers: Number,
    yearlySalesTotal: Number,
    yearlyTotalSoldUnits: Number,
    year: Number,
    monthlyData: [
      {
        month: String,
        totalSales: Number,
        totalUnits: Number,
      },
    ],
    dailyData: [
      {
        date: String,
        totalSales: Number,
        totalUnits: Number,
      },
    ],
    salesByCategory: {
      type: Map,
      of: Number,
    },
  },
  { timestamps: true }
);

export const OverallStatModel = mongoose.model("OverallStat", OverallStatSchema);

export const createOverallStat = (data) => new OverallStatModel(data).save().then((stat) => stat.toObject());

