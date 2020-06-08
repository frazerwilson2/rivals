import React, {useEffect, useState} from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { GraphQLClient } from "graphql-request";
import './App.css';
import {stateType} from './store';
import gameData, {gameCompetitor, NewsItem} from './types/gameData';
import {planCompetitor} from './types/competitor';
import LeagueComp from './League';
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
        logRecord,
        news,
        records
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
  const [infoWindow, setInfoWindow] = useState(false);
  const [profileDeets, setProfileDeets] = useState(null);
  const [setDay, setSetDay] = useState(days[new Date().getDay()]);
  const [distance, setDistance] = useState('0');
  const newsModalState:[NewsItem|null, any] = useState(null);

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
  localStorage.setItem('dummyRivalData', JSON.stringify({week: props.week, gameData: props.leagues, logRecord: props.log, news: props.news, records:props.records}));
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

const profileSelected = (id:string)=>{
  const competitorList = Object.values(props.leagues).reduce((acc:any[], curr:any)=>{
    return [...acc, ...curr.competitors];
}, []);
const theProfile = competitorList.find(c => c.id === id);
setInfoWindow(true);
setProfileDeets(theProfile);
}

const toggleProfile = ()=>{
  setInfoWindow(false);
}

const renderProfileDeets = (profile:planCompetitor)=>{
  const grandTotal = Object.values(profile.logged_days).reduce((acc:number, log:any)=>{
    return acc + log;
  }, 0);
  const allTimeTotal = Math.round(grandTotal * 100) / 100 + profile.lifeTotal;
  return (
    <div>
      <a onClick={toggleProfile}><img className="close" src="/close.svg" alt=""/></a>
      <img src={profile.img} alt=""/>
      <p>Name: {profile.name}</p>
      <p>Nation: {profile.nation}</p>
      <p>Best run day: {profile.preferred_day}</p>
      <p>All time Total: {allTimeTotal}</p>
  <p>Awards: <ul>{profile.awards.map(a=>(
      <li><img className="winner-league-icon" src={`./lg${a[7]}.png`} /> {a}</li>
    ))}</ul></p>
    </div>
  )
}

const showNews = (news:NewsItem) => {
  // console.log(news);
  newsModalState[1](news);
}

const dayMap = [2, 3, 4, 5, 6, 0, 1];
const daysRemaining = (42 - (((props.week - 1) * 7) + dayMap[new Date().getDay()])) - (new Date().getDay() === 5 && new Date().getHours() < 18 ? 7 : 0);
const theNews:NewsItem[] = Object.values(props.news);

const wrapNum =  (num:number) => Math.round(num * 100) / 100;

const renderRecords = ()=>{
  const rc1 = props.records && props.records.singleDistance ? props.records.singleDistance : {name:'',value:0};
  const rc2 = props.records && props.records.seasonSessions ? props.records.seasonSessions : {name:'',value:0};
  const rc3 = props.records && props.records.seasonDistance ? props.records.seasonDistance : {name:'',value:0};
return (<div className="record-area">
  <h3>All Time records</h3>
  <div><label>Single distance:</label> {rc1.name} ({rc1.value ? wrapNum(rc1.value) : 'not set'})</div>
  <div><label>Season distance:</label> {rc2.name} ({rc2.value ? wrapNum(rc2.value) : 'not set'})</div>
  <div><label>Season sessions:</label> {rc3.name} ({rc3.value ? wrapNum(rc3.value) : 'not set'})</div>
  </div>)
}

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

      {newsModalState[0] !== null && (
      <div className="news-modal">
        <a onClick={()=>{newsModalState[1](null)}}><img className="close" src="/close-dark.svg" alt=""/></a>
        <h2>{newsModalState[0].title}</h2>
        <p>{newsModalState[0].content}</p>
      </div>)}

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
          {props.log && props.log.length && (
            <ul className="recent-log-list">
              {props.news && theNews.length > 0 && theNews.map((news:NewsItem) => (
                <li>{news.type === 'winner' && <img src="/cup.svg" />}
                  {news.content.length ? (<a onClick={()=>{showNews(news)}}>{news.title}</a>) : news.title}
                </li>
              ))}
              {props.log.split(',').map((msg:string)=><li>{msg.split(':')[1]}</li>)}
            </ul>
          )}
        </div>
        {renderRecords()}
      </div>

<div className={`league-display ${infoWindow ? 'show-info-window' : ''}`}>
    <div className="profile-window">
      {profileDeets && renderProfileDeets(profileDeets!)}
    </div>

    <div className="select-league">
    {Object.keys(props.leagues).map((lg, i)=>{
      const league = props.leagues[lg];
      return <img 
          onClick={()=>props.setLeague(i+1)}
          className={`league-display-icon ${(i + 1) === props.showLeague ? 'active':''}`} 
          src={`./lg${league.name.substring(league.name.length - 1)}.png`} 
        />
    })}
    </div>


        {Object.keys(props.leagues).map((lg, i)=>{
          const league = props.leagues[lg];
          const sortedLeague = Object.assign({}, league, {competitors: sortLeagueStandings(league.competitors)})
          return (i + 1) === props.showLeague ? 
            <LeagueComp league={sortedLeague} key={league.name} selectProfile={profileSelected} /> : null;
        })}
</div>
        
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
  getNews: (state:stateType)=>state.gameData.news,
  getRecords: (state:stateType)=>state.gameData.records,
  getWeek: (state:stateType)=>state.gameData.week,
  getLoading: (state:stateType)=>state.loading,
  showingLeague: (state:stateType)=>state.showLeague
}

const mapStateToProps = (state:stateType) => {
  return {
    leagues: selectors.getLeagues(state),
    log: selectors.getLog(state),
    news: selectors.getNews(state),
    records: selectors.getRecords(state),
    week: selectors.getWeek(state),
    loading: selectors.getLoading(state),
    showLeague: selectors.showingLeague(state)
  }
}

const actions = {
  updateData: (data:gameData)=>({type:'ADDDATA', payload: data}),
  setLoading: (setting:boolean)=>({type:'LOADING', payload: setting}),
  setLeague: (league:number)=>({type:'SETLEAGUE', payload: league})
}

const mapDispatchToProps = (dispatch: Dispatch<{type:string}>) =>
  bindActionCreators(
    {
      updateData: data => actions.updateData(data),
      updateLoading: loading => actions.setLoading(loading),
      setLeague: league => actions.setLeague(league),
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
