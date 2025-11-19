import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
    cors({
        origin: "*" || "http://localhost:3000",
        // credentials: true,
    })
);

app.use(
    express.json({
        limit: "16kb",
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "16kb",
    })
);

app.use(express.static("public"));

app.use(cookieParser());

// routes
import userRouter from "./routes/user.routes.js";
import taskRouter from "./routes/task.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/tasks", taskRouter);

export default app;
