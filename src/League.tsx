import React, {useEffect} from 'react';
import {League} from './types/gameData';

const LeagueComp = ({league}:{league:League}) => {
  return (
    <div className="league">
        <h2>
            <img src={`./lg${league.name.substring(league.name.length - 1)}.png`} /> {league.name}
        </h2>
        <div className="league-table">
            <div className="league-cell league-label">Name</div>
            <div className="league-cell league-label">Sessions</div>
            <div className="league-cell league-label">Distance</div>
            {league.competitors.map(competitor => {
                const loggedDays = Object.values(competitor.logged_days);
                const total = Math.round(loggedDays.reduce((a:any, b:any) => a + b, 0) * 100) / 100;
                return (
                    <React.Fragment key={competitor.name}>
                        <div className="league-cell">
                            <img className="league-img" src={competitor.img} alt=""/>
                            {competitor.name}
                            {` (${competitor.nation.slice(0,3).toUpperCase()})`}
                        </div>
                        <div className="league-cell">{loggedDays.length}</div>
                        <div className="league-cell">{total}</div>
                    </React.Fragment>
                    );
            })}
        </div>
    </div>
  );
}

export default LeagueComp;
