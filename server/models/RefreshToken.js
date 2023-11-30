import mongoose from "mongoose";

const RefreshTokenSchema = new mongoose.Schema(
  {
    token: String
  }
);
export const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema);

export const getRefreshToken = (token) => RefreshToken.findOne({"token": token});

export const createRefreshToken = (token) => new RefreshToken({token}).save().then((user) => user.toObject());

export const deleteRefreshTokenById = (id) => RefreshToken.findById(id).remove().exec();
export const deleteRefreshToken = (token) => RefreshToken.findOne({"token": token}).remove().exec();