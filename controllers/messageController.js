import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { User } from "../models/userModel.js";
import { Chat } from "../models/chatModel.js";
import { Message } from "../models/messageModel.js";


export const sendMessage = catchAsyncError(async (req, res, next) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        return next(new ErrorHandler("Invalid request", 400));
    }

    let newMessage = {
        sender: req.user._id,
        content,
        chat: chatId,
    }

    let myMessage = await Message.create(newMessage);

    // console.log("sachin");
    myMessage = await Message.findById(myMessage._id)
        .populate("sender", "name pic")
        .populate("chat")

    // console.log("First", myMessage);

    myMessage = await User.populate(myMessage, {
        path: "chat.users",
        select: "name pic email",
    });
    // console.log("Second", myMessage);


    await Chat.findByIdAndUpdate(req.body.chatId, {
        latestMessage: myMessage,
    });

    // console.log(myMessage);


    res.status(200).json({
        success: true,
        myMessage,
    });
});

export const allMessages = catchAsyncError(async (req, res, next) => {
    const chatId = req.params.chatId;

    if (!chatId) {
        return next(new ErrorHandler("Invalid request", 400));
    }

    let myAllMessages = await Message.find({ chat: chatId })
        .populate("sender", "name pic email")
        .populate("chat");


    res.status(200).json({
        success: true,
        myAllMessages,
    });
});

export const seenAllMessagesFromChat = catchAsyncError(async (req, res, next) => {
    const { chatId } = req.body;

    let myAllMessages = await Message.find({ chat: chatId }).updateMany({ seen: true });

    res.status(200).json({
        success: true,
        myAllMessages
    });
});

export const fetchAllMessages = catchAsyncError(async (req, res, next) => {

    let sac = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
    // console.log("sac", sac);
    let myAllMessages = await Message.find({
        chat: { $in: sac }
    }).populate("sender", "name pic email").populate("chat");

    myAllMessages = await User.populate(myAllMessages, {
        path: "chat.users",
        select: "name pic email",
    });

    // console.log(myAllMessages)

    res.status(200).json({
        success: true,
        myAllMessages
    });
});




export const seenMessage = catchAsyncError(async (req, res, next) => {
    const { messageId } = req.body;
    console.log(messageId);

    await Message.updateMany({ _id: messageId }, {
        seen: true,
    })

    res.status(200).json({
        success: true,
        value: true,
    });
});
