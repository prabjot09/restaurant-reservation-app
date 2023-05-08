import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Reservation, STATUS } from "../models";
import { loadRestaurantReservationsOrdered } from "../../service/restaurantData";
import { IconContext } from "react-icons";
import { IoIosPeople } from "react-icons/io";
import { BiTime } from "react-icons/bi";

interface Props {
    restaurantName: string;
}

export const StaffOverview: React.FC<Props> = ( { restaurantName } ) => {

    const [currentGuests, setCurrentGuests] = useState<number>(0);
    const [remainingReservations, setRemainingReservations] = useState<number>(0);
    const [lateGuests, setLateGuests] = useState<number>(0);
    const [nextReservations, setNextReservations] = useState<Reservation[]>([]);
    const [reservationsAttended, setReservationsAttended] = useState<number>(0);
    const [reservations, setReservations] = useState<Reservation[][]>();

    const clearPreviousLogistics = () => {
        setCurrentGuests(0);
        setRemainingReservations(0);
        setLateGuests(0);
        setReservationsAttended(0);
        setNextReservations([]);
    }
    
    const getReservations = () => loadRestaurantReservationsOrdered(restaurantName, (reservations: Reservation[][]) => {
        setReservations(reservations);
        clearPreviousLogistics();
        let curr = 0, late = 0, remaining = 0, attended = 0, next = [];
        for (let i = 0; i < reservations[0].length; i++) {
            console.log(i);

            if (reservations[0][i].status === STATUS.ARRIVED)
                curr += 1;
            
            else if (reservations[0][i].status === STATUS.LATE)
                late += 1;

            else if (reservations[0][i].status === STATUS.UPCOMING) {
                console.log(i);
                remaining += 1;

                if (next.length < 3) {
                    next.push(reservations[0][i]);
                }
            }

            else if (reservations[0][i].status === STATUS.PAID) {
                attended += 1;
            }
        }
        
        setCurrentGuests(curr);     setLateGuests(late);
        setRemainingReservations(remaining);
        setReservationsAttended(attended + curr + remaining);     
        setNextReservations(next);   
    });

    useEffect(getReservations, []);

    return (
        <div className="mt-2 mb-4">            
            <div className="row pt-3 pb-3 ps-1 pe-1">
                <div className="offset-1 col-10 offset-sm-0 col-sm-6 col-lg-3 border rounded border-primary border-2 pt-1 pb-1 staff_view_container">
                    <h4 className="p-2">Today's Guests</h4>

                    <Statistic label="Checked In:" num={currentGuests} />
                    <Statistic label="Remaining:" num={remainingReservations} />
                    <Statistic label="Late:" num={lateGuests} />
                    <Statistic label="Expected Total:" num={reservationsAttended} />
                </div>
                <div className="offset-1 col-10 offset-sm-0 col-sm-6 col-lg-9">
                    <div className="d-flex align-items-center justify-content-around staff_view_container"
                        id="opt-container">
                        <Link 
                            to="/staff/table_view" 
                            className="d-flex align-items-center justify-content-around staff_view_opt btn btn-primary"
                        >
                            <div>
                                TABLE<br/>
                                VIEW        
                            </div>
                        </Link>
                        <Link 
                            to="/staff/table_view" 
                            className="d-flex align-items-center justify-content-around staff_view_opt btn btn-primary"
                        >
                            <div style={{ textDecoration: "none" }}>
                                TIME<br/>
                                VIEW
                            </div>
                        </Link>
                    </div>
                </div>
                
            </div>
            <div className="row">
                <h3>Upcoming Reservations</h3>
                {(nextReservations.length > 0 && (                
                    nextReservations.map((res, index) => {
                        return (<div className="col-12 offset-md-2 col-md-8 offset-lg-0 col-lg-6 col-xl-4">
                            <div className="mt-3 p-1 border rounded border-dark d-flex align-items-center upcoming_reservations">
                                <p className="fs-5 text-secondary m-2">{index + 1}</p>
                                <p className="fs-5 m-2">{res.groupName} - TABLE {res.table.num}</p>
                                <span className="ms-auto p-1" style={{ width: "110px" }}>
                                    <IconContext.Provider value={{ color: "blue" }}>
                                        <div className="d-block text-end">
                                            <IoIosPeople className="float-start m-1"/> 
                                            {res.persons}
                                        </div>
                                        <div className="d-block text-end"><BiTime className="float-start m-1"/> 
                                            {(res.time.hour < 10 ? "0" : "") + res.time.hour}:
                                            {(res.time.minute < 10 ? "0": "") + res.time.minute} {res.time.time}
                                        </div>
                                    </IconContext.Provider>
                                </span>
                            </div>
                        </div>
                    )})
                )) || (
                    <p className="fs-3"> No reservations left today!</p>
                )}
            </div>
        </div>
    );
};

const Statistic: React.FC<{ label: string, num: number}> = ({ label, num }) => {
    return (
        <div className="row mt-2 mb-2">
            <div className="col-9 text-start">
                {label}
            </div>
            <div className="col-3 text-end">
                {num}
            </div>
        </div>
    )
}