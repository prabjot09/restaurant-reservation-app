import React from "react";
import { Reservation } from "../models";

interface Props {
    reservation: Reservation;
    stateChanges: {label: string, change: (reservation: Reservation) => void}[];
}

const ReservationCard: React.FC<Props> = ({ reservation, stateChanges }) => {
    return <div className="row rounded m-1 p-1 tableUnselected">
        <h3 className="col-12 m-1 text-dark">{reservation.groupName}</h3>
        <div className="col-8">
            <div className="row mb-2">
                <div className="col-8 mb-2 p-1 text-start">
                    <strong className="text-primary">Persons</strong> {" " + reservation.persons}
                </div>
                <div className="col-4 mb-2 p-1 text-start">
                    <strong className="text-primary">Table</strong> {" " + reservation.table.num}
                </div>
                <div className="col-8 p-1 text-start">
                    <strong className="text-primary">Time:</strong> 
                    {" " + reservation.time.hour + ":" + Math.floor(reservation.time.minute/10) + reservation.time.minute%10 + " " + reservation.time.time}
                </div>
                <div className="col-4 p-1 text-start">
                    {" " + reservation.duration.hours + "h" + Math.floor(reservation.duration.minutes/10) + reservation.duration.minutes%10 + "m"}
                </div>
            </div>
        </div>
        <div className="col-4">
            <div className="row mb-1">
                {stateChanges.map((change, index) => {
                    return <button
                        key={index} 
                        className="btn btn-primary mb-1 p-1"
                        onClick={() => change.change(reservation)}>
                        
                        {change.label}
                    </button>
                })}
            </div>
        </div>
    </div>
};

export default ReservationCard;