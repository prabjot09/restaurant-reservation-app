import React from "react";
import { Reservation, SEAT, Table, timeInMinutes } from "../models";
import { UserReservationTableUnit } from "./UserReservationTableUnit";

interface Props {
    hours: [number, number]
    table: Table,
    reservations: Reservation[],
    selectTable: (table: Table, seats: SEAT[]) => void,
    selected: boolean,
    selectionPage?: boolean
}

export const UserTableSelection: React.FC<Props> = ({ hours, table, reservations, selectTable, selected, selectionPage }) => {

    const createDivisions = (): SEAT[] => {
        let divisions: SEAT[] = [];

        let minutes = 0;
        for (; minutes < hours[0]; minutes += 15) {
            divisions[minutes/15] = SEAT.CLOSED;
        }
        for (; minutes < hours[1]; minutes += 15) {
            divisions[minutes/15] = SEAT.AVAILABLE;
        }
        for (; minutes < 24*60; minutes += 15) {
            divisions[minutes/15] = SEAT.CLOSED;
        }
        
        for (let i = 0; i < reservations.length; i++) {
            const opening = reservations[i].time;
            const startTIme: number = timeInMinutes([opening.hour, opening.minute, opening.time]); 

            const endTime = startTIme + reservations[i].duration.hours*60 + reservations[i].duration.minutes;

            const startDivision = parseInt("" + (startTIme/15));

            console.log(endTime);

            const endDivision = parseInt("" + (endTime/15));

            let reserved = false;
            for (let i = startDivision; i < endDivision; i++) {
                divisions[i] = SEAT.RESERVED;
                reserved = true;
            }
            if (reserved) console.log(divisions);
        }

        return divisions;
    }

    const generateData = (divisions: SEAT[]) => {
        const data: {am: SEAT[][], pm: SEAT[][]} = {
            am: [],
            pm: []
        }

        for (let i = 0; i < 12; i++) {
            const seatsAM: SEAT[] = [];
            const seatsPM: SEAT[] = [];
            for (let j = 0; j < 4; j++) {
                seatsAM.push(divisions[i*4 + j]);
                seatsPM.push(divisions[(i+12)*4 + j]);
            }
            data.am.push(seatsAM);
            data.pm.push(seatsPM);
        }

        return data;
    }

    const divisions: SEAT[] = createDivisions();
    const tableData: { am: SEAT[][], pm: SEAT[][] } = generateData(divisions);
    

    let tableHeadings: string[] = [];
    for (let i = 1; i <= 12; i++) {
        if (i % 3 == 0) 
            tableHeadings.push("" + i);
        else 
            tableHeadings.push("");
    }

    const cardBg = () => {
        if (!selected) {
            return "tableUnselected border border-light border-3";
        }

        return "tableSelected border border-primary border-3"
    }

    return (
        <div className={selectionPage === undefined ? "col-12 col-lg-6 col-xl-4" : "col-12 offset-lg-1 col-lg-10"}>
            <div 
                className={`rounded ps-sm-2 pe-sm-2 pt-4 pb-3 mb-4 ${cardBg()} ${selectionPage ? "" : "table-card"}`}
                onClick={ () => selectTable(table, divisions) }
            >
                <div className="row mt-0 mb-4 ms-3 me-3">
                    <p className="col-6 text-start m-0 fs-5"><strong>Table {table.num}:</strong></p>
                    <p className="col-6 text-end m-0  tableLabels">Seating Capacity: {table.capacity}</p>
                </div>
                
                <div className="row m-1 p-sm-1">
                    {/* <table>
                        <tr>
                            <th></th> 
                            { tableHeadings.map((headings, index) => {
                            return <th className="text-end" key={index}>{headings}</th>;
                            })}
                        </tr>
                        <tr>
                            <th>AM: </th>
                            { tableData.am.map((amTable, index) => {
                                return <td key={index}> <UserReservationTableUnit divisions={amTable} /> </td>
                            })}
                        </tr>
                    </table> */}

                    <div className="col-1 ps-0">
                        <div className="d-flex flex-column text-start" style={{ height: "85px", justifyContent: "space-between" }}>
                            <div style={{ flexBasis : "30%"}}>
                                
                            </div>
                            <div style={{ flexBasis : "30%"}} className="tableLabels">
                                AM:
                            </div>
                            <div style={{ flexBasis : "26%"}} className="tableLabels">
                                PM:
                            </div>
                        </div>
                    </div>

                    <div className="col-11">
                        <div className="d-flex flex-column" style={{ height: "85px", justifyContent: "space-between" }}>
                            <div style={{ flexBasis : "30%"}}>
                                <div className="row" style={{ height: "100%" }}>
                                    { tableHeadings.map((headings, index) => {
                                        return <div className="text-end col-1 ps-0 pe-1" key={index}>{headings}</div>;
                                    })}
                                </div>
                            </div>

                            <div style={{ flexBasis : "30%"}}>
                                <div className="row" style={{ height: "100%" }}>
                                    {tableData.am.map((seats, index) => {
                                        return (
                                            <div key={index} className="col-1 pe-1 ps-0 pt-0 pb-0">
                                                <UserReservationTableUnit divisions={seats} />
                                            </div>
                                        )
                                    })}
                                </div>  
                            </div>   
                            <div style={{ flexBasis : "30%"}}>
                                <div className="row" style={{ height: "100%" }}>
                                    {tableData.pm.map((seats, index) => {
                                        return (
                                            <div key={index} className="col-1 pe-1 ps-0 pt-0 pb-0">
                                                <UserReservationTableUnit divisions={seats} />
                                            </div>
                                        )
                                    })}
                                </div>  
                            </div>   
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}