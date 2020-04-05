type competitor = {
    name: string;
    img: string;
    nation: string;
    ambition: number;
    strength: number;
    preferred_day: string;
    reset_day: string;
    type: string;
}

export interface planCompetitor extends competitor {
    id: string,
    planned_days: Plan,
    logged_days: Plan,
    awards: string[],
    lifeTotal: number
}

export type Plan = {
    [day:string]: number
}

export default competitor;