import gameData from './types/gameData';
export type stateType = {
    gameData: gameData
};

const initialState:stateType = {
    gameData: {week:0, gameData: {}, logRecord: ''}
}

export default (state = initialState, action:{type:string,payload:any}) => {
  switch (action.type) {
    case 'ADDDATA':
        return Object.assign({}, state, {gameData: action.payload});
    default:
      return state
  }
}