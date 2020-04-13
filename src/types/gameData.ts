import competitor from './competitor';

interface gameCompetitor extends competitor {
    id: string;
    planned_days: string[], 
    logged_days: string[]
}

export type League = {
    name: string;
    competitors: gameCompetitor[]
}

type gameData = {
    week: number,
    gameData: {
        [league: string]: League
    },
    logRecord: string
}

export default gameData;