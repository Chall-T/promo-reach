import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema(
  {
    user: { //user id
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    ipAddress: String,
    userAgent: String,
    sessionId: String
  },
  { timestamps: true }
);

export const Session = mongoose.model("Session", SessionSchema);

export const getUserBySessionToken = (sessionId) => Session.findOne({sessionId}).populate('user').then((session) => session.user.toObject());

export const createSession = (data) => new Session(data).save().then((session) => session.toObject());

export const deleteSession = (id) => Session.findOneAndDelete({ sessionId: id});