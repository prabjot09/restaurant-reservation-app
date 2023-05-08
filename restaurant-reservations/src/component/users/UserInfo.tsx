import React from "react";
import { setSourceMapRange } from "typescript";
import { UserIF } from "../models";

interface Props {
    user: UserIF | null;
    setUser: (user: UserIF) => void;
    submit: () => void;
    submitName?: string;
}

export const UserInfo: React.FC<Props> = (props: Props) => {
    return (
        <form className="p-3" onSubmit={(event) => {
                event.preventDefault();
                props.submit();
            }}>
            <div>
                <label htmlFor="username" className="form-label float-start"><strong>Username:</strong></label>
                <input 
                    required
                    className="form-control mb-2" 
                    type="text" 
                    value={props.user != null ? props.user.username : ""}
                    onChange={ (event) =>  { 
                        props.setUser(props.user != null ? (
                            { ...props.user, username: event.target.value}
                        ) : (
                            {username: event.target.value, password: ""}
                        )) 
                    } }
                />
            </div>
            
            <div>
                <label htmlFor="password" className="form-label float-start"><strong>Password:</strong></label>
                <input 
                    required
                    className="form-control mb-2" 
                    type="text" 
                    value={props.user != null ? props.user.password : ""}
                    onChange={ (event) =>  { 
                        props.setUser(props.user != null ? (
                            { ...props.user, password: event.target.value}
                        ) : (
                            {password: event.target.value, username: ""}
                        )) 
                    } }
                />
            </div>

            <button type='submit' className="btn btn-primary mt-3">
                { props.submitName != undefined && props.submitName }
            </button>
        </form>
    )
}