import { Reservation, Restaurant, Table, dayAsNumeral, compareTimes} from "../component/models";

let baseURL = "http://localhost:5000/restaurants/";

export const saveRestaurant = async (restaurant: Restaurant): Promise<[boolean, string]> => {
    let result: [boolean, string] = [true, ''];

    const req = new XMLHttpRequest();
    req.addEventListener("load", () => {
        if (req.responseText !== "Success") {
            result = [false, req.responseText];
        }
    });
    req.open("POST", baseURL);
    req.setRequestHeader("Content-Type", "application/json");
    await req.send(JSON.stringify({restaurant: restaurant}));

    return result;
}

export const getRestaurant = async () : Promise<[boolean, Restaurant | null]> => {
    let result: [boolean, Restaurant | null] = [false, null];

    const req = new XMLHttpRequest();
    req.addEventListener("load", () => {
        const response: {hasRestaurant: boolean, restaurant: Restaurant | null} = JSON.parse(req.response);
        result[0] = response.hasRestaurant;
        result[1] = response.restaurant;
        console.log(response)
    });
    req.open("GET", baseURL, false);
    req.send();

    return result;
}

export const loadRestaurant = async (restaurantName: string) => {
    let restaurant: Restaurant = { name: '', location: '', tables: [], hours: {open: [-1,-1,''], close: [-1,-1,'']}, staffKey: '', ownerKey: '', reservations: [] }; 

    const req = new XMLHttpRequest();
    req.addEventListener("load", () => {
        restaurant = JSON.parse(req.response).restaurant;
    });
    req.open("GET", baseURL + restaurantName, false);
    req.send();

    return restaurant;
}

export const loadRestaurantHours = async (restaurantName: string) => {
    let hours: { open: [number, number, string], close: [number, number, string]} = {open: [-1, -1, ''], close: [-1, -1, '']}; 

    const req = new XMLHttpRequest();
    req.addEventListener("load", () => {
        if (req.responseText !== "") 
            hours = JSON.parse(req.response);
    });
    req.open("GET", baseURL + "hours/" + restaurantName, false);
    req.send();

    return hours;
}

export const loadRestaurantTables = async (restaurantName: string) => {
    let tables: Table[] = [];

    await loadRestaurant(restaurantName)
        .then((restaurant: Restaurant) => {
            tables = restaurant.tables;
        });

    return tables;
};

export const loadRestaurantReservations = (restaurantName: string) => {
    let reservations: Reservation[] = []; 

    const req = new XMLHttpRequest();
    req.addEventListener("load", () => {
        if (req.responseText !== "") 
            reservations = JSON.parse(req.response);
    });
    req.open("GET", baseURL + "reservations/" + restaurantName, false);
    req.send();

    return reservations;
};

export const loadStaffAccessKey = (restaurantName: string, inputKey: string, callback: (accessKey: string) => void) => {
    const req = new XMLHttpRequest();
    req.addEventListener("load", () => {
        if (req.responseText.slice(0, 5) === "Error") {
            console.log("Specified restaurant was not found for staff access key request");
            return;
        }
            
        callback(JSON.parse(req.response).accessKey);
    });
    req.open("GET", baseURL + "staff_key/" + restaurantName, false);
    req.send();
}

const convertTimeToTuple = (resTime: {hour: number, minute: number, time: string}): [number, number, string] => {
    return [resTime.hour, resTime.minute, resTime.time];
}

const sortReservationsByTime = (resArr: Reservation[]): void => {
    for (let i = 0; i < resArr.length - 1; i++) {
        let earliest = i;

        for (let j = i+1; j < resArr.length; j++) {
            const timeEarliest = convertTimeToTuple(resArr[earliest].time);
            const timeCurr = convertTimeToTuple(resArr[j].time);
            if (compareTimes(timeEarliest, timeCurr) < 0) {
                earliest = j;
            }
        }

        const temp = resArr[i];
        resArr[i] = resArr[earliest];
        resArr[earliest] = temp;
    }
}

export const loadRestaurantReservationsOrdered = (restaurantName: string, callback: (reservations: Reservation[][]) => void) => {
    const req = new XMLHttpRequest();
    req.addEventListener("load", () => {
        if (req.responseText === "") 
            return;
        
        const reservations: Reservation[] = JSON.parse(req.response);

        const nowDate = new Date(Date.now());
        const today = dayAsNumeral([nowDate.getDate(), nowDate.getMonth() + 1, nowDate.getFullYear()]);
        let orderedReservations: Reservation[][] = [];

        for (let i = 0; i < reservations.length; i++) {
            const resDate = reservations[i].date;
            const reservationDate = dayAsNumeral([resDate.day, resDate.month, resDate.year]);
            console.log(today, reservationDate);
            let dateDifference = reservationDate%1000 - today%1000;
            dateDifference += (parseInt("" + reservationDate/1000) !== parseInt("" + today/1000)) ? (
                (nowDate.getFullYear()%400 === 0 || (nowDate.getFullYear()%4 === 0 && nowDate.getFullYear()%100 !== 0) ) ? 365 : 364
            ) : 0;

            if (orderedReservations[dateDifference] === undefined)
                orderedReservations[dateDifference] = [];
            
            orderedReservations[dateDifference].push(reservations[i]);
        }

        console.log(orderedReservations);

        for (let i = 0; i < orderedReservations.length; i++) {
            sortReservationsByTime(orderedReservations[i]);
        }

        callback(orderedReservations);
    });

    req.open("GET", baseURL + "reservations/" + restaurantName, false);
    req.send();
};

 