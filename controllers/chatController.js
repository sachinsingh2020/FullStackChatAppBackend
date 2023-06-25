import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { Chat } from "../models/chatModel.js";
import { User } from "../models/userModel.js";


export const accessChat = catchAsyncError(async (req, res, next) => {
    const { userId } = req.body;

    if (!userId) {
        return next(new ErrorHandler("UserId param not sent with request", 400));
    }
    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ]
    }).populate("users", "-password").populate("latestMessage");



    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });

    if (isChat.length > 0) {
        res.send(isChat[0]);
    }
    else {

        let chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        try {
            const createdChat = await Chat.create(chatData);

            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");


            // res.status(200).send(FullChat);
            res.status(201).json({
                success: true,
                FullChat,
            });
        }
        catch (error) {
            // console.log(error);
            return next(new ErrorHandler(`Error: ${error}`, 500));
        }
    }
});

export const fetchChats = catchAsyncError(async (req, res, next) => {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate("users", "-password")
        .populate("latestMessage")
        .populate("groupAdmin", "-password")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
            results = await User.populate(results, {
                path: "latestMessage.sender",
                select: "name pic email",
            });

            res.status(201).json({
                success: true,
                results,
            });
        })
});


export const createGroupChat = catchAsyncError(async (req, res, next) => {
    if (!req.body.users || !req.body.name) {
        return next(new ErrorHandler("Please Fill All the Fields", 400));
    }

    let users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return next(new ErrorHandler("Please Add More Users", 400));
    }

    users.push(req.user);
    // console.log(req.user);

    const groupChat = await Chat.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user._id,
    })

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    res.status(201).json({
        success: true,
        fullGroupChat,
        message: "Group Created Successfully",
    });
});

export const renameGroup = catchAsyncError(async (req, res, next) => {
    const { chatId, newName } = req.body;

    if (!chatId || !newName) {
        return next(new ErrorHandler("Please Fill All the Fields", 400));
    }

    const updatedChat = await Chat.findOneAndUpdate({ _id: chatId }, { chatName: newName }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password");

    if (!updatedChat) {
        return next(new ErrorHandler("Chat Not Found", 404));
    }
    else {
        res.status(201).json({
            success: true,
            updatedChat,
            message: "Group Renamed Successfully",
        });
    }
});

export const addToGroup = catchAsyncError(async (req, res, next) => {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
        return next(new ErrorHandler("Please Fill All the Fields", 400));
    }

    const addToGroup = await Chat.findOneAndUpdate({ _id: chatId }, { $push: { users: userId } }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password");

    if (!addToGroup) {
        return next(new ErrorHandler("Chat Not Found", 404));
    }
    else {
        res.status(201).json({
            success: true,
            addToGroup,
            message: "User Added Successfully",
        });
    }
});

export const removeFromGroup = catchAsyncError(async (req, res, next) => {
    const { chatId, userId } = req.body;

    if (!chatId || !userId) {
        return next(new ErrorHandler("Please Fill All the Fields", 400));
    }

    const removeFromGroup = await Chat.findOneAndUpdate({ _id: chatId }, { $pull: { users: userId } }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password");

    if (!removeFromGroup) {
        return next(new ErrorHandler("Chat Not Found", 404));
    }
    else {
        res.status(201).json({
            success: true,
            removeFromGroup,
            message: "User Removed Successfully",
        });
    }
});