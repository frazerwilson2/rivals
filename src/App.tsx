import React, {useEffect, useState} from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { GraphQLClient } from "graphql-request";
import './App.css';
import {stateType} from './store';
import gameData from '../../lambda/src/types/gameData';
import {planCompetitor} from '../../lambda/src/types/competitor';
import League from './League';
import Calendar from './Calendar';

  const ENDPOINT = `https://api.8base.com/ck54bkug3000208l48z0k2ppy`;
  const gameId = "ck8950ur800p908mj3nso2ksh";

  const GET_LATEST = `
  query getGame{
      game(id: "${gameId}"
      ){
        week,
        gameData
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
  localStorage.setItem('dummyRivalData', JSON.stringify({week: props.week, gameData: props.leagues}));
  }, [props.leagues]);

  const sortLeagueStandings = (competitors:planCompetitor[]):planCompetitor[] => {
    return competitors.sort((a,b)=>{
        const aTotal = Object.values(a.logged_days).reduce((a, b) => a + b, 0);
        const bTotal = Object.values(b.logged_days).reduce((a, b) => a + b, 0);
        return aTotal < bTotal ? 1 : -1;
    });
}

const showForm = ()=>{
  setLogFormOpen(true);
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
  fetch('https://e2043eb2x7.execute-api.us-east-1.amazonaws.com/default/dummyrivals-dev-logSession', {
    method: 'POST',
    mode: 'no-cors',
    headers: {
    'Content-Type': 'application/json'
    // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify({
        day: dayTag,
        distance: parseFloat(distance)
    })
  }).then(()=>{
    props.makeASandwichWithSecretSauce();
    setDistance('0');
  });
}
  
  return (
    <div className="">
      <header className="">
      <h1>
        Dummy Rivals - Week {props.week}
      </h1>
      <div>
        Actions: 
        <button onClick={props.makeASandwichWithSecretSauce}>refresh data</button>
        <button onClick={showForm}>log data</button>
      </div>
      </header>

      <Calendar data={props.leagues} />

      {logFormOpen ? (
        <div>
          <label htmlFor="distance">Distance</label>
          <input type="text" value={distance} onChange={(e)=>{setDistance(e.target.value)}} />
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
      ): null }

<div className="container">
  <div className="center">
      {Object.keys(props.leagues).map(lg=>{
        const league = props.leagues[lg];
        const sortedLeague = Object.assign({}, league, {competitors: sortLeagueStandings(league.competitors)})
        return <League league={sortedLeague} key={league.name} />;
      })}
  </div>
  <div className="info"></div>
</div>
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
  getThing: (state:stateType)=>state.thing,
  getLeagues: (state:stateType)=>state.gameData.gameData,
  getWeek: (state:stateType)=>state.gameData.week
}

const mapStateToProps = (state:stateType) => {
  return {
    leagues: selectors.getLeagues(state),
    week: selectors.getWeek(state),
  }
}

const actions = {
  updateData: (data:gameData)=>({type:'ADDDATA', payload: data})
}

const mapDispatchToProps = (dispatch: Dispatch<{type:string}>) =>
  bindActionCreators(
    {
      updateData: data => actions.updateData(data),
      makeASandwichWithSecretSauce: () =>{        
        return (dispatch:Dispatch) => {
          return fetchSecretSauce().then(
            (sauce:{game:gameData}) => {
              dispatch(actions.updateData(sauce.game))
            },
            (error) => {console.log(error);},
          );
        };
      }
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(App)
