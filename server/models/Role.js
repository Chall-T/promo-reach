import mongoose from "mongoose";

const RoleSchema = new mongoose.Schema(
  {
    name: String
  }
);
export const Role = mongoose.model("Role", RoleSchema);
export const getRoles = () => Role.find();
export const getRoleByName = (name) => Role.findOne({"name": name});