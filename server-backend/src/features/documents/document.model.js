import mongoose from "mongoose";
import documentSchema from "./document.schema.js";

export const documentModel = mongoose.model('Document', documentSchema);

