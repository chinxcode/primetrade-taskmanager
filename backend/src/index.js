import dotenv from "dotenv";
import dbConnect from "./db/dbConnection.js";
import app from "./app.js";

dotenv.config({
    path: './env'
})

dbConnect()
    .then(
        app.listen(process.env.PORT, () => {
            console.log('Server is running at port', process.env.PORT);
        })
    )
    .catch((error) => {
        console.log("Error in connecting with database", error);
    })