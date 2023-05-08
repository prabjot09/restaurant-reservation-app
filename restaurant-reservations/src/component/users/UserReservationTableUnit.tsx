import React from "react";
import { SEAT } from "../models"; 

interface Props {
    divisions: SEAT[];
}

export const UserReservationTableUnit: React.FC<Props> = ({ divisions }) => {
    const cols: number[] = [0, 1, 2, 3];

    const seatToColor = (col: number) => {
        if ( divisions[col] === SEAT.AVAILABLE ) 
            return "bg-primary text-primary ";
        else if (divisions[col] === SEAT.RESERVED )
            return "bg-warning text-warning ";
        
        return "bg-secondary text-secondary";        
    }

    return (
        <div className="d-flex flex-row" style={{height: "100%"}}>
            {cols.map((col) => {
                return <div className={`border-start border-light ${seatToColor(col)}`} style={{ flexBasis: "25%" }} key={col}></div>;
            })}

        </div>
    )
} 