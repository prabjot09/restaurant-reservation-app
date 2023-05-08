"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../models/user");
const userRouter = express_1.default.Router();
userRouter.route("/register").post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userObj = {
            username: req.body.username,
            password: req.body.password,
        };
        const user = new user_1.User(userObj);
        yield user.save()
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
}));
userRouter.route("/userlist/:username").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.params.username;
    const user = yield user_1.User.findOne({ "username": username });
    res.send(user);
}));
userRouter.route("/reservations/:username").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.params.username;
    res.send(req.params.username);
}));
exports.default = userRouter;
