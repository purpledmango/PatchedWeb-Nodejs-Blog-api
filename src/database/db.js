import mongoose from "mongoose";

const connectionParams = { connectTimeoutMS: 10 }

const connectToDb = () => {
    mongoose.connect(process.env.DB_URI)
        .then(() => {
            console.log(`DB connected 🔋🫂`);
        })
        .catch((err) => {
            console.log(`Error During Connection: ${err}`);
        });
};

export default connectToDb;
