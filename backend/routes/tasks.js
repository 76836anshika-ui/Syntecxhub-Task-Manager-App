const router = require("express").Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");
router.use(auth);

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch { res.status(500).json({ message: "Could not load tasks." }); }
});

router.post("/", async (req, res) => {
  try {
    const title = String(req.body.title || "").trim();
    if (!title) return res.status(400).json({ message: "A task title is required." });
    const task = await Task.create({
      title,
      description: String(req.body.description || "").trim(),
      dueDate: req.body.dueDate || null,
      priority: ["Low", "Medium", "High"].includes(req.body.priority) ? req.body.priority : "Medium",
      status: ["Pending", "In Progress", "Completed"].includes(req.body.status) ? req.body.status : "Pending",
      user: req.userId
    });
    res.status(201).json(task);
  } catch { res.status(500).json({ message: "Could not create task." }); }
});

router.patch("/:id", async (req, res) => {
  try {
    const allowed = {};
    for (const key of ["title", "description", "dueDate", "priority", "status"]) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) allowed[key] = req.body[key];
    }
    if (allowed.title !== undefined && !String(allowed.title).trim()) {
      return res.status(400).json({ message: "A task title cannot be empty." });
    }
    const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.userId }, allowed, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ message: "Task not found." });
    res.json(task);
  } catch { res.status(400).json({ message: "Could not update task." }); }
});

router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ message: "Task not found." });
    res.json({ message: "Task deleted." });
  } catch { res.status(400).json({ message: "Could not delete task." }); }
});
module.exports = router;
