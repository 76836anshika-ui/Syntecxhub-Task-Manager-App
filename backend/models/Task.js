const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 140 },
  description: { type: String, trim: true, maxlength: 2000, default: "" },
  dueDate: { type: Date, default: null },
  priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
  status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });
module.exports = mongoose.model("Task", taskSchema);
