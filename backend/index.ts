import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routers/userRouter";
import restaurantRouter from "./routers/restaurantRouter";
import ReservationRouter from "./routers/reservationRouter";

mongoose.connect(
    "mongodb+srv://oioioioi1234:oioioioi2553@cluster0.zubro.mongodb.net/restaurant_reservations?retryWrites=true&w=majority",
);

let app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
app.use("/restaurants", restaurantRouter);
app.use("/reservations", ReservationRouter);

setInterval(() => {
    const todayDateObj = new Date(Date.now());
    const todayDateNum = todayDateObj.getFullYear()*10000 + (todayDateObj.getMonth()+1)*100 + todayDateObj.getDate();
    const todayTimeNum = todayDateObj.getHours()*10000 + todayDateObj.getMinutes()*100 + todayDateObj.getSeconds();

    // Finish the cancellation of previous day reservations + updating the late reservations of today
}, 60 * 1000);

app.listen(5000);