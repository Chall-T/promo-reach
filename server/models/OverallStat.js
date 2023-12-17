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

export const getOverallStatById = (id) => OverallStatModel.findById(id);

export const createNewOverallStatYear = async (companyId)=>{
  let currentDateObj = new Date();

  const currentMonth = currentDateObj.toLocaleString('default', { month: 'long' });
  const currentYear = currentDateObj.getUTCFullYear();
  const currentDay = `${currentDateObj.getUTCFullYear()}-${currentDateObj.getUTCMonth()+1}-${currentDateObj.getUTCDate()}`;

  const overallStatData = {
    company: companyId,
    totalCustomers: 0,
    yearlySalesTotal: 0,
    yearlyTotalSoldUnits: 0,
    year: currentYear,
    monthlyData: [],
    dailyData: [],
    salesByCategory: {}
  }
  for (let month = 0; month < 12; month++) {
    const date = new Date(currentYear, month);

    overallStatData.monthlyData.push(getMonthObject(date))
  }

  var overallStat = await createOverallStat(overallStatData)
  
  return overallStat

}

export const getMonthObject = (date)=>{
  const monthData = {
    month: date.toLocaleString('en-US', { month: 'long' }),
    totalSales: 0,
    totalUnits: 0
  }
  return monthData
}

export const createDayToStatById = async (id, date)=>{
  const overallStat = await getOverallStatById(id);
  const dayData = {
    date: `${date.getUTCFullYear()}-${date.getUTCMonth()+1}-${date.getUTCDate()}`,
    totalSales: 0,
    totalUnits: 0
  }
  overallStat.dailyData.push(dayData)
  overallStat.save()
  return [overallStat, dayData]
}