import React from "react";
import { UserIF } from "../component/models"

interface ResponseIF extends UserIF {
    _id: string;
}

let baseURL = "http://localhost:5000/users/";

export class UserDataReq {

    static async getUser(username: String, callback: (req: XMLHttpRequest, successMsg: [boolean, string]) => void, reqObj: XMLHttpRequest): Promise<[boolean, string]> {
        const msg: [boolean, string] = [true, ""];
        await reqObj.addEventListener("load", () => callback(reqObj, msg));
        await reqObj.open("GET", baseURL + "userlist/" + username);
        await reqObj.send();
        return msg;
    }

    static async loginUser(user: UserIF, setUser: React.Dispatch<React.SetStateAction<UserIF | null>>): Promise<void> {
        const loginCallback = (reqObj: XMLHttpRequest) => {
            if (reqObj.response === "") {
                window.alert('Username is not found.');
                return;
            }

            const userResponse = JSON.parse(reqObj.response);
            const userFound: UserIF = {
                username: (userResponse as ResponseIF).username,
                password: (userResponse as ResponseIF).password,
            }
    
            if (userFound.password != user.password) {
                window.alert('Provided password does not match the user.');
                return;
            }

            setUser(userFound);
        };

        const reqObj = await new XMLHttpRequest();
        await this.getUser(user.username, loginCallback, reqObj);

        // reqObj.addEventListener("load", () => {
        //     if (reqObj.response == "") {
        //         window.alert('Username is not found.');
        //         return;
        //     }

        //     const userResponse = JSON.parse(reqObj.response);
        //     const userFound: UserIF = {
        //         username: (userResponse as ResponseIF).username,
        //         password: (userResponse as ResponseIF).password,
        //     }
    
        //     if (userFound.password != user.password) {
        //         window.alert('Provided password does not match the user.');
        //         return;
        //     }

        //     setUser(userFound);
        // });

        // reqObj.open("GET", baseURL + "userlist/" + user.username);
        // reqObj.send();
    }

    static registerUser(user: UserIF): void {
        const userReq = new XMLHttpRequest();
        userReq.addEventListener("load", () => {
            window.alert('Account has been created');
        });
        userReq.open("POST", baseURL + "register");
        userReq.setRequestHeader('Content-type', 'application/json');
        userReq.send(JSON.stringify(user));
    }

}