import React, { useState } from "react";
import { Restaurant, Table, validatePassword } from "../models";
import { saveRestaurant } from "../../service/restaurantData";
import { HoursForm } from "./HoursForm";
import { TableEditor } from "./TableEditor";

interface DraftTable {
    table: Table,
    added: boolean,
    rowNum: number,
};

interface Props {
    restaurant: Restaurant | null;
    setRestaurant: React.Dispatch<React.SetStateAction<Restaurant | null>>;
}
export const RestaurantCreate: React.FC<Props> = ({restaurant, setRestaurant}) => {

    const top_bot_padding: string = "mt-4 pb-4 ";

    const [name, setName] = useState<string>('');
    const [location, setLocation ] = useState<string>('');
    const [openTime, setOpenTime] = useState<[number, number, string]>([-1, -1, '']);
    const [closeTime, setCloseTime] = useState<[number, number, string]>([-1, -1, '']);
    const [staffKey, setStaffKey] = useState<string>('');
    const [ownerKey, setOwnerKey] = useState<string>('');
    const [tables, setTables] = useState<DraftTable[]>([]);
    const [numTable, setNumTables] = useState<number>(0);

    const handleNewTable = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();

        if (tables.filter((table) => table.added == false).length != 0) {
            window.alert("Add the previous tables before adding new ones.");
            return;
        }

        const newTables = tables.concat({
            table: {
                num: 1,
                capacity: 1,
            },
            added: false,
            rowNum: tables.length + 1,
        });
        setNumTables(numTable + tables.length);
        setTables(newTables);
    }

    const handleAdd = (num: number, table: Table) => {
        const newTables = tables.map((draftTable) => {
            if (draftTable.rowNum === num) {
                return {
                    table: table,
                    rowNum: num,
                    added: true,
                }
            }
            else {
                return draftTable;
            }
        });
        setNumTables(numTable + tables.length);
        setTables(newTables);
    }

    const handleDel = (num: number) => {
        const newTables = tables.filter((draftTable) => (draftTable.rowNum !== num));
        console.log(newTables)
        const updateIndexTables = newTables.map((draftTables, index) => {
            return { ...draftTables, rowNum: index + 1}
        })
        console.log(updateIndexTables);
        setNumTables(numTable + tables.length);
        setTables(updateIndexTables);
    }

    const handleEdit = (num: number) => {
        const newTables = tables.map((draftTable) => {
            if (draftTable.rowNum === num) {
                return {
                    ...draftTable,
                    added: false,
                };
            }
            else {
                return draftTable;
            }
        });
        setNumTables(numTable + tables.length);
        setTables(newTables);
    }

    const isTimeValid = (time: [number, number, string]): boolean => {
        if (time[0] === -1 || time[1] === -1 || time[2] === '')
            return false;
        
        return true;
    }

    const generateRestaurant = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (name === '' || location === '' || !isTimeValid(openTime) || !isTimeValid(closeTime) || staffKey === '' || 
            ownerKey === '') {
            
            window.alert('Some fields have not been filled. Please fill all the input fields!')
            return;
        }
        
        if (tables.filter((table) => table.added === true).length === 0) {
            window.alert('At least 1 group of tables must be added to set up your restaurant. Please try again.');
            return;
        }

        const staffKeyValidationResult = validatePassword(staffKey);
        if (staffKeyValidationResult[0] === false) {
            window.alert("Staff Access Key Invalid: " + staffKeyValidationResult[1]);
            return;
        }

        const ownerKeyValidationResult = validatePassword(staffKey);
        if (ownerKeyValidationResult[0] === false) {
            window.alert("Staff Access Key Invalid: " + ownerKeyValidationResult[1]);
            return;
        }

        let groupedTables: Table[] = [];
        let capacitiesSeen: number[] = [];
        for (let i = 0; i < tables.length; i++) {
            if (capacitiesSeen.includes(tables[i].table.capacity)) {
                const currTable: Table = tables[i].table;
                groupedTables = groupedTables.map((table) => {
                    if (table.capacity === currTable.capacity) {
                        return { num: table.num + currTable.num, capacity: currTable.capacity};
                    }
                    else {
                        return table;
                    }
                })
            }
            else {
                groupedTables.push(tables[i].table);
                capacitiesSeen.push(tables[i].table.capacity);
            }
        }
        
        const newRestaurant: Restaurant = {
            name: name,
            location: location,
            tables: groupedTables,
            reservations: [],
            hours: {
                open: openTime,
                close: closeTime,
            },
            staffKey: staffKey,
            ownerKey: ownerKey,
        } 

        console.log(newRestaurant);

        let message: [boolean, string] = [true, ''];
        await saveRestaurant(newRestaurant)
            .then((result) => {
                if (!result[0]) {
                    message[0] = false;
                    message[1] = result[1];
                }
            });

        if (!message[0]) {
            window.alert(message[1]);
            return;
        }

        window.alert("New restaurant created!");

        setRestaurant(newRestaurant);
        window.location.href = "/";
    }

    return (
        <div className="ms-4 me-4 mb-3">
            <form className="container" onSubmit={(event) => generateRestaurant(event)}>
                <div className={`row ${top_bot_padding}`}>
                    <label htmlFor="restaurant-name" className="form-label">Name: </label>   
                    <input 
                        required
                        type="text" 
                        placeholder="Enter Restaurant Name"
                        className="form-control"
                        value={name}
                        onChange={(event) => setName(event.target.value)}    
                    /> 
                </div>
                <div className={`row ${top_bot_padding}`}>
                    <label htmlFor="restaurant-name" className="form-label">Location: </label>   
                    <input 
                        required
                        type="text" 
                        placeholder="Enter Restaurant Location"
                        className="form-control"
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}    
                    /> 
                </div>
                <div className={`${top_bot_padding}`}>
                    <HoursForm label="Opening Hours: " time={openTime} setTime={setOpenTime} />
                </div>
                <div className={`${top_bot_padding}`}>
                    <HoursForm label="Closing Hours: " time={closeTime} setTime={setCloseTime} />
                </div>
                <div className={`row ${top_bot_padding}`}>
                    <label htmlFor="restaurant-staff-key" className="form-label">Create Staff Access Key: </label>   
                    <input 
                        required
                        type="text" 
                        placeholder="Enter Staff Access Key"
                        className="form-control"
                        value={staffKey}
                        onChange={(event) => setStaffKey(event.target.value)}    
                    />
                    <p className="form-text">This key will be used by staff to view/manage reservations</p>
                </div>
                <div className={`row ${top_bot_padding}`}>
                    <label htmlFor="restaurant-owner-key" className="form-label">Create Owner Access Key: </label>   
                    <input 
                        required
                        type="text" 
                        placeholder="Enter Owner's Access Key"
                        className="form-control"
                        value={ownerKey}
                        onChange={(event) => setOwnerKey(event.target.value)}    
                    /> 
                    <p className="form-text">Owner's key to edit these restaurant details in the future</p>
                </div>
                <div className={`row ${top_bot_padding}`}>
                    <label htmlFor="restaurant-name" className="form-label">Select <strong>Table Capacity</strong> and <strong>Number of Tables</strong> with Said Capacity: </label>
                    {tables.map((table, index) => {
                        console.log(table.table);
                        return <TableEditor key={numTable + index} num={table.rowNum} table={table.table} added={table.added} handleAdd={handleAdd} handleDel={handleDel} handleEdit={handleEdit}/>
                    })}
                    <button className="btn btn-secondary float-end d-inline-block col-2 col-md-1 offset-10 offset-sm-9 offset-lg-8" onClick={(event) => handleNewTable(event)}>
                        New
                    </button>
                </div>
                <button className="btn btn-success fs-3 p-2">
                    Submit
                </button>
            </form>
        </div>
    )
}