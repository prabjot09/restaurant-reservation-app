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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const baseURL = "http://localhost:5000/reservations/";
class ReservationData {
}
_a = ReservationData;
ReservationData.getReservationByUsername = (username, setUsername) => __awaiter(void 0, void 0, void 0, function* () {
    let result = [false, '', []];
    const req = new XMLHttpRequest();
    req.addEventListener("load", () => {
        const res = JSON.parse(req.response);
        setUsername([res.success, res.msg, res.reservations]);
    });
    req.open("GET", baseURL + username);
    req.send();
    return result;
});
ReservationData.saveReservation = (reservation, restaurantName, next) => {
    const req = new XMLHttpRequest();
    req.addEventListener("load", () => {
        if (req.responseText === "Success")
            next();
    });
    req.open("POST", baseURL + restaurantName);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify({ reservation: reservation }));
};
ReservationData.deleteReservation = (id, setRefresh) => {
    const req = new XMLHttpRequest();
    req.addEventListener("load", () => {
        window.alert("Reservation Successfully Deleted!");
        setRefresh();
    });
    req.open("DELETE", baseURL + id);
    req.send();
};
exports.default = ReservationData;
