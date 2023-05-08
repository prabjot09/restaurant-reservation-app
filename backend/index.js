"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRouter_1 = __importDefault(require("./routers/userRouter"));
const restaurantRouter_1 = __importDefault(require("./routers/restaurantRouter"));
const reservationRouter_1 = __importDefault(require("./routers/reservationRouter"));
mongoose_1.default.connect("mongodb+srv://oioioioi1234:oioioioi2553@cluster0.zubro.mongodb.net/restaurant_reservations?retryWrites=true&w=majority");
let app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/users", userRouter_1.default);
app.use("/restaurants", restaurantRouter_1.default);
app.use("/reservations", reservationRouter_1.default);
setInterval(() => {
    const todayDateObj = new Date(Date.now());
    const todayDateNum = todayDateObj.getFullYear() * 10000 + (todayDateObj.getMonth() + 1) * 100 + todayDateObj.getDate();
    const todayTimeNum = todayDateObj.getHours() * 10000 + todayDateObj.getMinutes() * 100 + todayDateObj.getSeconds();
    // Finish the cancellation of previous day reservations + updating the late reservations of today
}, 60 * 1000);
app.listen(5000);
