export interface UserIF {
    username: string;
    password: string;
}

type hour = number;
type minute = number;
type day = number;
type month = number
type year = number;

type time = [hour, minute, string];
type date = [day, month, year]

export interface Restaurant {
    name: string;
    location: string;
    tables: Table[];
    reservations: Reservation[],
    hours: {
        open: time;
        close: time;
    };
    staffKey: string;
    ownerKey: string;
}

export interface Table {
    num: number;
    capacity: number;
    reserved?: boolean;
    availableAt?: time;
    _id?: string;
}

export interface Reservation {
    groupName: String;
    restaurantName: String;
    table: Table;
    persons: number;
    date: { day: number, month: number, year: number};
    time: { hour: number, minute: number, time: string};
    duration: { hours: number, minutes: number};
    status: STATUS;
    _id?: string;
};

export enum STATUS {
    UPCOMING, 
    LATE,
    ARRIVED,
    PAID
}

export enum SEAT {
    CLOSED,
    RESERVED,
    AVAILABLE
}


type message = string;

export const validatePassword = (password: string): [boolean, message] => {
    if (password.length < 8)
            return [false, "Password must contain more than 8 characters"];

        
        let uppercase: boolean = false;
        let lowercase: boolean = false;
        let num: boolean = false;
 
        for (let i = 0; i < password.length; i++) {
            let currChar = password.charAt(i);
            uppercase = uppercase || ('A' <= currChar && currChar <= 'Z');
            lowercase = lowercase || ('a' <= currChar && currChar <= 'z');
            num = num || ('0' <= currChar && currChar <= '9');
        }

        if (! (uppercase && lowercase && num)) {
            return [false, "Username and passwords must contain at least 1 lowercase, 1 uppercase and 1 numeical character."]
        }

        return [true, "Username and password are vaild."];
}

export const timeInMinutes = (time: time): number => {
    return (
        time[1] 
        + (time[2] === 'PM' ? 12*60 : 0)  
        + (time[0] === 12  ? 0: time[0]*60)
    );  
} 

export const dayAsNumeral = (date: date): number => {
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const currYear = date[2]; 
    if (currYear%400 == 0 || (currYear%4 == 0 && currYear%100 != 0)) {
        daysInMonth[1]++;
    }

    let daysToNow = 0;
    for (let i = 0; i < date[1]-1; i++) {
        daysToNow += daysInMonth[i];
    }
    daysToNow += date[0];

    return ( 
        daysToNow
        + date[2]*1000
    );
}

export const compareTimes = (time1: time, time2: time): number => {
    const time1_minutes = timeInMinutes(time1);
    const time2_minutes = timeInMinutes(time2);
    
    if (time1_minutes < time2_minutes)
        return -1;
    else if (time1_minutes > time2_minutes)
        return 1;
    else 
        return 0;
}