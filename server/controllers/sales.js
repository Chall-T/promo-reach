import {OverallStatModel, createNewOverallStatYear} from "../models/OverallStat.js";

export const getSales = async (req, res) => {
  try {
    const { company_id } = req.params;
    var overallStats = await OverallStatModel.find({company: company_id});
    if (overallStats.length == 0){
      const stat = await createNewOverallStatYear(company_id)
      overallStats = [stat]
    }
    res.status(200).json(overallStats[0]);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
