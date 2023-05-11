import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Reservation, STATUS } from "../models";
import { loadTodayReservations } from "../../service/restaurantData";
import ReservationCard from "./ReservationCard";
import ReservationData from "../../service/reservationData";

interface Props {
    restaurantName: string;
}

const TimeLayout: React.FC<Props> = ({ restaurantName }) => {
    const [views, setViews] = useState<{upcoming: Reservation[], current: Reservation[], late: Reservation[]}>({
        upcoming: [],
        current: [],
        late: []
    });
    const [lateVisibility, setLateVisible] = useState<boolean>(true);
    const [upcomingVisibility, setUpcomingVisible] = useState<boolean>(true);
    const [currentVisibility, setCurrentVisible] = useState<boolean>(true);
    const [addDropdown, setAddDropdown] = useState<boolean>(false);

    const [reload, setReload] = useState<boolean>(true); 
    const loadReservationData = () => {
        loadTodayReservations(restaurantName)
            .then((reservations: Reservation[]) => {
                const new_views: {current: Reservation[], late: Reservation[], upcoming: Reservation[]} = {upcoming: [], current: [], late: []};
                for (let i = 0; i < reservations.length; i++) {
                    if (reservations[i].status == STATUS.ARRIVED) 
                        new_views.current.push(reservations[i]);
                    else if (reservations[i].status == STATUS.LATE)
                        new_views.late.push(reservations[i]);
                    else if (reservations[i].status == STATUS.UPCOMING)
                        new_views.upcoming.push(reservations[i]);
                    console.log(views.upcoming.length);
                }
                setViews(new_views);
            }).catch(() => console.log("Issue with loading today's reservations"));
    }

    const countVisible = () => {
        const count = (lateVisibility ? 1: 0) + (upcomingVisibility ? 1: 0) + (currentVisibility ? 1: 0);
        return count;
    }

    const checkIn = (reservation: Reservation): void => {
        reservation.status = STATUS.ARRIVED;
        const new_views: {late: Reservation[], current: Reservation[], upcoming: Reservation[]} = {
            late: [...views.late], current: [...views.current], upcoming: [...views.upcoming]
        };
        
        if (new_views.upcoming.includes(reservation))
            new_views.upcoming.splice(views.upcoming.indexOf(reservation), 1);
        if (new_views.late.includes(reservation))
            new_views.late.splice(views.late.indexOf(reservation), 1);
        
        new_views.current.push(reservation);
        setViews(new_views);
        // TODO: Push change to DB (STATUS --> ONGOING)
    }

    const checkOut = (reservation: Reservation): void => {
        const new_views: {late: Reservation[], current: Reservation[], upcoming: Reservation[]} = {
            late: [...views.late], current: [...views.current], upcoming: [...views.upcoming]
        }
        
        new_views.current.splice(views.current.indexOf(reservation), 1);
        setViews(new_views);
        // TODO: Push change to DB (STATUS --> DONE)
    }

    const cancel = (reservation: Reservation): void => {
        const new_views: {late: Reservation[], current: Reservation[], upcoming: Reservation[]} = {
            late: [...views.late], current: [...views.current], upcoming: [...views.upcoming]
        }
        
        new_views.late.splice(new_views.late.indexOf(reservation), 1);
        setViews(new_views);
        ReservationData.deleteReservation(reservation._id ? reservation._id : "", () => {return;});
    }

    const minimize = (func: React.Dispatch<React.SetStateAction<boolean>>) => {
        if (countVisible() == 1)
            return;
        
        func(false);
    }

    useEffect(() => {
        console.log(reload);
        if (reload == false)
            return;
        
        console.log('Effect');
        loadReservationData();        
        setReload(false);
    }, [reload]);

    return (
        <div className="mt-2 mb-4">
            <div id="top_banner" className="row ms-2 me-2 position-relative">
                <Link 
                    to="/staff/" 
                    state={{ restaurantName: restaurantName }}
                    className="position-absolute start-0 col-2 col-md-1 btn btn-primary p-1">

                    <div>Back</div> 
                </Link>
                <div className="col-12 text-primary fs-3">Schedule</div>
                <button 
                    className="position-absolute end-0 col-2 col-md-1 btn btn-primary p-1"
                    onClick={() => setReload(true)}>
                        Reload
                </button>
                <hr className="text-primary"/>
            </div>
            <div id="content" className="position-relative row mt-2 mb-4 lightBg"> 
                {lateVisibility ? (
                    <div className={`position-relative col-12 col-md-${countVisible() == 1? "12": "6"} col-lg-${12/countVisible()} mt-1 mb-1 p-1`}>
                        <div 
                            className="position-absolute end-0 col-1 btn btn-dark p-1 me-2" 
                            onClick={() => minimize(setLateVisible)}>
                                -
                        </div>
                        <h4 className="text-danger mb-3">LATE</h4>
                        {views.late.map((reservation) => {
                            return (<div className={`col-12 mb-3
                                                     col-xl-${countVisible() == 1? "4" : "12"}`}>
                                <ReservationCard
                                    reservation={reservation}
                                    stateChanges={[
                                        {label: "Check In", change: checkIn},
                                        {label: "Cancel", change: cancel}
                                    ]}
                                />
                            </div>)
                        })}
                    </div>
                ) : ""
                }

                {currentVisibility ? (
                    <div className={`position-relative col-12 col-md-${countVisible() == 1? "12": "6"} col-lg-${12/countVisible()} mt-1 mb-1 p-1`}>
                        <div 
                            className="position-absolute end-0 col-1 btn btn-dark p-1 me-2" 
                            onClick={() => minimize(setCurrentVisible)}>
                                -
                        </div>
                        <h4 className="text-success mb-3">ONGOING</h4>
                        {views.current.map((reservation) => {
                            return (<div className={`col-12 mb-3
                                                     col-xl-${countVisible() == 1? "4" : "12"}`}>
                                <ReservationCard
                                    reservation={reservation}
                                    stateChanges={[
                                        {label: "Check Out", change: checkOut}
                                    ]}
                                />
                            </div>)
                        })}
                    </div>
                ) : ""
                } 

                {upcomingVisibility ? (
                    <div className={`position-relative col-12 col-md-${countVisible() == 2? "6": "12"} col-lg-${12/countVisible()} mt-1 mb-1 p-1`}>
                        <div 
                            className="position-absolute end-0 col-1 btn btn-dark p-1 me-2" 
                            onClick={() => minimize(setUpcomingVisible)}>
                                -
                        </div>
                        <h4 className="text-primary mb-3">UPCOMING</h4>
                        {views.upcoming.map((reservation) => {
                            console.log(reservation._id);
                            return (<div className={`col-12 mb-3
                                                     col-xl-${countVisible() == 1? "4" : "12"}`}>
                                <ReservationCard
                                    reservation={reservation}
                                    stateChanges={[
                                        {label: "Check In", change: checkIn}
                                    ]}
                                />
                            </div>)
                        })}
                    </div>
                ) : ""
                }

{addDropdown ? (
                    <div className="position-absolute col-3 col-md-2 col-xl-1 ms-2 mt-2 p-0 start-0">
                        <select
                            required
                            name="newView"
                            className="form-select"
                            value={-1}
                            onChange={(event) => {
                                if (event.target.value === "Late") setLateVisible(true);
                                else if (event.target.value == "Current") setCurrentVisible(true);
                                else if (event.target.value == "Upcoming") setUpcomingVisible(true);
                                setAddDropdown(false);
                            }}
                            autoFocus={true}
                            onBlur={() => setAddDropdown(false)}
                        >
                            <option></option>
                            {!lateVisibility ? (<option value={"Late"}>Late</option>) : ("")}
                            {!currentVisibility ? (<option value={"Current"}>Ongoing</option>) : ("")}
                            {!upcomingVisibility ? (<option value={"Upcoming"}>Upcoming</option>) : ("")}
                            
                        </select>
                    </div>
                ) : (
                    <button 
                        className="col-1 position-absolute btn btn-primary p-1 ms-2 mt-2 start-0"
                        onClick={() => setAddDropdown(true)}>
                            +
                    </button>
                )}
            </div>
        </div>
    )
}

export default TimeLayout;