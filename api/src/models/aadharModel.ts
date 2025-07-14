import { model, Schema } from "mongoose";

const aadharSchema = new Schema(
  {
    name: { type: String, required: true },
    dob: { type: String, required: true },
    fatherName: { type: String },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    aadhaarNumber: { type: String, required: true },
  },
  { timestamps: true }
);

export const AadharModel = model("Aadhar", aadharSchema);
