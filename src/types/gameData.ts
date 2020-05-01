import competitor from './competitor';

export interface gameCompetitor extends competitor {
    id: string;
    planned_days: string[], 
    logged_days: string[]
}
export type NewsItem = {
    id: string;
    type: string;
    title: string;
    content: string;
    popup: boolean;
}

export type League = {
    name: string;
    competitors: gameCompetitor[]
}

export type AllTimeRecords = {
    seasonDistance: {name:string, value:number},
    seasonSessions: {name:string, value:number},
    singleDistance: {name:string, value:number}
}

type gameData = {
    week: number,
    gameData: {
        [league: string]: League
    },
    logRecord: string,
    news: NewsItem[],
    records: AllTimeRecords
}

export default gameData;