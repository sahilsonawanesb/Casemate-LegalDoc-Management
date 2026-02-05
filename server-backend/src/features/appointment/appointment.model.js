import mongoose from "mongoose";
import appointmentSchema from "../appointment/appointment.schema.js";


const appointmentModel = new mongoose.model('Appointment', appointmentSchema);

export default appointmentModel;