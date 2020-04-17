import gameData from './types/gameData';
export type stateType = {
    loading: boolean,
    gameData: gameData,
    showLeague: number
};

const initialState:stateType = {
    loading: false,
    gameData: {week:0, gameData: {}, logRecord: ''},
    showLeague: 1
}

export default (state = initialState, action:{type:string,payload:any}) => {
  switch (action.type) {
    case 'ADDDATA':
        return Object.assign({}, state, {gameData: action.payload});
    case 'LOADING':
        return Object.assign({}, state, {loading: action.payload});
    case 'SETLEAGUE':
        return Object.assign({}, state, {showLeague: action.payload});
    default:
      return state
  }
}