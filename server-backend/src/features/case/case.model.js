import mongoose from "mongoose";
import caseSchema from "./case.schema.js";

const Case = mongoose.model('Case', caseSchema);
export default Case;
