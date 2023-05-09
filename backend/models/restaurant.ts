import mongoose, { ObjectId, Types, Schema } from "mongoose";

type minute = number;
type hour = number;
type time = [hour, minute, string];
type date = [number, number, number];

export interface RestaurantIF {
    name: string;
    location: string;
    tables: TableIF[];
    hours: { open: TimeIF, close: TimeIF },
    reservations: ObjectId[],
    ownerKey: string;
    staffKey: string;
}

export interface ReservationIF {
    groupName: String; 
    restaurantName: String;
    table: TableIF;
    persons: number;
    date: DateIF;
    time: TimeIF
    duration: {hours: number, minutes: number };
    status: number;
    _id: ObjectId;
};

export interface TableIF {
    num: number;
    capacity: number;
}

export interface TimeIF {
    hour: number;
    minute: number;
    time: string;
}

export interface DateIF {
    day: number;
    month: number;
    year: number;
}

export const timeSchema = new mongoose.Schema<TimeIF>({
    hour: {type: Number, required: true},
    minute: {type: Number, required: true},
    time: {type: String, required: true},
})

const dateSchema = new mongoose.Schema<DateIF>({
    day: {type: Number, required: true},
    month: {type: Number, required: true},
    year: {type: Number, required: true}
});

const tableSchema = new mongoose.Schema<TableIF>({
    num: {type: Number, required: true},
    capacity: {type: Number, required: true}
});

export const reservationSchema = new mongoose.Schema<ReservationIF>({
    groupName: {type: String, required: true},
    restaurantName: {type: String, required: true},
    table: { type: tableSchema, required: true},
    persons: {type: Number, required: true},
    date: { type: dateSchema, required: true },
    time: { type: timeSchema, required: true},
    duration: { type: { hours: Number, minutes: Number }, required: true },
    status: { type: Number, required: true }
});

export const restaurantSchema = new mongoose.Schema<RestaurantIF>({
    name: {type: String, required: true},
    location: {type: String, required: true},
    tables: {type: [tableSchema], required: true},
    hours: {type: { open: timeSchema, close: timeSchema }, required: true },
    ownerKey: {type: String, required: true},
    staffKey: {type: String, required: true},
    reservations: {type: [Schema.Types.ObjectId], required: true},
});

restaurantSchema.statics.hasRestaurant = (async function(): Promise<boolean> {
    const hasARestaurant: boolean = await this.find().countDocuments() != 0;
    return hasARestaurant;
});

export const Restaurant = mongoose.model<RestaurantIF>('Restaurant', restaurantSchema);

export const Reservation = mongoose.model<ReservationIF>('Reservation', reservationSchema);



