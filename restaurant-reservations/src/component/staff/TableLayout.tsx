import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Reservation, STATUS, Table, timeInMinutes } from "../models";
import { loadTodayReservations, loadRestaurantHours, loadRestaurantTables } from "../../service/restaurantData";
import { UserTableSelection } from "../users/UserTableSelection";


interface Props {
    restaurantName: string;
}

const TableLayout: React.FC<Props> = ({ restaurantName }) => {

    const [reservationMap, setReservationMap] = useState<{[table: number] : Reservation[]}>([]);
    const [tables, setTables] = useState<Table[]>([]);
    const [restaurantHours, setRestaurantHours] = useState<{open: [number, number, string], close: [number, number, string]}>(
        {open: [-1, -1, ''], close: [-1, -1, '']}
    );
    const [lateReservations, setLate] = useState<{[table: number]: Reservation | null}>({});
    const [ongoingReservations, setOngoing] = useState<{[table: number]: Reservation | null}>({});
    const [upcomingReservations, setUpcoming] = useState<{[table: number]: Reservation | null}>({});

    const [redo, setRedo] = useState<boolean>(false);

    const loadTableData = () => {
        loadRestaurantHours(restaurantName)
            .then((hours) => {
                const opening = hours.open;
                const closing = hours.close;
                setRestaurantHours({
                    open: [opening[0], opening[1], opening[2]],
                    close: [closing[0], closing[1], closing[2]],
                });
            }); 
        
        loadRestaurantTables(restaurantName)
            .then((tables) => {
                setTables(tables);
            })
    };
    useEffect(() => loadTableData(), [redo]);

    const mapReservationsToTables = (reservations: Reservation[]) => {
        const map: {[table: number]: Reservation[]} = {};
        for (let i = 0; i < reservations.length; i++) {
            const table_num = reservations[i].table.num;
            if (map[table_num])
                map[table_num].push(reservations[i]);
            else
                map[table_num] = [reservations[i]];
        }

        return map;
    }

    const formatTime = (time: {hour: number, minute: number, time: string} | undefined): string => {
        if (time === undefined)
            return "";

        return ("" + time.hour + ":" + Math.floor(time.minute/10) + time.minute%10 + " " + time.time)
    }

    const setTableReservations = (table_num: number) => {
        const reservations: Reservation[] = reservationMap[table_num];
        if (reservations === undefined)
            return null;
        
        let i = 0;
        while (i < reservations.length) {
            if (ongoingReservations[table_num] == null && reservations[i].status == STATUS.ARRIVED) {
                ongoingReservations[table_num] = reservations[i];
            }

            if (upcomingReservations[table_num] == null && reservations[i].status == STATUS.UPCOMING) {
                upcomingReservations[table_num] = reservations[i];
            }

            if (lateReservations[table_num] == null && reservations[i].status == STATUS.LATE) {
                lateReservations[table_num] = reservations[i];
            }

            i += 1;
        }

        return null;
    }

    useEffect(() => {
        loadTodayReservations(restaurantName)
            .then((loaded: Reservation[]) => {
                console.log("Data Loaded!");
                //if (loaded != reservations)
                setReservationMap(mapReservationsToTables(loaded));
                for (let i = 0; i < tables.length; i++) {
                    ongoingReservations[i] = null;
                    upcomingReservations[i] = null;
                    lateReservations[i] = null;
                    setTableReservations(tables[i].num);
                }
            })
            .catch(() => {
                console.log("Issue retrieving today's reservations");
            });
        setTimeout(() => {
            console.log(reservationMap);
            setRedo(!redo);
        },  60 * 1000);
    }, [redo, tables]);
    
    return (
        <div className="mt-2 mb-4">            
            <div id="top_banner" className="row px-2">
                <Link 
                    to="/staff/" 
                    state={{ restaurantName: restaurantName }}
                    className="position-absolute col-2 col-md-1 col btn btn-primary">

                    <div>Back</div> 
                </Link>
                <div className="col-12 text-primary fs-3">Table Reservations</div>
            </div>

            <div id="table_list" className="row pt-3 pb-2">
                {tables.map((table) => {
                    return (
                        <div className="col-12 col-md-6 col-xl-4 mb-3" key={table.num}>
                            <div className={`${lateReservations[table.num] != null ? "border border-3 border-danger": ""}`}>
                                <div className="tableUnselected">
                                    <UserTableSelection 
                                        hours={[timeInMinutes(restaurantHours.open), timeInMinutes(restaurantHours.close)]}
                                        table={table}
                                        reservations={reservationMap[table.num] ? reservationMap[table.num] : []}
                                        selectTable={() => {return;}}
                                        selected={false}
                                        selectionPage={true}
                                    />                    
                                </div>
                                <div className="tableUnselected p-1">
                                    { lateReservations[table.num] != null ? (
                                        <div className="text-danger">
                                            <strong>Late Reservation</strong> <br />
                                            Group : { lateReservations[table.num]?.groupName } <br />
                                            Expected Arrival: { formatTime(lateReservations[table.num]?.time) }
                                        </div>
                                    ) : (ongoingReservations[table.num] != null ? (
                                        <div className="text-success">
                                            <strong>Currently Reserved</strong> <br />
                                            Group: { ongoingReservations[table.num]?.groupName } <br />
                                            End Time: { formatTime(ongoingReservations[table.num]?.time) }
                                        </div>
                                    ) : (upcomingReservations[table.num] != null ? (
                                        <div className="text-primary">
                                            <strong>Next Reservation</strong> <br />
                                            Group : { upcomingReservations[table.num]?.groupName } <br />
                                            Arrival: { formatTime(upcomingReservations[table.num]?.time)}
                                        </div>
                                    ) : (
                                        "Table is Clear for the Day!"
                                    )))}
                                </div>
                            </div>
                            
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default TableLayout;