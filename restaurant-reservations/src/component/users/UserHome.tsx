import React, {useState} from "react";
import { Routes, Route, Link } from "react-router-dom";
import { UserIF } from "../models";
import { UserReservations } from "./UserReservations";
import { UserLogin } from "./UserLogin";
import { UserReservationNew } from "./UserReservationNew";
import { UserReservationEdit } from "./UserReservationEdit";

interface Props {
    user: UserIF | null;
    setUser: React.Dispatch<React.SetStateAction<UserIF | null>>;
    restaurantName: string;
}

export const UserHome: React.FC<Props> = (props) => {

    const logout = () => {
        props.setUser(null);
    }

    return (
        <div className="container">
            {props.user != null && 
                <div className="ms-4 me-4 mt-2 mb-4 p-3">
                        <p className="float-start fs-sm-5 fs-5">
                            <strong>User</strong>: {props.user.username}  
                        </p>
                        <div className="float-end">
                            <Link className="btn btn-primary pt-1 pb-1 ps-2 pe-2 float-end fs-sm-5 fs-5" onClick={logout} to="/user">
                                Log Out
                            </Link>
                        </div>
                        <span className="opacity-0 col-3">P</span>
                </div>
            }
            
            <Routes>
                {props.user === null ? (
                    <Route 
                        index 
                        element={<UserLogin user={props.user} setUser={props.setUser} />}
                    />
                ) : (
                    <Route>
                        <Route index element={<UserReservations username={props.user.username} />} />
                        <Route path="create_reservation/" element={<UserReservationNew username={props.user.username} restaurantName={props.restaurantName}/>} />
                        <Route path="edit_reservation/" element={<UserReservationEdit username={props.user.username} />} />
                    </Route>
                )}
            </Routes>
        </div>
        
    )
}