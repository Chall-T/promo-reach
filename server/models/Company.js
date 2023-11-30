import mongoose, { Schema } from "mongoose";

const CompanySchema = new mongoose.Schema(
    {
        name: {
            type: String, 
            require: [true, "Please enter a company name"], 
            minlength: [4, "Minimum company name lenght is 4 characters"]
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            require: true
        }
    },
    { timestamps: true }
);
export const Company = mongoose.model('Company', CompanySchema);

export const getCompanies = () => Company.find().populate('owner');
export const getCompaniesByOwner = (owner) => Company.findOne({owner});
export const getCompanyById = (id) => Company.findById(id);
export const getCompanyByName = (name) => Company.findOne({name});

export const getCompaniesByOwnerId = (id) => Company.find({owner: id});
export const getCompanyByIdWithUser = (id) => Company.findById({id}).populate('owner');

export const companyCreate = (data) => new Company(data).save().then((company) => company.toObject());
export const deleteCompanyById = (id) => Company.findOneAndDelete({ _id: id});
export const updateCompanyById = (id, data) => Company.findByIdAndUpdate(id, data);
