import mongoose from "mongoose";

const dbConnect = () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(console.log("DB Connection Successful"))
    .catch((error) => {
      console.log(" Issue in Connecting to MongoDB");
      console.error(error);
      process.exit(1);
    });
};

export default dbConnect;
