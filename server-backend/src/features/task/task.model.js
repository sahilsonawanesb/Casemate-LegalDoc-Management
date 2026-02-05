import mongoose from "mongoose";

import taskSchema from "./task.schema.js";

const Task = mongoose.model('Task', taskSchema);

export default Task;