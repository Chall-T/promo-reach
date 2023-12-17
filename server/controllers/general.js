import User from "../models/User.js";
import { OverallStatModel, createNewOverallStatYear, createDayToStatById} from "../models/OverallStat.js";
import TransactionModel from "../models/Transaction.js";
import pkg from 'lodash';
const {get} = pkg;

export const getUser = async (req, res) => {
  try {
    const id = get(req, 'identity._id');
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};




export const getDashboardStats = async (req, res) => {
  try {
    const { company_id } = req.params;

    let currentDateObj = new Date();
    const currentMonth = currentDateObj.toLocaleString('en-US', { month: 'long' });
    const currentYear = currentDateObj.getUTCFullYear();
    const currentDay = `${currentDateObj.getUTCFullYear()}-${currentDateObj.getUTCMonth()+1}-${currentDateObj.getUTCDate()}`;

    // hardcoded values
    // const currentMonth = "November";
    // const currentYear = 2021;
    // const currentDay = "2021-11-15";

    // const id = '636ffd4fc7195768677097d7'

    /* Recent Transactions */
    const transactions = await TransactionModel.find({company: company_id})
      .limit(50)
      .sort({ createdOn: -1 });

    /* Overall Stats */
    var overallStat = await OverallStatModel.findOne({ year: currentYear, company: company_id});
    // var overallStat = await OverallStatModel.findOne({ year: currentYear, _id: id});
    if (!overallStat){
      overallStat = await createNewOverallStatYear(company_id)
    }
    const {
      company,
      totalCustomers,
      yearlyTotalSoldUnits,
      yearlySalesTotal,
      monthlyData,
      salesByCategory,
    } = overallStat;
    
    var thisMonthStats = overallStat.monthlyData.find(({ month }) => {
      return month === currentMonth;
    });

    var todayStats = overallStat.dailyData.find(({ date }) => {
      return date === currentDay;
    });
    if (!todayStats){
      const createDayData = await createDayToStatById(overallStat._id, currentDateObj)
      overallStat = createDayData[0]
      todayStats = createDayData[1]
      
    }



    res.status(200).json({
      company,
      totalCustomers,
      yearlyTotalSoldUnits,
      yearlySalesTotal,
      monthlyData,
      salesByCategory,
      thisMonthStats,
      todayStats,
      transactions,
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
