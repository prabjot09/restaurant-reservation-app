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
const mongoose_1 = __importDefault(require("mongoose"));
const restaurant_1 = require("../models/restaurant");
const restaurantRouter = express_1.default.Router();
const mainRoute = restaurantRouter.route("/");
mainRoute.post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reqRestaurant = req.body.restaurant;
    const open = reqRestaurant.hours.open;
    const close = reqRestaurant.hours.close;
    const TimeModel = mongoose_1.default.model('Time', restaurant_1.timeSchema);
    const convertedHours = {
        open: new TimeModel({ hour: open[0], minute: open[1], time: open[2] }),
        close: new TimeModel({ hour: close[0], minute: close[1], time: close[2] }),
    };
    let newTables = [];
    for (let i = 0; i < reqRestaurant.tables.length; i++) {
        for (let j = 0; j < reqRestaurant.tables[i].num; j++)
            newTables.push({ num: newTables.length, capacity: reqRestaurant.tables[i].capacity });
    }
    reqRestaurant.tables = newTables;
    let convertedRestaurant = Object.assign(Object.assign({}, reqRestaurant), { hours: convertedHours });
    try {
        const newRestaurant = yield new restaurant_1.Restaurant(convertedRestaurant);
        try {
            newRestaurant.save();
            res.send("Success");
        }
        catch (error) {
            console.log(error);
            res.send("Restaurant object was unable to be saved in the database.");
        }
    }
    catch (error) {
        console.log(error);
        res.send("Restaurant object is invalid.");
    }
}));
mainRoute.get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurant = yield restaurant_1.Restaurant.findOne();
    res.send({ hasRestaurant: restaurant !== null, restaurant: restaurant });
}));
restaurantRouter.route("/:name").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurant = yield restaurant_1.Restaurant.findOne({ name: req.params.name });
    if (restaurant === null) {
        res.send("");
        return;
    }
    res.send({
        restaurant: restaurant,
    });
}));
restaurantRouter.route("/hours/:name").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurant = yield restaurant_1.Restaurant.findOne({ name: req.params.name });
    const hours = restaurant !== null ? restaurant.hours : null;
    if (hours === null) {
        res.send("");
        return;
    }
    res.send({
        open: [hours.open.hour, hours.open.minute, hours.open.time],
        close: [hours.close.hour, hours.close.minute, hours.close.time]
    });
}));
const reservationsSubRoute = restaurantRouter.route("/reservations/:name");
reservationsSubRoute.get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurant = yield restaurant_1.Restaurant.findOne({ name: req.params.name });
    if (restaurant === null) {
        res.send("");
        return;
    }
    const reservationIds = restaurant.reservations;
    let reservations = [];
    for (let i = 0; i < reservationIds.length; i++) {
        reservations.push(yield restaurant_1.Reservation.findById(reservationIds[i]));
    }
    res.send(reservations);
}));
restaurantRouter.route("/staff_key/:name").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurantName = req.params.name;
    const restaurant = yield restaurant_1.Restaurant.findOne({ name: restaurantName });
    if (restaurant)
        res.send({ accessKey: restaurant.staffKey });
    else
        res.send("Error: Restaurant not Found");
}));
restaurantRouter.route("/reservations/:name/today").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurantName = req.params.name;
    const restaurant = yield restaurant_1.Restaurant.findOne({ name: restaurantName });
    if (restaurant === null) {
        res.send("");
        return;
    }
    const reservationIds = restaurant.reservations;
    const today = new Date(Date.now());
    const [date, month, year] = [today.getDate(), today.getMonth() + 1, today.getFullYear()];
    const reservations = yield restaurant_1.Reservation.find({ _id: { $in: reservationIds }, 'date.day': date, 'date.month': month, 'date.year': year });
    res.send(reservations);
}));
exports.default = restaurantRouter;
