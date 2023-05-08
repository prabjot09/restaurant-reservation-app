import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { Reservation, STATUS } from "../models";
import ReservationData from "../../service/reservationData";
import { UserReservationCard } from "./UserReservationCard";

interface Props {
    username: string;
}

export const UserReservations: React.FC<Props> = ({ username }) => {

    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);

    useEffect(() => {
        setTimeout( () => {
            ReservationData.getReservationByUsername(username, (response: [boolean, string, Reservation[]]) => {
                if (response[0] === true) {
                    setReservations(sortReservations(response[2]));
                }
                else {
                    window.alert(response[1]);
                }
            });
        }, 1500);
        setRefresh(false);
        
    }, [refresh]);
    
    const compareReservations = (res1: Reservation, res2: Reservation): number => {
        const date1: number = (res1.date.year * 10000) + (res1.date.month * 100) + (res1.date.day);
        const date2: number = (res2.date.year * 10000) + (res2.date.month * 100) + (res2.date.day);

        if (date1 < date2)
            return -1;
        if (date1 > date2)
            return 1;
        
        const time1: number = ((res1.time.time == 'AM' ? 1 : 2) * 10000) + (res1.time.hour * 100) + (res1.time.minute);
        const time2: number = ((res2.time.time == 'AM' ? 1 : 2) * 10000) + (res2.time.hour * 100) + (res2.time.minute);

        if (time1 < time2)
            return -1;
        if (time1 > time2)
            return 1;
        
        return 0;
    }

    const sortReservations = (reservations: Reservation[]): Reservation[] => {
        const sortedReservations: Reservation[] = reservations.filter(() => true);

        for (let i = 0; i < reservations.length - 1; i++) {
            let earliest: number = i; 
            for (let j = i + 1; j < reservations.length; j++) {
                if (compareReservations(sortedReservations[j], sortedReservations[earliest]) < 0)
                    earliest = j;
            }
            const temp: Reservation = sortedReservations[earliest];
            sortedReservations[earliest] = sortedReservations[i];
            sortedReservations[i] = temp;
        }

        return sortedReservations;
    }

    return (
        <div className="container">
            <div className="border border-3 border-primary rounded m-4 p-3">
                <div className="row mt-3 mb-4">
                    <h3 className="text-start col-12 col-sm-6">
                        <strong>Your Reservations</strong>
                    </h3>
                    <Link to={`create_reservation/`} className="col-12 col-sm-6">
                        <button className="btn btn-secondary float-end">Reserve Table</button>
                    </Link>
                </div>
                
                <div id="reservations_list" className="row d-block p-2">
                    {reservations.map((reservation, index) => {
                        return (
                            <div key={index}>
                                <UserReservationCard data={reservation} setRefresh={setRefresh} />   
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
        
    )
}