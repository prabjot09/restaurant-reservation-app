import { Reservation } from "../component/models";

const baseURL = "http://localhost:5000/reservations/";

class ReservationData {

    static getReservationByUsername = async (username: string, setUsername: (data: [boolean, string, Reservation[]]) => void): Promise<[boolean, string, Reservation[]]> => {
        let result: [boolean, string, Reservation[]] = [false, '', []];

        const req = new XMLHttpRequest();
        req.addEventListener("load", () => {
            const res: {success: boolean, msg: string, reservations: Reservation[]} = JSON.parse(req.response);
            setUsername([res.success, res.msg, res.reservations]);
        });
        req.open("GET", baseURL + username);
        req.send();

        return result;
    }

    static saveReservation = (reservation: Reservation, restaurantName: string, next: () => void) => {
        const req = new XMLHttpRequest();
        req.addEventListener("load", () => {
            if (req.responseText === "Success") 
                next();
        })
        req.open("POST", baseURL + restaurantName);
        req.setRequestHeader("Content-Type", "application/json");
        req.send(JSON.stringify( { reservation: reservation } ));
    }

    static deleteReservation = (id: string, setRefresh: () => void) => {
        const req = new XMLHttpRequest();
        req.addEventListener("load", () => {
            window.alert("Reservation Successfully Deleted!");
            setRefresh();
        })
        req.open("DELETE", baseURL + id);
        req.send();
    }
}

export default ReservationData;