import express from "express";
import { getUserProfile, updateUserProfile } from "../features/user/user.controller.js";

// create router object.
const userRouter = express.Router();

// Protected Routes.
userRouter.get('/profile', (req, res, next) => {
    getUserProfile(req, res, next);
});

userRouter.post('/update-profile', (req, res, next) => {
    updateUserProfile(req, res, next);
})


export default userRouter;