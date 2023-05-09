import React from "react";
import { Link } from "react-router-dom";

interface Props {
    restaurantName: string;
}

const TableLayout: React.FC<Props> = ({ restaurantName }) => {
    console.log("Table Created");
    return (
        <div>
            <Link 
                to="/staff/" 
                state={{ restaurantName: restaurantName }}
                className="btn btn-primary">

                <div>Back</div> 
            </Link>
            <p>Table Layout</p>
        </div>
    )
}

export default TableLayout;