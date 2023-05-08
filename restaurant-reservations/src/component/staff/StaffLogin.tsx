import React, { useState } from "react";
import { loadStaffAccessKey } from "../../service/restaurantData";

interface Props {
    restaurantName: string;
    setIsStaff: React.Dispatch<React.SetStateAction<boolean>>;
}

export const StaffLogin: React.FC<Props> = ({ restaurantName, setIsStaff }) => {

    const [staffKey, setStaffKey] = useState<string>("");
    const [errorCode, setErrorCode] = useState<number>(0);

    const loginStaffMember = (event: React.FormEvent) => {
        event.preventDefault();
        
        if (staffKey === "") {
            setErrorCode(1);
            return;
        }

        loadStaffAccessKey(restaurantName, staffKey, (accessKey: string) => {
            if (staffKey !== accessKey) {
                setErrorCode(2);
                return;
            }

            setIsStaff(true);
        })
    }

    return (
        <form onSubmit={(event) => loginStaffMember(event)}>
            <div className="mt-3 mb-3 p-2">
                <div className="row p-2">
                    <div className="col-6">
                        <label className="form-label float-end p-2">Staff Access Key: </label>
                    </div>
                    <div className="col-5 col-md-4 col-lg-3">
                        <input 
                            required 
                            type={"text"} 
                            className="form-control"
                            value={staffKey}
                            onChange={(event) => setStaffKey(event.target.value)}
                        />
                    </div>
                </div>
                <div className="row p-2">
                    <button type='submit' className="btn btn-primary col-4 offset-4 col-sm-2 offset-sm-5 justify-content-around">
                        Login
                    </button>
                </div>
            </div>
            
            <div className="mt-3 mb-3 p-2">
                {errorCode !== 0 && (
                    <div className="row">
                        <p className="fs-4">
                            {errorCode === 1 ? 
                                "You must enter an access key before logging in." : 
                                "The provided access key is incorrect."
                            }
                        </p>
                    </div>
                )}
            </div>
            
        </form>
    )
}