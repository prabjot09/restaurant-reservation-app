import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { StaffLogin } from "./StaffLogin";
import { StaffOverview } from "./StaffOverview";
import TableLayout from "./TableLayout";
import TimeLayout from "./TimeLayout";

interface Props {
    isStaff: boolean;
    setIsStaff: React.Dispatch<React.SetStateAction<boolean>>;
}

export const StaffBase: React.FC<Props> = ( { isStaff, setIsStaff } ) => {

    const location = useLocation();
    console.log(location.state);
    const { restaurantName } = (location.state as { restaurantName: string });

    return (
        <div>
            <div className="bg-primary p-1">
                <h3 className="text-light"> <strong> STAFF ONLY </strong> </h3>
            </div>
            <div className="container">
                <Routes>
                    { !isStaff ? (
                        <Route index element={<StaffLogin setIsStaff={setIsStaff} restaurantName={restaurantName} />} />
                    ) : (
                        <Route>
                            <Route index element={<StaffOverview restaurantName={restaurantName}/>} />
                            <Route path="tables/" element={<TableLayout restaurantName={restaurantName}/>} />
                            <Route path="reservations/" element={<TimeLayout restaurantName={restaurantName}/>} />
                        </Route>
                    )}
                </Routes>
            </div>
        </div>
    );
}