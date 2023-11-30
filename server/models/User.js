import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your username'],
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
        type: String
    }],
    companies_invites: [{
        type: String
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
export default User;
