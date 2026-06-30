// import mongoose from "mongoose";

// export const connectiondb = () => {
//     mongoose
//     .connect (process.env.MONGO_URL)
//     .then((data) => {
//         console.log("Mongodb is connected: ", data.connection.host)
//     })
// }


import mongoose from "mongoose";

export const connectiondb = async () => {
    try {
        const data = await mongoose.connect(process.env.MONGO_URL);

        console.log("MongoDB Connected:", data.connection.host);
    } catch (err) {
        console.error("MongoDB Error:");
        console.error(err);
    }
};