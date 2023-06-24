import mongoose from "mongoose";
import colors from "colors";

// MONGO_URI=mongodb://127.0.0.1/ChatApp

// MONGO_URI= mongodb+srv://sachin891singh:yNLUjcF95CIvnduJ@chat-app.wkmhymu.mongodb.net/?retryWrites=true&w=majority 

export const connectDB = async () => {
    try {
        const { connection } = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected with ${connection.host}`.blue.bold);
    }
    catch (error) {
        console.log(`Error: ${error.message}`.red.bold)
        process.exit();
    }

};
