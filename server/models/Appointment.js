import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer"
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company"
    },
    date: String,
    note: {
      header: {
        type: String,
        default: ""
      },
      body: String,
      default: ""
    },
  },
  { timestamps: true }
);

const AppointmentModel = mongoose.model("Appointment", AppointmentSchema);

export const createAppointment = (data) => new AppointmentModel(data).save().then((appointment) => appointment.toObject());

export default AppointmentModel;
