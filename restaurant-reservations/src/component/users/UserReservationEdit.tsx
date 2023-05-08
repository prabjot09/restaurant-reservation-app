import React from "react";
import { useSearchParams, Link } from "react-router-dom";

interface Props {
    username: string;
}

export const UserReservationEdit: React.FC<Props> = ({ username }) => {

    let [searchParams] = useSearchParams();

    return (
        <div>
            {username}, 
            {searchParams.get("id")}
            <Link to="/user/" >Back</Link>
        </div>
    );
};