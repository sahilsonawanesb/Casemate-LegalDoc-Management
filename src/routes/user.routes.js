import express from "express";
import { changePassword, getUserProfile, updateUserProfile, userLogout } from "../features/user/user.controller.js";

// create router object.
const userRouter = express.Router();

// Protected Routes.
userRouter.get('/profile', (req, res, next) => {
    getUserProfile(req, res, next);
});

userRouter.post('/update-profile', (req, res, next) => {
    updateUserProfile(req, res, next);
});

userRouter.post('/change-password', (req, res, next) => {
    changePassword(req, res, next);
});

userRouter.post('/logout', (req, res, next) => {
    userLogout(req, res, next);
});


export default userRouter;