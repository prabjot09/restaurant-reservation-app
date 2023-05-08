import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Restaurant } from "../component/models";

interface Props {
    restaurantCreated: Restaurant | null;
}

export const Entry: React.FC<Props> = ({ restaurantCreated }) => {
    return (
        <div className="container">
            {restaurantCreated !== null ? (
                <div className="row p-3">
                    <div id="user" className="col-md-6 mt-3">
                        <label htmlFor="user" className="me-3">Are you a client?</label>
                        <Link to={"/user/"} className="btn btn-primary">User</Link>
                    </div>
                    <div id="staff" className="col-md-6 mt-3">
                        <label htmlFor="staff" className="me-3">Are you a staff?</label>
                        <Link to={"/staff"} state={{ restaurantName:  restaurantCreated.name }} className="btn btn-secondary">Staff</Link>
                    </div>
                </div>
            ) : (
                <div>
                    <h3 className='m-4 ps-4 pe-4'>
                    This page does not have a restaurant set up yet. <br/><br/> 
                    Click 'Build' if you would like to upload your restaurant to this reservation application.
                    </h3>
                    <Link to="/restaurant_creation" className='btn btn-success'>
                    <p style={{'fontSize': '25px'}} className='mb-1'>Build</p>
                    </Link>
                </div>
            )}
            
            <Outlet />
        </div>
    )
};