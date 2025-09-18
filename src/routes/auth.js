import express from 'express';
import { userSignUp, userSignIn } from '../features/user/user.controller.js';

const authRouter = express.Router();

// public routes:
authRouter.post('/signup', (req, res, next) => {
    userSignUp(req, res, next);
});
authRouter.post('/signin', (req, res, next) => {
    userSignIn(req, res, next);
});

authRouter.get('/test', (req, res) => {
    res.send('Auth route is working fine');
});

export default authRouter;