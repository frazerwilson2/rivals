import React, {useEffect} from 'react';
import {League} from './types/gameData';

const LeagueComp = ({league, selectProfile}:{league:League, selectProfile:(id:string)=>void}) => {
  return (
    <div className="league">
        <h2>
            <img className="league-icon" src={`./lg${league.name.substring(league.name.length - 1)}.png`} /> {league.name}
        </h2>
        <div className="league-table">
            <div className="league-cell league-label">Name</div>
            <div className="league-cell league-label">Sessions</div>
            <div className="league-cell league-label">Distance</div>
            {league.competitors.map((competitor, i) => {
                const loggedDays = Object.values(competitor.logged_days);
                const total = Math.round(loggedDays.reduce((a:any, b:any) => a + b, 0) * 100) / 100;
                return (
                    <React.Fragment key={competitor.name}>
                        <div className={`league-cell ${i == 0 ? 'first' : ''} ${i == 5 ? 'last' : ''}`}>
                            <img onClick={()=>{selectProfile(competitor.id)}} className="league-img" src={competitor.img} alt=""/>
                            <a onClick={()=>{selectProfile(competitor.id)}}>{competitor.name}</a>
                            {` (${competitor.nation.slice(0,3).toUpperCase()})`}
                        </div>
                        <div className={`league-cell ${i == 0 ? 'first' : ''} ${i == 5 ? 'last' : ''}`}>{loggedDays.length}</div>
                        <div className={`league-cell ${i == 0 ? 'first' : ''} ${i == 5 ? 'last' : ''}`}>{total}</div>
                    </React.Fragment>
                    );
            })}
        </div>
    </div>
  );
}

export default LeagueComp;
