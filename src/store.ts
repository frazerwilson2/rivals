import gameData from '../../lambda/src/types/gameData';
export type stateType = {
    thing:string,
    gameData: gameData
};

const initialState:stateType = {
    thing: 'default',
    gameData: {week:0, gameData: {}}
}

export default (state = initialState, action:{type:string,payload:any}) => {
  switch (action.type) {
    case 'ADDDATA':
        return Object.assign({}, state, {gameData: action.payload});
    default:
      return state
  }
}