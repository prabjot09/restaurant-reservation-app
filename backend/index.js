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
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRouter_1 = __importDefault(require("./routers/userRouter"));
const restaurantRouter_1 = __importDefault(require("./routers/restaurantRouter"));
const reservationRouter_1 = __importDefault(require("./routers/reservationRouter"));
const restaurant_1 = require("./models/restaurant");
mongoose_1.default.connect("mongodb+srv://oioioioi1234:oioioioi2553@cluster0.zubro.mongodb.net/restaurant_reservations?retryWrites=true&w=majority");
let app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/users", userRouter_1.default);
app.use("/restaurants", restaurantRouter_1.default);
app.use("/reservations", reservationRouter_1.default);
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Interval Clean Up Start");
    //Finish the cancellation of previous day reservations + updating the late reservations of today
    const restaurant = yield restaurant_1.Restaurant.findOne();
    if (restaurant === null)
        return;
    const reservationIds = restaurant.reservations;
    const today = new Date(Date.now());
    const daysPast = 7;
    let pastDate = [today.getDate(), today.getMonth() + 1, today.getFullYear()];
    for (let i = 0; i < daysPast; i++) {
        if (pastDate[0] > 1) {
            pastDate[0] -= 1;
        }
        else if (pastDate[1] > 1) {
            pastDate[1] -= 1;
            pastDate[0] = new Date(pastDate[2], pastDate[1] - 1, 0).getDate();
        }
        else {
            pastDate[2] -= 1;
            pastDate[1] = 12;
            pastDate[0] = 31;
        }
    }
    for (let i = 0; i < reservationIds.length; i++) {
        const reservation = yield restaurant_1.Reservation.findById(reservationIds[i]);
        if (reservation == null) {
            console.log("Data Synch Issue: Reservation ID in restaurant list not found!");
            continue;
        }
        const date = reservation.date;
        if (date.year < pastDate[2] ||
            (date.year == pastDate[2] && date.month < pastDate[1]) ||
            (date.year == pastDate[2] && date.month == pastDate[1] && date.day < pastDate[0])) {
            console.log(reservation._id + ": Deleted");
            yield restaurant_1.Reservation.findByIdAndDelete(reservation._id);
            yield restaurant_1.Restaurant.updateOne({ name: restaurant.name }, { $pull: { reservations: reservation._id } });
        }
        if (date.year == today.getDate() && date.month == today.getMonth() + 1 && date.year == today.getFullYear() && reservation.status == 0) {
            console.log(reservation._id + ": Late");
            const time = reservation.time;
            const now_time = today.getHours() * 60 + today.getMinutes();
            const res_time = (((time.hour != 12) ? time.hour : 0) + (time.time == "PM" ? 12 : 0)) * 60 + time.minute;
            if (res_time < now_time) {
                restaurant_1.Reservation.updateOne({ _id: reservation._id }, { status: 1 });
            }
        }
    }
    console.log("Periodic Clean Up Done");
}), 3 * 60 * 1000);
app.listen(5000, () => {
    console.log("Server Started ^-^");
});
