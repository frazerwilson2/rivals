import React, {useEffect} from 'react';
import {League} from './types/gameData';
type Calendar = {
    [day:string]: {planned: string[], logged: string[]}
}

const CalendarComp = ({data}:{data:{[key:string]:League}}) => {
    // console.log(data);
    const calendarData:Calendar = {
        Sunday: {planned: [], logged: []},
        Monday: {planned: [], logged: []},
        Tuesday: {planned: [], logged: []},
        Wednesday: {planned: [], logged: []},
        Thursday: {planned: [], logged: []},
        Friday: {planned: [], logged: []},
        Saturday: {planned: [], logged: []}
    }

    const d = new Date().getDay();
    const today = Object.keys(calendarData)[d];
    
    const findDayType = (day:string) => {
        if(day === today) {
            return `today ${new Date().getHours() > 19 ? 'gone' : 'coming'}`;
        }
        const dayIndex = Object.keys(calendarData).indexOf(day);
        return dayIndex < d ? 'gone' : 'coming';   
    }

    const goneOrComing = (resetDay:string, day:string) => {
        // build arr of days between reset and today
        const daysArr = Object.keys(calendarData);
        const addAnotherDay = (buildDays:string[], dayIndex:number):string[] =>{
            if(dayIndex === d){
                return buildDays;
            }
            if(dayIndex >= 6){
                dayIndex = 0;
            }else {
                dayIndex = dayIndex + 1;
            }
            buildDays.push(daysArr[dayIndex]);
            return addAnotherDay(buildDays, dayIndex);
        }
        const daysBetweenResetAndToday = addAnotherDay([resetDay], Object.keys(calendarData).indexOf(resetDay));
        return daysBetweenResetAndToday.includes(day);
    }

    const wrapNum = (num:number) => {
        return Math.round((num * 100)) / 100;
    }

    Object.keys(data).forEach((lg:string) => {
        const league = data[lg];
        league.competitors.forEach((competitor:any) => {
            const planList = Object.keys(competitor.planned_days);
            if(planList.length){
                planList.forEach(day => {
                    if(!goneOrComing(competitor.reset_day, day)){
                        calendarData[day].planned.push(
                            `${league.name.substring(league.name.length - 1)}: ${competitor.name} plans ${wrapNum(competitor.planned_days[day])}`
                        );
                    }
                })
            }

            const logList = Object.keys(competitor.logged_days);
            
            if(logList.length){
                logList.forEach(tday => {
                    const [, day] = tday.split('ON');
                        if(goneOrComing(competitor.reset_day, day)){
                            calendarData[day].logged.push(
                                `${league.name.substring(league.name.length - 1)}: ${competitor.name} ran ${wrapNum(competitor.logged_days[tday])}`
                            );
                        }
                })
            }
        })
    })

    console.log(calendarData);
    

    return (
        <div className="calendar">
            {Object.keys(calendarData).map(day => {
                const logged = calendarData[day].logged;
                const planned = calendarData[day].planned;
                return (
                <div className={findDayType(day) + ' day'}>
                    <h3>{day}</h3>
                <ul className="logged">{logged.map(log=>
                    <li>
                    <img src={`./lg${log.substring(0, 1)}.png`} /> {log}
                    </li>)}</ul>
                <ul className="planned">{planned.map(log=>
                    <li>
                        <img src={`./lg${log.substring(0, 1)}.png`} /> {log}
                    </li>)}</ul>
                </div>
                );
            })}
        </div>
    );
}

export default CalendarComp;
