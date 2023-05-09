import React from "react";
import { Link } from "react-router-dom";

interface Props {
    restaurantName: string;
}

const TimeLayout: React.FC<Props> = ({ restaurantName }) => {
    return (
        <div>
            <Link 
                to="/staff/" 
                state={{ restaurantName: restaurantName }}
                className="btn btn-primary">

                <div>Back</div> 
            </Link>
            <p>Time Layout</p>
        </div>
    )
}

export default TimeLayout;