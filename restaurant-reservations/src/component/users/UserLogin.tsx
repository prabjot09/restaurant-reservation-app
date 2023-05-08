import React from "react";
import { UserInfo } from "./UserInfo";
import { UserIF, validatePassword } from "../models";
import { useState } from "react";
import { UserDataReq } from "../../service/userData";

interface Props {
    user: UserIF | null;
    setUser: React.Dispatch<React.SetStateAction<UserIF | null>>
}

export const UserLogin: React.FC<Props> = (props) => {

    const [registeringUser, setRegisteringUser] = useState<UserIF | null>(null);
    const [loggingInUser, setLoggingInUser] = useState<UserIF | null>(null);

    const handleRegisterChange = (user: UserIF) => {
        setRegisteringUser(user);
        setLoggingInUser(null);
    }

    const handleLogInChange = (user: UserIF) => {
        setRegisteringUser(null);
        setLoggingInUser(user);
    }

    const register = async (): Promise<void> => {
        if (! validateInput(registeringUser)) 
            return;
        
        const newUser = registeringUser as UserIF;

        const validationResult: [boolean, string] = [true, ""];
        await validateUser(newUser)
            .then((result) => {
                if (! result[0]) {
                    validationResult[0] = false;
                    validationResult[1] = result[1];
                }
            });
        
        if (validationResult[0] === false) {
            window.alert(validationResult[1]);
            return;
        }
    
        UserDataReq.registerUser(newUser);
        props.setUser(newUser);   
    }

    const validateInput = (user: UserIF | null): boolean =>  {
        if (user == null || user.username == "" || user.password == "") {
            window.alert("Username and Password have not been properly filled out.\n" + 
                "Please retry after filling in all required fields!");
            return false;
        }
        
        return true;
    }

    const validateUser = async (user: UserIF): Promise<[boolean, string]> => {
        let users: UserIF[] = [];
        for (let i = 0; i < users.length; i++) {
           
        }
        
        const req: XMLHttpRequest = await new XMLHttpRequest();
        const duplicateUserCallback = (req: XMLHttpRequest, msg: [boolean, string]) => {
            if (req.response != "") {
                msg[0] = false;
                msg[1] = "Username is already taken.";
            }
        }
        
        const duplicateUserResult = [true, ""];
        await UserDataReq.getUser(user.username, duplicateUserCallback, req)
            .then((result) => {
                if (result[0] === true)
                    return;

                duplicateUserResult[0] = false;
                duplicateUserResult[1] = result[1];
            });

        if (duplicateUserResult[0] === false) {
            return [false, "Username is already taken."];
        }

        return validatePassword(user.password);

        // if (user.password.length < 8)
        //     return [false, "Password must contain more than 8 characters"];

        
        // let uppercase: boolean = false;
        // let lowercase: boolean = false;
        // let num: boolean = false;
 
        // for (let i = 0; i < user.password.length; i++) {
        //     let currChar = user.password.charAt(i);
        //     uppercase = uppercase || ('A' <= currChar && currChar <= 'Z');
        //     lowercase = lowercase || ('a' <= currChar && currChar <= 'z');
        //     num = num || ('0' <= currChar && currChar <= '9');
        // }

        // if (! (uppercase && lowercase && num)) {
        //     return [false, "Username and passwords must contain at least 1 lowercase, 1 uppercase and 1 numeical character."]
        // }


        // return [true, "Username and password are vaild."];
    }

    const saveUser = (user: UserIF): void => {

    }

    const login = () => {
        if (! validateInput(loggingInUser)) 
            return;

        let userCertain: UserIF = loggingInUser as UserIF;
        UserDataReq.loginUser(userCertain, props.setUser);
    }

    return (
        <div>
            <div className="row p-3">
                <div className="col-sm-6 mt-2">
                    <h4>Register ?</h4>
                    <div className={`m-auto card ${window.innerWidth <= 900 ? "w-75" : "w-50"}`}>
                        <UserInfo
                            user={registeringUser} 
                            setUser={handleRegisterChange}
                            submit={register}
                            submitName="Register"
                        />
                    </div>
                </div>
                <div className="col-sm-6 mt-2">
                    <h4>Log In ?</h4>
                    <div className={`m-auto card ${window.innerWidth <= 900 ? "w-75" : "w-50"}`}>
                        <UserInfo 
                            user={loggingInUser} 
                            setUser={handleLogInChange}
                            submit={login}
                            submitName="Log In"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};