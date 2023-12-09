import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your username'],
      min: 2,
      max: 100,
    },
    lastName: {
      type: String,
      min: 2,
      max: 100,
    },
    email: {
      type: String,
      required: [true, 'Please enter a valid email'],
      max: 50,
      unique: true,
    },
    authentication:{
      password: {
        type: String,
        required: [true, "Please enter an password"],
        minlength: [8, "Minimum password lenght is 8 characters"],
        select: false
      },
      salt: {type: String, select: false}
    },
    companies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company"
    }],
    companies_invites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company"
    }],
    city: String,
    state: String,
    country: String,
    occupation: String,
    phoneNumber: String,
    transactions: Array,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
export const getUserByEmail = (email) => User.findOne({email});
export const createUser = (data) => new User(data).save().then((user) => user.toObject());
export const getUserById = (id) => User.findById(id);

export const getAllJoinedCompaniesByUserId = (id) => User.findById(id).select('companies -_id').populate('companies').then((user) => user.toObject());

export const addCompanyToUser = async (companyId, userId) => {
  const user = await getUserById(userId);
  user.companies.push(companyId);
  return user.save().then((user) => user.toObject());
}
export default User;
