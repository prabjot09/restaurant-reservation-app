import express from "express";
import { ObjectId, Schema, Types } from "mongoose";
import { Reservation, Restaurant, RestaurantIF, ReservationIF, restaurantSchema } from "../models/restaurant";
import restaurantRouter from "./restaurantRouter";

const ReservationRouter = express.Router();

ReservationRouter.route("/:restaurantName/update").post(async (req, res) => {
    const reservation: ReservationIF = req.body.reservation;
    await Reservation.findByIdAndUpdate(reservation._id, { $set: { status: reservation.status } });

    const result: ReservationIF | null = await Reservation.findById(reservation._id);
    res.send(result != null && result.status == reservation.status ? "true" : "false");
});

ReservationRouter.route("/:username").get(async (req, res) => {
    try {
        const reservations: ReservationIF[] = await Reservation.find( { groupName : req.params.username } );
        res.send({ success: true, msg: "Request Successful", reservations: reservations });
    }
    catch (e) {
        res.send({ success: true, msg: e, reservations: [] });
    }
    
})

ReservationRouter.route("/:restaurantName").post(async (req, res) => {
    const restaurant: RestaurantIF | null = await Restaurant.findOne({ name: req.params.restaurantName });

    if (restaurant === null) { 
        res.send("");
        return;
    }

    console.log(req.body.reservation);
    const newReservation = new Reservation(req.body.reservation);
    await newReservation.save();

    const newReservations: ObjectId[] = [ ...restaurant.reservations, newReservation._id ];

    await Restaurant.updateOne({ name: req.params.restaurantName }, { reservations: newReservations });

    res.send( await Reservation.findOne( { _id: newReservation._id } ) !== null ? "Success" : "Fail");
});

ReservationRouter.route("/:id").delete(async (req, res) => {
    const toDelete = await Reservation.findOne({ _id: req.params.id });
    if (toDelete) {
        const restaurant = await Restaurant.findOne( { name: toDelete.restaurantName });
        if (restaurant) {   
            await Restaurant.updateOne( 
                { name: restaurant.name} , 
                { reservations: restaurant.reservations.filter((reservation) => {
                    return reservation.toString() !== req.params.id;
                })}  
            );

            await Reservation.deleteOne({ _id: req.params.id });
            res.send(await Reservation.findOne( { _id: req.params.id } ) === null);
        }
        else {
            res.status(404).send("Corresponding Restaurant Not Found");
        }
    }
    else {
        res.status(404).send("Reservation not found!");
    }
});

export default ReservationRouter;