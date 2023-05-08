import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import ReservationData from "../../service/reservationData";

import { Reservation } from "../models";

interface Props {
    data: Reservation;
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
}

    // interface Reservation {
    //     groupName: String;
    //     restaurantName: String;
    //     table: Table;
    //     persons: number;
    //     date: date;
    //     time: time;
    //     duration: time;
    //     status: STATUS
    // };

export const UserReservationCard: React.FC<Props> = ({ data, setRefresh }) => {

    const [cancelConfirm, setCancelConfirm] = useState<boolean>(false);

    const cancelReservation = () => {
        if (cancelConfirm === false) {
            setCancelConfirm(true);
            return;
        }        

        ReservationData.deleteReservation(data._id as string, () => setRefresh(true));
    }

    const twoDigit = (num: number): string => {
        if (num < 10)
            return "0" + num;
        
        return "" + num;
    } 

    return (
        <div className="card p-3">
            <p>Restaurant: {data.restaurantName}</p>
            <p>Table Number: {data.table.num}</p> 
            <p>Number of People: {data.persons}</p>
            <p>Reservation on {twoDigit(data.date.day)}, {twoDigit(data.date.month)}, {data.date.year} at {twoDigit(data.time.hour)}:{twoDigit(data.time.minute)} {data.time.time}</p> 
            <p>Table reserved for {data.duration.hours !== 0 && (data.duration.hours + " hour" + (data.duration.hours !== 1 && "s") + ",")} {data.duration.minutes + " minute" + (data.duration.minutes !== 1 && "s")}</p>
            <button 
                className="btn btn-danger bg-gradient" 
                onClick={cancelReservation}
                onBlur={() => setCancelConfirm(false)}
            >
                    { cancelConfirm ? "Confirm Cancellation" : "Cancel" }
            </button>
        </div>
    );
};