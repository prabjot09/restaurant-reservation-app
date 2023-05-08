import express from "express";
import mongoose, { ObjectId, Types, Schema } from "mongoose";
import { Restaurant, RestaurantIF, TimeIF, Reservation, ReservationIF, timeSchema } from "../models/restaurant";

interface modifiedRestaurant extends Omit<RestaurantIF, 'hours'>{
    hours: {
        open: [number, number, string];
        close: [number, number, string];
    };
}

const restaurantRouter = express.Router();

const mainRoute = restaurantRouter.route("/");

type time = [number, number, string];

mainRoute.post(async (req, res) => {
    const reqRestaurant: modifiedRestaurant = req.body.restaurant;

    const open: time = reqRestaurant.hours.open;
    const close: time = reqRestaurant.hours.close;
    
    const TimeModel = mongoose.model<TimeIF>('Time', timeSchema);

    const convertedHours: {open: TimeIF, close: TimeIF} = { 
        open: new TimeModel({ hour: open[0], minute: open[1], time: open[2]}),
        close: new TimeModel({ hour: close[0], minute: close[1], time: close[2]}),
    }

    let newTables: {num: number, capacity: number}[] = [];

    for (let i = 0; i < reqRestaurant.tables.length; i++) {
        for (let j = 0; j < reqRestaurant.tables[i].num; j++) 
            newTables.push({num: newTables.length, capacity: reqRestaurant.tables[i].capacity});
    }
    reqRestaurant.tables = newTables;

    let convertedRestaurant: RestaurantIF = { ...reqRestaurant, hours: convertedHours};

    try {
        const newRestaurant = await new Restaurant(convertedRestaurant);
        try {
            newRestaurant.save();
            res.send("Success")
        } catch (error) {
            console.log(error);
            res.send("Restaurant object was unable to be saved in the database.");
        }
    } catch (error) {
        console.log(error);
        res.send("Restaurant object is invalid.");
    }
});

mainRoute.get(async (req, res) => {
    const restaurant: RestaurantIF | null = await Restaurant.findOne();
    res.send({ hasRestaurant: restaurant !== null, restaurant: restaurant});
});

restaurantRouter.route("/:name").get( async (req, res) => {
    const restaurant: RestaurantIF | null = await Restaurant.findOne({ name: req.params.name });
    if (restaurant === null) {
        res.send("");
        return;
    }

    res.send({
        restaurant: restaurant,
    });
});

restaurantRouter.route("/hours/:name").get(async (req, res) => {
    const restaurant: RestaurantIF | null = await Restaurant.findOne({ name: req.params.name });
    const hours: {open: TimeIF, close: TimeIF } | null = restaurant !== null ? restaurant.hours : null;

    if (hours === null) {
        res.send("");
        return;
    }

    res.send({
        open: [hours.open.hour, hours.open.minute, hours.open.time], 
        close: [hours.close.hour, hours.close.minute, hours.close.time]
    });
});

const reservationsSubRoute = restaurantRouter.route("/reservations/:name");
reservationsSubRoute.get(async (req, res) => {
    const restaurant: RestaurantIF | null = await Restaurant.findOne({ name: req.params.name });
    if (restaurant === null) {
        res.send("");
        return;
    }

    const reservationIds: mongoose.ObjectId[] = restaurant.reservations;

    let reservations: (ReservationIF | null)[] = [];
    for (let i = 0; i < reservationIds.length; i++) {
        reservations.push( await Reservation.findById(reservationIds[i]) );
    }

    res.send(reservations);
});
 
restaurantRouter.route("/staff_key/:name").get(async (req, res) => {
    const restaurantName = req.params.name;
    const restaurant = await Restaurant.findOne( { name: restaurantName } );
    if (restaurant)
        res.send( { accessKey : restaurant.staffKey } );
    else
        res.send("Error: Restaurant not Found");
})

export default restaurantRouter;