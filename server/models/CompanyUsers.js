import mongoose, { Schema } from "mongoose";

const CompanyUsersSchema = new mongoose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            require: true
        },
        company: {
            type: Schema.Types.ObjectId,
            ref: "Company",
            require: true
        },
        roles: [{
            Role:{
                type: Schema.Types.ObjectId,
                ref: "Role",
                require: false
            },
            updated_by:{
                type: Schema.Types.ObjectId,
                ref: "User",
                require: true
            }
        },
        { timestamps: true }],
        added_by: {
            type: Schema.Types.ObjectId,
            ref: "User",
            require: true
        },
    },
    { timestamps: true }
);
export const CompanyUsers = mongoose.model('CompanyUsers', CompanyUsersSchema);

export const getCompaniesByUserId = (user) => CompanyUsers.find({user: user});
export const getCompanyAllUsersByCompanyId = (company_id) => CompanyUsers.find({company_id: company_id}).populate("User").populate("roles");
export const createCompanyUser = (data) => new CompanyUsers(data).save().then((companyUser) => companyUser.toObject());

export const deleteCompanyUserById = (id) => CompanyUsers.findOneAndDelete({ _id: id});
export const updateCompanyUserById = (id, data) => CompanyUsers.findByIdAndUpdate(id, data);
