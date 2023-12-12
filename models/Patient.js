import mongoose from "mongoose";

const patientsSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    symptoms: {
      type: String,
      required: true,
    },
    veterinarian: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Veterinario",
    },
  },
  {
    timestamps: true,
  }
);

const Patient = mongoose.model("Patient", patientsSchema);

export default Patient;
