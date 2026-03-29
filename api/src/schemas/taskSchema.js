const { z } = require("zod");

const createTaskSchema = z.object({
  title: z.string().min(1, "title is required").max(255, "title is too long"),
  status: z.enum(["todo", "in_progress", "done"]).optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1, "title is required").max(255, "title is too long").optional(),
  status: z.enum(["todo", "in_progress", "done"]).optional(),
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
};