import React, {useEffect, useState} from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { GraphQLClient } from "graphql-request";
import './App.css';
import {stateType} from './store';
import gameData from './types/gameData';
import {planCompetitor} from './types/competitor';
import League from './League';
import Calendar from './Calendar';

  const ENDPOINT = `https://api.8base.com/ck54bkug3000208l48z0k2ppy`;
  // const gameId = "ck8950ur800p908mj3nso2ksh";
  const [, gameId] = window.location.search.split('=');  

  const GET_LATEST = `
  query getGame{
      game(id: "${gameId}"
      ){
        week,
        gameData,
        logRecord
      }
    }
  `;

  const client = new GraphQLClient(ENDPOINT, {
    headers: {
      Authorization: "Bearer 6dcb451a-e1fc-4ddb-af3b-60abfe6d99c1"
    }
  });

function App({...props}) {
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const [logFormOpen, setLogFormOpen] = useState(false);
  const [setDay, setSetDay] = useState(days[new Date().getDay()]);
  const [distance, setDistance] = useState('0');

  useEffect(()=>{
    const localData = localStorage.getItem('dummyRivalData');
    if(localData){
      props.updateData(JSON.parse(localData));
    }
    else {
      props.makeASandwichWithSecretSauce();
    }
  }, []);

  useEffect(()=>{
  localStorage.setItem('dummyRivalData', JSON.stringify({week: props.week, gameData: props.leagues, logRecord: props.log}));
  }, [props.leagues]);

  const sortLeagueStandings = (competitors:planCompetitor[]):planCompetitor[] => {
    return competitors.sort((a,b)=>{
        const aTotal = Object.values(a.logged_days).reduce((a, b) => a + b, 0);
        const bTotal = Object.values(b.logged_days).reduce((a, b) => a + b, 0);
        return aTotal < bTotal ? 1 : -1;
    });
}

const showForm = ()=>{
  setLogFormOpen(!logFormOpen);
}

function makeid(length:number = 5) {
  let result           = '';
  const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const logDistance = ()=>{
  const dayTag:string = makeid(5) + 'ON' + setDay;  
  props.updateLoading(true);
  fetch('https://e2043eb2x7.execute-api.us-east-1.amazonaws.com/default/dummyrivals-dev-logSession', {
    method: 'POST',
    mode: 'no-cors',
    headers: {
    'Content-Type': 'application/json'
    // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
        day: dayTag,
        distance: parseFloat(distance),
        gameId: gameId
    })
  }).then(()=>{
    props.makeASandwichWithSecretSauce();
    setDistance('0');
    showForm();
  });
}

const dayMap = [2, 3, 4, 5, 6, 0, 1];
const daysRemaining = 42 - (((props.week - 1) * 7) + dayMap[new Date().getDay()])

  return (
    <div className={props.loading ? 'loading': ''}>
      <header className="">
      <h1>
        Week {props.week} <span className="remaining-days">({daysRemaining} days remaining)</span>
      </h1>
      <div className="actions">
        <button onClick={props.makeASandwichWithSecretSauce}>
          <img src="./refresh.png" alt=""/>
          refresh data
          </button>
        <button onClick={showForm}>
        <img src="./running.png" alt=""/>
          log session
        </button>
      </div>
      </header>

<div className={`container ${logFormOpen ? "show-form" : ""}`}>

    <div className="center">
      <div className="headline">
        <div className="leaders">
          {Object.keys(props.leagues).map(lg=>{
            const league = props.leagues[lg];
            return (
              <div>
                <img src={league.competitors[0].img} alt={league.competitors[0].name}/>
                <img className="league-icon" src={`./lg${league.name.substring(league.name.length - 1)}.png`} />
                {league.name}<br/>
                {league.competitors[0].name}
              </div>
              );
          })}
        </div>
        <div className="recent-log">
          <h2>Latest updates:</h2>
          <ul>
            {props.log.split(',').map((msg:string)=><li>{msg.split(':')[1]}</li>)}
          </ul>
        </div>
      </div>


        {Object.keys(props.leagues).map(lg=>{
          const league = props.leagues[lg];
          const sortedLeague = Object.assign({}, league, {competitors: sortLeagueStandings(league.competitors)})
          return <League league={sortedLeague} key={league.name} />;
        })}
        
    </div>

  <div className="info">
  <div>
          <h2>Log Distance</h2>
          <label htmlFor="distance">Distance</label>
          <input type="text" value={distance} onChange={(e)=>{setDistance(e.target.value)}} />
          <label htmlFor="day">Day</label>
          <select name="day" id="dat" value={setDay} onChange={(e)=>{setSetDay(e.target.value)}}>
            <option value="Monday">Monday</option>
            <option value="Tuesday">Tuesday</option>
            <option value="Wednesday">Wednesday</option>
            <option value="Thursday">Thursday</option>
            <option value="Friday">Friday</option>
            <option value="Saturday">Saturday</option>
            <option value="Sunday">Sunday</option>
          </select>
          <button onClick={logDistance}>Submit</button>
        </div>
  </div>

</div>
    <Calendar data={props.leagues} />
    </div>
  );
}

function fetchSecretSauce() {
  return client.request(GET_LATEST).then((r:any) => {
    // console.log(r);
    return r;
  });
  // const newData:any = dummyData;
  // return Promise.resolve(newData);
}

const selectors = {
  getLeagues: (state:stateType)=>state.gameData.gameData,
  getLog: (state:stateType)=>state.gameData.logRecord,
  getWeek: (state:stateType)=>state.gameData.week,
  getLoading: (state:stateType)=>state.loading
}

const mapStateToProps = (state:stateType) => {
  return {
    leagues: selectors.getLeagues(state),
    log: selectors.getLog(state),
    week: selectors.getWeek(state),
    loading: selectors.getLoading(state)
  }
}

const actions = {
  updateData: (data:gameData)=>({type:'ADDDATA', payload: data}),
  setLoading: (setting:boolean)=>({type:'LOADING', payload: setting})
}

const mapDispatchToProps = (dispatch: Dispatch<{type:string}>) =>
  bindActionCreators(
    {
      updateData: data => actions.updateData(data),
      updateLoading: loading => actions.setLoading(loading),
      makeASandwichWithSecretSauce: () =>{        
        return (dispatch:Dispatch) => {
          dispatch(actions.setLoading(true));
          return fetchSecretSauce().then(
            (sauce:{game:gameData}) => {
              dispatch(actions.updateData(sauce.game))
              dispatch(actions.setLoading(false));
            },
            (error) => {console.log(error);},
          );
        };
      }
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(App)
