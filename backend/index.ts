import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routers/userRouter";
import restaurantRouter from "./routers/restaurantRouter";
import ReservationRouter from "./routers/reservationRouter";

import { Restaurant, Reservation, ReservationIF, RestaurantIF, DateIF, TimeIF } from "./models/restaurant";

mongoose.connect(
    "mongodb+srv://oioioioi1234:oioioioi2553@cluster0.zubro.mongodb.net/restaurant_reservations?retryWrites=true&w=majority",
);

let app = express();

app.use(cors());
app.use(express.json());

app.use("/users", userRouter);
app.use("/restaurants", restaurantRouter);
app.use("/reservations", ReservationRouter);

setInterval(async () => {
    console.log("Interval Clean Up Start");
    //Finish the cancellation of previous day reservations + updating the late reservations of today
    const restaurant: RestaurantIF | null = await Restaurant.findOne();
    if (restaurant === null) 
        return;

    const reservationIds: mongoose.ObjectId[] = restaurant.reservations;

    const today: Date = new Date(Date.now());
    const daysPast: number = 7;
    let pastDate: [number, number, number] = [today.getDate(), today.getMonth()+1, today.getFullYear()];
    for (let i = 0; i < daysPast; i++) {
        if (pastDate[0] > 1) {
            pastDate[0] -= 1;
        } else if (pastDate[1] > 1) {
            pastDate[1] -= 1;
            pastDate[0] = new Date(pastDate[2], pastDate[1]-1, 0).getDate();
        } else {
            pastDate[2] -= 1;
            pastDate[1] = 12;
            pastDate[0] = 31;
        }
    }
    
    for (let i = 0; i < reservationIds.length; i++) {
        const reservation: ReservationIF | null =  await Reservation.findById(reservationIds[i]);
        if (reservation == null) { 
            console.log("Data Synch Issue: Reservation ID in restaurant list not found!");
            continue;
        }

        const date: DateIF = reservation.date;
        if (date.year < pastDate[2] || 
            (date.year == pastDate[2] && date.month < pastDate[1]) ||
            (date.year == pastDate[2] && date.month == pastDate[1] && date.day < pastDate[0])) {
                
                console.log(reservation._id + ": Deleted");
                await Reservation.findByIdAndDelete(reservation._id);
                await Restaurant.updateOne({ name: restaurant.name }, { $pull: { reservations: reservation._id} });
        }

        if (date.year == today.getDate() && date.month == today.getMonth()+1 && date.year == today.getFullYear() && reservation.status == 0) {
            console.log(reservation._id + ": Late");
            const time: TimeIF = reservation.time;
            const now_time: number = today.getHours()*60 + today.getMinutes();
            const res_time: number = (((time.hour != 12) ? time.hour : 0) + (time.time == "PM" ? 12 : 0))*60 + time.minute;
            if (res_time < now_time) {
                Reservation.updateOne({ _id: reservation._id}, { status: 1 });
            }
        } 
    }

    console.log("Periodic Clean Up Done");

}, 3 * 60 * 1000);

app.listen(5000, () => {
    console.log("Server Started ^-^")
});