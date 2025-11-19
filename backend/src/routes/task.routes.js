import { Router } from "express";
import { createTask, getTasks, getTaskById, updateTask, deleteTask, getTaskStats } from "../controller/task.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// All routes are protected
router.use(verifyJWT);

router.route("/").post(createTask).get(getTasks);
router.route("/stats").get(getTaskStats);
router.route("/:id").get(getTaskById).patch(updateTask).delete(deleteTask);

export default router;
