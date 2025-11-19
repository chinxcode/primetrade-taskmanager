import { Task } from "../models/task.model.js";
import { ApiError } from "../utils/APIError.js";
import { ApiResponse } from "../utils/APIresponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create a new task
const createTask = asyncHandler(async (req, res) => {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }

    const task = await Task.create({
        title,
        description,
        status: status || "pending",
        priority: priority || "medium",
        dueDate: dueDate || null,
        owner: req.user._id,
    });

    if (!task) {
        throw new ApiError(500, "Something went wrong while creating the task");
    }

    return res.status(201).json(new ApiResponse(201, "Task created successfully", task));
});

// Get all tasks for the logged-in user
const getTasks = asyncHandler(async (req, res) => {
    const { status, priority, search, sortBy = "createdAt", order = "desc" } = req.query;

    const filter = { owner: req.user._id };

    if (status) {
        filter.status = status;
    }

    if (priority) {
        filter.priority = priority;
    }

    if (search) {
        filter.$or = [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }];
    }

    const sortOrder = order === "asc" ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    const tasks = await Task.find(filter).sort(sortOptions);

    return res.status(200).json(new ApiResponse(200, "Tasks fetched successfully", tasks));
});

// Get a single task by ID
const getTaskById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const task = await Task.findOne({ _id: id, owner: req.user._id });

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    return res.status(200).json(new ApiResponse(200, "Task fetched successfully", task));
});

// Update a task
const updateTask = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;

    const task = await Task.findOne({ _id: id, owner: req.user._id });

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();

    return res.status(200).json(new ApiResponse(200, "Task updated successfully", task));
});

// Delete a task
const deleteTask = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({ _id: id, owner: req.user._id });

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    return res.status(200).json(new ApiResponse(200, "Task deleted successfully", null));
});

// Get task statistics
const getTaskStats = asyncHandler(async (req, res) => {
    const stats = await Task.aggregate([
        { $match: { owner: req.user._id } },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);

    const formattedStats = {
        total: 0,
        pending: 0,
        "in-progress": 0,
        completed: 0,
    };

    stats.forEach((stat) => {
        formattedStats[stat._id] = stat.count;
        formattedStats.total += stat.count;
    });

    return res.status(200).json(new ApiResponse(200, "Task statistics fetched successfully", formattedStats));
});

export { createTask, getTasks, getTaskById, updateTask, deleteTask, getTaskStats };
