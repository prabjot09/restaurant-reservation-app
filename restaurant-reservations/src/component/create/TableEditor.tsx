import React, { useState } from "react";
import { Table } from '../models';

interface Props {
    num: number;
    table: Table;
    added: boolean;
    handleAdd: (num: number, table: Table) => void;
    handleDel: (num: number) => void;
    handleEdit: (num: number) => void;
}

export const TableEditor: React.FC<Props> = ({ num, table, added, handleDel, handleAdd, handleEdit }) => {

    const [tableNum, setTableNum] = useState<number>(table.num);
    const [newCapacity, setNewCapacity] = useState<number>(table.capacity);

    const handleNumberChange = (event: React.ChangeEvent<HTMLInputElement>, state: [number, React.Dispatch<React.SetStateAction<number>>]) => {
        if (event.target.value === "") {
            state[1](0);
            return;
        }

        const prev: number = state[0];
        try {
            const curr: number = parseInt(event.target.value, 10);
            state[1](curr < 100 ? curr : prev );
        } 
        catch (e) {
            state[1](prev);
        }      
    };

    return (
        <div className={"row m-sm-1 pe-0 pt-2 pb-2 me-0 ms-0"}>
            <div className={`row p-3 col-12 offset-sm-1 col-sm-10 offset-md-2 col-md-8 offset-lg-3 col-lg-6 border ${added ? "border-success border-4 bg-opacity-10" : "border-secondary border-2 bg-opacity-25"} rounded bg-dark`}>
                <label className="form-label col-3 p-2 col-sm-2 text-end" htmlFor="table-quantity">Number: </label>
                <div className="col-3 col-sm-3 col-md-2">
                    {added ? (
                        <p className="pt-2">{tableNum}</p>
                    ) : (
                        <input 
                            required
                            name="table-quantity"
                            type="text"
                            className="form-control text-end"
                            placeholder="0"
                            value={`${tableNum}`}
                            onChange={(event) => handleNumberChange(event, [tableNum, setTableNum])}
                        />  

                    )}                    
                </div>
                <label className="form-label col-3 p-2 col-sm-2 offset-md-1 text-end" htmlFor="table-capacity">Capacity: </label>
                <div className="col-3 col-sm-3 col-md-2">
                    {added ? (
                        <p className="pt-2">{newCapacity}</p>
                    ) : (
                        <input 
                            required
                            name="table-capacity"
                            type="text"
                            className="form-control text-end"
                            placeholder="0"
                            value={`${newCapacity}`}
                            onChange={(event) => handleNumberChange(event, [newCapacity, setNewCapacity])}
                        />  

                    )}  
                </div>
                <div className="offset-4 col-4 offset-sm-0 col-sm-2 offset-md-1 col-md-2">
                    <div className="d-block">
                        {!added ? (
                            <button className="btn btn-primary fs-6" onClick={(event) => {
                                event.preventDefault();
                                handleAdd(num, { num: tableNum, capacity: newCapacity } );
                            }}>
                                Add
                            </button>
                        ): (
                            <button className="btn btn-primary fs-6" onClick={(event) => {
                                event.preventDefault();
                                handleEdit(num);
                            }}>
                                Edit
                            </button>
                        )}
                        <button className="btn btn-primary fs-6" onClick={(event) => {
                            event.preventDefault();
                            handleDel(num);
                        }}>
                            Del
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}