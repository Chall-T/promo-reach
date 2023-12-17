import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
    
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company"
    },
    city: String,
    state: String,
    country: String,
    note: String,
    phoneNumber: String,
    transactions: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Transaction"
        }
      ],
    appointments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment"
        }
    ]
  },
  { timestamps: true }
);

export const Customer = mongoose.model("Customer", CustomerSchema);

export const getCustomerByEmail = (email) => Customer.findOne({email});
export const getCustomerByPhoneNumber = (phoneNumber) => Customer.findOne({phoneNumber});

export const getCustomersByName = (name) => Customer.find({name});
export const getCustomersByLastName = (lastName) => Customer.find({lastName});
export const getCustomersByCompanyId = (company) => Customer.find({company})

export const createCustomer = (data) => new Customer(data).save().then((customer) => customer.toObject());
export const getCustomerById = (id) => Customer.findById(id);