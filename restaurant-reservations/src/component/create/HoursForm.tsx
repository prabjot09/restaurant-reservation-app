import React from "react";

type Time = [number, number, string];

interface Props {
    label: string;
    time: Time;
    setTime: React.Dispatch<React.SetStateAction<Time>>;
}

export const HoursForm: React.FC<Props> = ({label, time, setTime}) => {

    const hours: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const minutes: number[] = [0, 15, 30, 45];
    const am_pm: string[] = ['AM', 'PM'];

    return (
        <div className="row">
            <label htmlFor="restaurant-name" className="form-label">{`${label} `}</label> 
            <div className="col-xl-2 offset-xl-3 col-sm-3 offset-sm-2 col-4 offset-2 p-1">
                <select 
                    required 
                    name="hour" 
                    className="form-select"
                    value={time[0]}
                    onChange={ (event) => setTime( [parseInt(event.target.value, 10), time[1], time[2]] ) }
                >
                    <option value={-1} key={-1}>hh</option>
                    { hours.map((hour, index) => {
                        return <option key={index} value={hour}>{hour}</option>
                    })}
                </select> 
            </div>  
                
            <div className="col-xl-2 col-sm-3 col-4 p-1">
                <select 
                    required 
                    name="minutes" 
                    className="form-select"
                    placeholder="m"
                    value={time[1]}
                    onChange={ (event) => setTime( [time[0], parseInt(event.target.value, 10), time[2]] ) }
                >
                    <option value={-1} key={-1}>mm</option>
                    { minutes.map((minute, index) => {
                        return <option key={index} value={minute}>{minute}</option>
                    })}
                </select>
            </div>
            
            <div className="col-xl-2 col-sm-3 offset-sm-0 col-4 offset-4 p-1">
                <select 
                    required 
                    name="am_pm" 
                    className="form-select"
                    placeholder="AM/PM"
                    value={time[2]}
                    onChange={ (event) => setTime( [time[0], time[1], event.target.value] ) }
                >
                    <option value={''} key={-1}></option>
                    { am_pm.map((time, index) => {
                        return <option key={index} value={time}>{time}</option>
                    })}
                </select> 
            </div>
        </div>
    )
}