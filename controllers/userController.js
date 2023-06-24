import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { User } from "../models/userModel.js";
import { sendToken } from "../utils/sendToken.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "cloudinary";
import ApiFeatures from "../utils/apiFeatures.js";


export const registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return next(new ErrorHandler("Please enter all fields", 400));
    }

    let user = await User.findOne({ email });

    if (user) {
        return next(new ErrorHandler("User already exists", 409));
    }

    const file = req.file;
    if (file) {
        const fileUri = getDataUri(file);

        const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

        user = await User.create({
            name,
            email,
            password,
            pic: {
                public_id: mycloud.public_id,
                url: mycloud.secure_url,
            }
        })
        sendToken(res, user, "Registered Successfully", 201);
    }
    else {
        user = await User.create({
            name,
            email,
            password,
            pic: {
                public_id: "default",
                url: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
            },
        })

        sendToken(res, user, "Registered Successfully", 201);
    }
});

export const loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    // console.log(email, password);



    

    if (!email || !password) {
        return next(new ErrorHandler("Please enter all fields", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) return next(new ErrorHandler("Incorrect Email or Password", 401));

    const isMatch = await user.comparePassword(password);

    if (!isMatch)
        return next(new ErrorHandler("Incorrect Email or Password", 401));

    sendToken(res, user, `Welcome back, ${user.name}`, 200);
});

export const getUsers = catchAsyncError(async (req, res, next) => {
    const apiFeatures = new ApiFeatures(User.find(), req.query).search();

    const users = await apiFeatures.query;

    res.status(200).json({
        success: true,
        users,
        // message: "Users fetched successfully",
    });
});

export const logout = catchAsyncError(async (req, res, next) => {
    res
        .status(200)
        .cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })
        .json({
            success: true,
            message: "Logged Out Successfully",
        });
});

export const getMe = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    res.status(200).json({
        success: true,
        user,
    });
});