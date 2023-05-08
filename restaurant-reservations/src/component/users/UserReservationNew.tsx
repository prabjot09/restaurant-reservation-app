import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IconContext } from "react-icons";
import { TiArrowBack } from "react-icons/ti";
import { MdArrowBackIosNew, MdNavigateNext } from "react-icons/md";
import { Reservation, SEAT, STATUS, Table, timeInMinutes } from "../models";
import { loadRestaurantTables, loadRestaurantReservations, loadRestaurantHours } from "../../service/restaurantData";
import { UserTableSelection } from "./UserTableSelection";
import { HoursForm } from "../create/HoursForm";
import ReservationData from "../../service/reservationData";

interface Props {
    username: string;
    restaurantName: string;
}

type pageNum = 1 | 2 | 3;

export const UserReservationNew: React.FC<Props> = ({ username, restaurantName }) => {

    const now = new Date(Date.now());
    const monthsList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const [selectedTable, setSelectedTable] = useState<[Table, SEAT[]]>([{ num: -1, capacity: -1}, []]);
    const [date, setDate] = useState<[number, string, number]>([now.getDate(), monthsList[now.getMonth()], now.getFullYear()]);
    const [startTime, setStartTime] = useState<[number, number, string]>([-1, -1, '']);
    const [endTime, setEndTime] = useState<[number, number, string]>([-1, -1, '']);
    const [numPeople, setNumPeople] = useState<number>(0);

    const [tables, setTables] = useState<Table[]>([]);
    const [restaurantHours, setRestaurantHours] = useState<{
        open: [number, number, string],
        close: [number, number, string],
    }>( { open: [-1, -1, ''], close: [-1, -1, ''] } );
    const [annotatedTables, setAnnotatedTables] = useState<Reservation[][]>([]);
    const [tablesToReserve, setTablesToReserve] = useState<boolean[]>([]);
    const [restaurantHoursInMins, setRestaurantHoursInMins] = useState<[number, number]>([-1, -1]);

    const [pages, setPages] = useState<pageNum>(1);

    const days: number[] = ((): number[] => {
        let days: number[] = [];
        for (let i = 1; i <= 31; i++) {
            days.push(i);
        }
        return days;
    })();

    const months: {[month: string]: {month: number, days: number}} = {
        "Jan": {month: 1, days: 31}, "Feb": {month: 1, days: 28}, "Mar": {month: 3, days: 31},
        "Apr": {month: 4, days: 30}, "May": {month: 5, days: 31}, "Jun": {month: 6, days: 30},
        "Jul": {month: 7, days: 31}, "Aug": {month: 8, days: 31}, "Sep": {month: 9, days: 30},
        "Oct": {month: 10, days: 31}, "Nov": {month: 11, days: 30}, "Dec": {month: 12, days: 31},
    };

    const years = [now.getFullYear(), now.getFullYear() + 1];

    const sortTables = (tables: Table[]): void => {
        for (let i = 0; i < tables.length - 1; i++) {
            let smallestCapacity = i;
            for (let j = i + 1; j < tables.length; j++) {
                if (tables[j].capacity < tables[smallestCapacity].capacity)
                    smallestCapacity = j;
            }

            const temp = tables[smallestCapacity];
            tables[smallestCapacity] = tables[i];
            tables[i] = temp;
        }
        console.log(tables.map((table) => table.capacity));
    }

    const loadTables = (tables: Table[]): Table[] => {
        const filteredTables: Table[] = tables.filter((table) => {
            return table.capacity >= numPeople && table.capacity <= numPeople + 3;
        });
        sortTables(filteredTables);
        return filteredTables;
    }

    /*
        1. Start/End Time
        2. Tables
        3. Reservations at this restaurant and assign the restaurants to the respective table
    */

    const setTableAvailabilities = async () => {
        let restaurantHours: { open: [number, number, string], close: [number, number, string]} = {
            open: [-1, -1, ''], close: [-1, -1, '']
        }

        await loadRestaurantHours(restaurantName)
            .then((hours) => {
                const opening = hours.open;
                const closing = hours.close;
                restaurantHours = {
                    open: [opening[0], opening[1], opening[2]],
                    close: [closing[0], closing[1], closing[2]],
                };
            });       

        let reservationStart = timeInMinutes(restaurantHours.open);
        const reservationEnd = timeInMinutes(restaurantHours.close);
        const currentTime = now.getHours()*60 + now.getMinutes();
        if (date[0] === now.getDate() && months[date[1]].month === now.getMonth() + 1 && currentTime > reservationStart) {
            reservationStart = currentTime;
        }

        setRestaurantHoursInMins([reservationStart, reservationEnd]);

        let requestedTables: Table[] = [];

        const resReservations: Reservation[] = loadRestaurantReservations(restaurantName);
        console.log(resReservations);

        let reservationTables: Reservation[][] = [];

        console.log(reservationTables);
        
        for (let i = 0; i < resReservations.length; i++) {
            const resDate = resReservations[i].date;
            if (resDate.day === date[0] && resDate.month === months[date[1]].month && resDate.year === date[2]) {
                if (reservationTables[resReservations[i].table.num] === undefined) 
                    reservationTables[resReservations[i].table.num] = [];

                reservationTables[resReservations[i].table.num].push(resReservations[i]);
            }
        }

        setAnnotatedTables(reservationTables);
        
        await loadRestaurantTables(restaurantName)
            .then((tables: Table[]) => {
                requestedTables = loadTables(tables);
                setTables(requestedTables);
            });
        
        console.log(reservationTables[11])
    }

    const validateDate = (): boolean => {
        if (date[0] === -1 || date[1] === '' || date[2] === -1) {
            return false;
        }

        const isLeapYr = date[2] % 4 === 0 && (date[2] % 400 === 0 || !(date[2] % 100 === 0));
        if (isLeapYr)
            months.Feb.days += 1;

        let isValid = false;
        const month = date[1];
        if (date[0] >= 0 && date[0] <= months[month].days)
            isValid = true;    

        if (isLeapYr)
            months.Feb.days -= 1;

        return isValid;
    }

    const verifyPage1 = async (): Promise<void>  => {
        if ( !(numPeople > 0 && validateDate()) ) {
            window.alert('The group must have at least 1 person, and the date must be a valid date.');
            return;
        }

        const futureError = "This reservation is for a date too far in the future.\n     \
                            Please specify a date within a month of today.";

        const pastError = "This date has already passed silly."

        if ( (date[2] * 10000) + (months[date[1]].month *100) + date[0] < 
              (now.getFullYear() * 10000) + ((now.getMonth()+1) *100) + now.getDate()) {

            window.alert(pastError);
            return;
        }

        if (date[2] === now.getFullYear()) {
            if (now.getMonth() + 1 < months[date[1]].month - 1) {
                window.alert("1: " + futureError);
                return;
            }
            if (now.getMonth()+1 !== months[date[1]].month && now.getDate() < date[0]) { // Only dates of one month apart are left to check. (Due to the 'pastError' check, all dates of same month are validated already)
                window.alert("2: " + futureError);
                return;
            }

        }
        else if (months[date[1]].month !== 0 || now.getMonth() !== 12 || now.getDate() < date[0]) {
            window.alert("3: " + futureError);
            return;
        } 

        // verified that all data recieved is valid so far.
        await setTableAvailabilities();
        setPages(2);
    };

    const selectTable = (table: Table, seats: SEAT[]): void => {
        if (table.num === selectedTable[0].num) {
            setSelectedTable([{ num: -1, capacity: -1 }, []]);
            return;
        }

        setSelectedTable([table, seats]);
    }

    const verifyPage2 = (): void => {
        if (selectedTable[0].num >= 0 && selectedTable[0].capacity > 0) {
            setPages(3);
        }
        else {
            window.alert("A table must be selected to proceed further.");
        }
    };

    const validateReservationTime = (): boolean => {
        if (startTime[0] === -1 || startTime[1] === -1 || startTime[2] === '' ||
            endTime[0] === -1 || endTime[1] === -1 || endTime[2] === '') {
                
            return true;
        }

        const startMins = timeInMinutes(startTime);
        const endMins = timeInMinutes(endTime);
        
        const selected: boolean[] = [];
        for (let minute = 0; minute < 24*60; minute += 15) {
            selected.push(startMins <= minute && minute < endMins);
        }

        let conflict: boolean = false;
        for (let i = 0; i < selected.length; i++) {
            conflict = conflict || (selected[i] === true && selectedTable[1][i] !== SEAT.AVAILABLE);
        }
        
        console.log(selected);

        if (conflict === true) 
            return false;
        
        return true;
    };

    const submitReservation = () => {
        if (startTime[0] === -1 || startTime[1] === -1 || startTime[2] === '') {
            window.alert("Start time of your reservation must be set before submitting");
            return;
        }
        
        if (endTime[0] === -1 || endTime[1] === -1 || endTime[2] === '') {
            window.alert("End time of your reservation must be set before submitting");
            return;
        }

        const startTimeMins = timeInMinutes(startTime);
        const endTimeMins = timeInMinutes(endTime);

        if (endTimeMins - startTimeMins < 15) {
            window.alert("The reservation must last at least 15 minutes.");
            return;
        }

        const duration: number = endTimeMins - startTimeMins;

        const newReservation: Reservation = {
            restaurantName: restaurantName,
            groupName: username,
            table: selectedTable[0],
            persons: numPeople,
            date: { day: date[0], month: months[date[1]].month, year: date[2]},
            time: { hour: startTime[0], minute: startTime[1], time: startTime[2]},
            duration: { hours: (duration - duration % 60)/60,  minutes: duration % 60 },
            status: STATUS.UPCOMING,
        };

        ReservationData.saveReservation(newReservation, restaurantName, () => window.alert('Reservation created successfully'));
    };

    const clearPage = () => {
        const response: string | null = window.prompt("By going back, you will remove all selections from this screen.\n" + 
                        "To confirm this, enter 'Y'.\n" + 
                        "Otherwise, you will remain on this page");

        if (response !== null && response.toUpperCase() === "Y") {
            if (pages === 3) { setPages(2); }
            else { setPages(1); }
        }
    };

    const inputColumn = "pt-3 pb-3 col-12 col-md-10 offset-md-1 col-lg-8 offset-lg-2 col-xl-6 offset-xl-3";

    return (
        <div className="container">
            <div className="m-2 pt-3 ps-3 pe-3 border border-2 border-primary rounded">
                <div className="row">
                    <div className="col-3 col-md-2 col-xl-1">
                        <IconContext.Provider value={{size: "3.5em", color: "white"}}>
                            <Link to="/user/" ><TiArrowBack className="border border-3 rounded-circle p-2 bg-primary float-start"/></Link>
                        </IconContext.Provider>
                    </div>
                    <div className="col-9 col-md-10 col-xl-11">
                        <p className="fs-4 m-2"><strong>Book Reservation</strong></p>
                    </div>                        
                </div>

                <hr/>
                
                <form>
                    {pages === 1 && (
                    <div className="row">
                        <div className={inputColumn}>
                            <div className="row">
                                <label htmlFor="reservation-date" className="col-12 col-sm-2 pt-2 text-sm-start"><strong>Date</strong></label>
                                <div className="col-12 col-sm-10">
                                    <div className="col-4 d-inline-block">
                                        <select
                                            required
                                            name="day"
                                            className="form-select"
                                            value={date[0]}
                                            onChange={(event) => {
                                                setDate([parseInt(event.target.value), date[1], date[2]]);
                                                event.target.blur();
                                            }}
                                            onFocus={(event) => event.target.size = 5}
                                            onBlur={(event) => event.target.size = 1}
                                        >
                                            <option value={-1}>dd</option>
                                            {days.map((day) => {
                                                return <option key={day} value={day}>{day}</option>;
                                            })}
                                        </select>
                                    </div>
                                    <div className="col-4 d-inline-block">
                                        <select
                                            required
                                            name="month"
                                            className="form-select"
                                            value={date[1]}
                                            onChange={(event) => {
                                                setDate([date[0], event.target.value, date[2]]);
                                                event.target.blur();
                                            }}
                                            onFocus={(event) => event.target.size = 5}
                                            onBlur={(event) => event.target.size = 1}
                                        >
                                            <option value={''}>mm</option>
                                            {monthsList.map((month) => {
                                                return <option key={month} value={month}>{month}</option>;
                                            })}
                                        </select>
                                    </div>
                                    <div className="col-4 d-inline-block">
                                        <select
                                            required
                                            name="year"
                                            className="form-select"
                                            value={date[2]}
                                            onChange={(event) => {
                                                setDate([date[0], date[1], parseInt(event.target.value)]);
                                                event.target.blur();
                                            }}
                                        >
                                            <option value={-1}>yyyy</option>
                                            {years.map((year) => {
                                                return <option key={year} value={year}>{year}</option>;
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                            
                        <div className={inputColumn}>
                            <div className="row">
                                <label className="col-8 text-start pt-2"><strong>Group Size </strong></label>
                                <div className="col-4 offset-sm-1 col-sm-3 offset-md-2 col-md-2">
                                    <input
                                        type="number"
                                        className="float-end form-control"
                                        value={numPeople}
                                        onChange={(event) => {
                                            const val = parseInt(event.target.value);
                                            if (val >= 0 && val < 100) 
                                                setNumPeople(val); 
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={inputColumn}>
                            <div className="row">
                                <div className="offset-10 col-2">
                                    <Forward verifyPage={verifyPage1} />
                                </div>
                            </div>
                        </div>
                    </div>
                    )}

                    {pages === 2 && (
                    <div className="pt-3 pb-3 col-12 col-md-10 offset-md-1 offset-lg-0 col-lg-12">
                        <div className="row justify-content-center">
                            {tables.map((table) => {
                                if (table.num === 11)
                                    console.log(annotatedTables[table.num]);

                                return <UserTableSelection 
                                    key={table.num} 
                                    hours={restaurantHoursInMins} 
                                    table={table} 
                                    reservations={annotatedTables[table.num] || []} 
                                    selectTable={selectTable}
                                    selected={table.num === selectedTable[0].num}
                                />
                            })}
                        </div>
                        <div className={inputColumn}>
                            <div className="row">
                                <div className="col-2">
                                    <Backward clearPage={clearPage} />
                                </div>
                                <div className="offset-8 col-2">
                                    <Forward verifyPage={verifyPage2} />
                                </div>
                            </div>
                        </div>
                    </div>
                    )}

                    {pages === 3 && (
                    <div className="pt-3 pb-3 col-12 col-md-10 offset-md-1 offset-lg-0 col-lg-12">
                        <div className="row">
                            <UserTableSelection 
                                hours={restaurantHoursInMins} 
                                table={selectedTable[0]} 
                                reservations={annotatedTables[selectedTable[0].num] || []} 
                                selectTable={() => { return; }}
                                selected={false}
                                selectionPage={true}
                            />
                        </div>

                        <div className={inputColumn}>
                            <div className="row">
                                <HoursForm label={"Reservation Start Time"} time={startTime} setTime={setStartTime}/>
                            </div>
                        </div>
                        <div className={inputColumn}>
                            <div className="row">
                                <HoursForm label={"Reservation End Time"} time={endTime} setTime={setEndTime}/>
                            </div>
                        </div>

                        <div className={inputColumn}>
                            <div className="row">
                                { validateReservationTime() === false && (
                                    <p className="fs-5 text-danger border border-red rounded m-4">
                                        Your Reservation Time Conflicts with Other Reservations. <br />
                                        You must choose a different time.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className={inputColumn}>
                            <div className="row">
                                <div className="col-2">
                                    <Backward clearPage={clearPage} />
                                </div>
                                <Link to="/user/" className="offset-8 col-2">
                                    { startTime[0] !== -1 && startTime[1] !== -1 && startTime[2] !== '' &&
                                      endTime[0] !== -1 && endTime[1] !== -1 && endTime[2] !== '' &&
                                      validateReservationTime() === true && 
                                        <Forward verifyPage={submitReservation} /> 
                                    }
                                </Link>
                            </div>
                        </div>
                    </div>
                    )}
                </form>
            </div>            
        </div>
    );
};

const Forward: React.FC<{ verifyPage: () => void }> = ( { verifyPage } ) => {
    return (
        <IconContext.Provider value={{size: "3.5em", color: "black"}}>
            <MdNavigateNext 
                className="border border-3 rounded-circle p-1 btn btn-primary float-end" 
                onClick={() => verifyPage()}
                cursor="pointer"
            />
        </IconContext.Provider>
    )
}

const Backward: React.FC<{ clearPage: () => void }> = ({ clearPage }) => {
    return (
        <IconContext.Provider value={{ size: "3.7em", color: "black" }}>
            <MdArrowBackIosNew
                className="border border-3 rounded-circle p-3 btn btn-primary float-start"
                onClick={() => clearPage()}
                cursor="pointer"
            />
        </IconContext.Provider>
    )
};