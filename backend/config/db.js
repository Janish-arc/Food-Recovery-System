import mongoose from "mongoose";

export const connectiondb = () => {
    mongoose
    .connect (process.env.MONGO_URL)
    .then((data) => {
        console.log("Mongodb is connected: ", data.connection.host)
    })
}


