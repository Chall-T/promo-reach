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
        totalCustomers: Number
      },
    ],
    dailyData: [
      {
        date: String,
        totalSales: Number,
        totalUnits: Number,
        totalCustomers: Number
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

  const currentMonth = currentDateObj.toLocaleString('en-US', { month: 'long' });
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
    totalUnits: 0,
    totalCustomers: 0
  }
  return monthData
}

export const createDayToStatById = async (id, date)=>{
  const overallStat = await getOverallStatById(id);
  const dayData = {
    date: `${date.getUTCFullYear()}-${date.getUTCMonth()+1}-${date.getUTCDate()}`,
    totalSales: 0,
    totalUnits: 0,
    totalCustomers: 0
  }
  overallStat.dailyData.push(dayData)
  overallStat.save()
  return [overallStat, dayData]
}

export const getOverallStatSinceLastMonth = async (id, currentDateObj)=>{
  var currentMonth = currentDateObj.toLocaleString('en-US', { month: 'long' });
  const currentMonthIndex = currentDateObj.getUTCMonth();
  const currentDay = `${currentDateObj.getUTCFullYear()}-${currentDateObj.getUTCMonth()+1}-${currentDateObj.getUTCDate()}`;
  
  var currentYear
  if (currentMonthIndex == 0){
    currentYear = currentDateObj.getUTCFullYear()-1;
    currentDateObj = new Date(currentYear, 11, currentDateObj.getUTCDate());
    currentMonth = currentDateObj.toLocaleString('en-US', { month: 'long' });
  }else{
    currentYear = currentDateObj.getUTCFullYear();
  }
  const lastMonthData = {
    totalCustomers: 0,
    daylySales: 0,
    monthlySales: 0,
    traffic: 0 // needs to be implemented
  }
  const overallStat = await OverallStatModel.findOne({ year: currentYear, company: id});
  if (!overallStat){
    return lastMonthData;
  }
  var thisMonthStats = overallStat.monthlyData.find(({ month }) => {
    return month === currentMonth;
  });
  if (thisMonthStats.totalSales)
    lastMonthData.monthlySales = thisMonthStats.totalSales
  else{
    lastMonthData.monthlySales = 0
  }

  if (thisMonthStats.totalCustomers)
    lastMonthData.totalCustomers = thisMonthStats.totalCustomers
  else{
    lastMonthData.totalCustomers = 0
  }

  var todayStats = overallStat.dailyData.find(({ date }) => {
    return date === currentDay;
  });

  if (!todayStats){
    const createDayData = await createDayToStatById(overallStat._id, currentDateObj)
    overallStat = createDayData[0]
    todayStats = createDayData[1]
    
  }
  if (todayStats.totalSales)
    lastMonthData.daylySales = todayStats.totalSales
  else{
    lastMonthData.daylySales = 0
  }
  return lastMonthData
}