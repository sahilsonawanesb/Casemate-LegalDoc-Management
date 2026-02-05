import mongoose from "mongoose";
import teamMemberSchema from "./team.schema.js";

const teamModel = new mongoose.model('Team', teamMemberSchema);
export default teamModel;