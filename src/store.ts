import gameData from './types/gameData';
export type stateType = {
    loading: boolean,
    gameData: gameData
};

const initialState:stateType = {
    loading: false,
    gameData: {week:0, gameData: {}, logRecord: ''}
}

export default (state = initialState, action:{type:string,payload:any}) => {
  switch (action.type) {
    case 'ADDDATA':
        return Object.assign({}, state, {gameData: action.payload});
    case 'LOADING':
        return Object.assign({}, state, {loading: action.payload});
    default:
      return state
  }
}