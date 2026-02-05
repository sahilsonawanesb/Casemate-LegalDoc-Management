import mongoose from "mongoose";

import clientSchema from "./client.schema.js";

export const clientModel = mongoose.model('Client', clientSchema);