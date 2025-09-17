import mongoose from "mongoose";

const connectDb = async () => {
    try{
        const connect = await mongoose.connect('mongodb://localhost:27017/noter')
        console.log(`MongoDB connected : ${connect.connection.host}`);
    }
    catch(err){
        console.error(`Error connecting to MongoDB : ${err.message}`);
        process.exit(1);
    }
}

export default connectDb;