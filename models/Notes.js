import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
        title : String,
        note : String
},
{timestamps : true}
)

export default noteSchema;