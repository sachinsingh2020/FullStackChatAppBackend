import mongoose from "mongoose";

const schema = mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    content: {
        type: String,
        trim: true,
    },
    chat:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
    }
},
{
    timeStamps: true,
}
)

export const Message = mongoose.model("Message", schema);