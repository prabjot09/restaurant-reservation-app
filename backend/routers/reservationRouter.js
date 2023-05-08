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
const restaurant_1 = require("../models/restaurant");
const ReservationRouter = express_1.default.Router();
ReservationRouter.route("/:username").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reservations = yield restaurant_1.Reservation.find({ groupName: req.params.username });
        res.send({ success: true, msg: "Request Successful", reservations: reservations });
    }
    catch (e) {
        res.send({ success: true, msg: e, reservations: [] });
    }
}));
ReservationRouter.route("/:restaurantName").post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurant = yield restaurant_1.Restaurant.findOne({ name: req.params.restaurantName });
    if (restaurant === null) {
        res.send("");
        return;
    }
    console.log(req.body.reservation);
    const newReservation = new restaurant_1.Reservation(req.body.reservation);
    yield newReservation.save();
    const newReservations = [...restaurant.reservations, newReservation._id];
    yield restaurant_1.Restaurant.updateOne({ name: req.params.restaurantName }, { reservations: newReservations });
    res.send((yield restaurant_1.Reservation.findOne({ _id: newReservation._id })) !== null ? "Success" : "Fail");
}));
ReservationRouter.route("/:id").delete((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('del');
    const toDelete = yield restaurant_1.Reservation.findOne({ _id: req.params.id });
    console.log(toDelete === null || toDelete === void 0 ? void 0 : toDelete.restaurantName);
    if (toDelete) {
        const restaurant = yield restaurant_1.Restaurant.findOne({ name: toDelete.restaurantName });
        if (restaurant) {
            yield restaurant_1.Restaurant.updateOne({ name: restaurant.name }, { reservations: restaurant.reservations.filter((reservation) => {
                    return reservation.toString() !== req.params.id;
                }) });
            yield restaurant_1.Reservation.deleteOne({ _id: req.params.id });
            res.send((yield restaurant_1.Reservation.findOne({ _id: req.params.id })) === null);
        }
        else {
            res.status(404).send("Corresponding Restaurant Not Found");
        }
    }
    else {
        res.status(404).send("Reservation not found!");
    }
}));
exports.default = ReservationRouter;
