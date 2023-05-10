import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Reservation, Table, timeInMinutes } from "../models";
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

    const getNextReservation = (table_num: number) => {
        const reservations: Reservation[] = reservationMap[table_num];
        if (reservations === undefined)
            return null;
        
        let i = 0;
        const today = new Date(Date.now());
        const now = today.getHours() * 60 + today.getMinutes();
        while (i < reservations.length) {
            const res_time = reservations[i].time;
            const res_mins = timeInMinutes([res_time.hour, res_time.minute, res_time.time]);
            if (res_mins > now) {
                return reservations[i]
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
            })
            .catch(() => {
                console.log("Issue retrieving today's reservations");
            });
        setTimeout(() => {
            console.log(reservationMap);
            setRedo(!redo);
        },  6 * 1000);
    }, [redo]);
    
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
                        <div className="col-12 col-md-6 col-xl-4 tableUnselected p-1" key={table.num}>
                            <div className="">
                                <UserTableSelection 
                                    hours={[timeInMinutes(restaurantHours.open), timeInMinutes(restaurantHours.close)]}
                                    table={table}
                                    reservations={reservationMap[table.num] ? reservationMap[table.num] : []}
                                    selectTable={() => {return;}}
                                    selected={false}
                                    selectionPage={true}
                                />                    
                            </div>
                            <div className="">
                                Next Reservation: { getNextReservation(table.num) != null  ? (
                                    <div>
                                        Group: { getNextReservation(table.num)?.groupName} <br/>
                                        Arrival: { getNextReservation(table.num)?.time.hour + ":" +
                                                  getNextReservation(table.num)?.time.minute + " " +
                                                  getNextReservation(table.num)?.time.time }
                                    </div>
                                ) : (
                                    "None"
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default TableLayout;