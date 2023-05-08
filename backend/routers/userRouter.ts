import express from "express";
import { User, UserIF } from "../models/user";

const userRouter = express.Router();

userRouter.route("/register").post(async (req, res) => {
    try {
        const userObj = {
            username: req.body.username,
            password: req.body.password,
        };
        const user = new User(userObj);

        await user.save()
        .catch((error) => {
            console.log("Unable to save this user on the server due to the following error:\n" + error);
            return;
        });
        res.send(`Account with username ${user.username} and password ${user.password} was successfully created. `);
    }
    catch (e) {
        console.log(e);
        res.status(404).send("Request body requires a JSON object with key 'username' and 'password' both with value 'String'");
    }

    
});

userRouter.route("/userlist/:username").get(async (req, res) => {
    const username = req.params.username;
    const user: UserIF | null = await User.findOne({ "username" : username });
    res.send(user);
});

userRouter.route("/reservations/:username").get(async (req, res) => {
    const username = req.params.username;
    res.send(req.params.username);
});

export default userRouter;