import { Reservation, Restaurant, Table, dayAsNumeral, compareTimes, timeInMinutes} from "../component/models";

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
};

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

/*
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
*/

const mergeSort = (list: Reservation[], s: number, e: number, compare: (r: Reservation, r2: Reservation) => boolean): void => {
    if (s == e) {
        return;
    }
    const mid: number = parseInt("" + ((s + e) / 2));
    mergeSort(list, s, mid, compare);
    mergeSort(list, mid+1, e, compare);
    
    let p1: number = s;
    let p2: number = mid+1;
    let temp: Reservation[] = [];
    while (p1 < mid+1 && p2 < e+1) {
        if (compare(list[p1], list[p2]) == true)
            temp.push(list[p1++]);
        else 
            temp.push(list[p2++]);
    } 

    while (p1 < mid+1)
        temp.push(list[p1++]);
    while (p2 < e+1)
        temp.push(list[p2++]);
    
    for (let i = s; i <= e; i++) {
        list[i] = temp[i-s];
    }
}


export const loadRestaurantReservationsOrdered = (restaurantName: string, callback: (reservations: Reservation[]) => void) => {
    const req = new XMLHttpRequest();
    req.addEventListener("load", () => {
        if (req.responseText === "") 
            return;
        
        let reservations: Reservation[] = JSON.parse(req.response);
        mergeSort(reservations, 0, reservations.length-1, (r1: Reservation, r2: Reservation): boolean => {
            const t1: [number, number, string] = [r1.time.hour, r1.time.minute, r1.time.time];
            const t2: [number, number, string] = [r2.time.hour, r2.time.minute, r2.time.time];
            return (timeInMinutes(t1) <= timeInMinutes(t2));
        });
        mergeSort(reservations, 0, reservations.length-1, (r1: Reservation, r2: Reservation): boolean => {
            const d1: [number, number, number] = [r1.date.day, r1.date.month, r1.date.year];
            const d2: [number, number, number] = [r2.date.day, r2.date.month, r2.date.year];
            return (dayAsNumeral(d1) <= dayAsNumeral(d2));
        });
        console.log(reservations);
        callback(reservations);
    });

    req.open("GET", baseURL + "reservations/" + restaurantName, false);
    req.send();
};

export const loadTodayReservations = async (restaurantName: string): Promise<Reservation[]> => {
    
    let reservations: Reservation[] = []; 

    const req = new XMLHttpRequest();
    req.addEventListener("load", () => {
        reservations = JSON.parse(req.response);
        mergeSort(reservations, 0, reservations.length-1, (r1: Reservation, r2: Reservation): boolean => {
            const t1: [number, number, string] = [r1.time.hour, r1.time.minute, r1.time.time];
            const t2: [number, number, string] = [r2.time.hour, r2.time.minute, r2.time.time];
            return (timeInMinutes(t1) <= timeInMinutes(t2));
        });
    });
    req.open("GET", baseURL + "reservations/" + restaurantName + "/today", false);
    req.send();
 
    return reservations;
};

 