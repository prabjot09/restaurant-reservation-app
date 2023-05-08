"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDataReq = void 0;
let baseURL = "http://localhost:5000/users/";
class UserDataReq {
    static getUser(username, callback, reqObj) {
        return __awaiter(this, void 0, void 0, function* () {
            const msg = [true, ""];
            yield reqObj.addEventListener("load", () => callback(reqObj, msg));
            yield reqObj.open("GET", baseURL + "userlist/" + username);
            yield reqObj.send();
            return msg;
        });
    }
    static loginUser(user, setUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginCallback = (reqObj) => {
                if (reqObj.response === "") {
                    window.alert('Username is not found.');
                    return;
                }
                const userResponse = JSON.parse(reqObj.response);
                const userFound = {
                    username: userResponse.username,
                    password: userResponse.password,
                };
                if (userFound.password != user.password) {
                    window.alert('Provided password does not match the user.');
                    return;
                }
                setUser(userFound);
            };
            const reqObj = yield new XMLHttpRequest();
            yield this.getUser(user.username, loginCallback, reqObj);
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
        });
    }
    static registerUser(user) {
        const userReq = new XMLHttpRequest();
        userReq.addEventListener("load", () => {
            window.alert('Account has been created');
        });
        userReq.open("POST", baseURL + "register");
        userReq.setRequestHeader('Content-type', 'application/json');
        userReq.send(JSON.stringify(user));
    }
}
exports.UserDataReq = UserDataReq;
