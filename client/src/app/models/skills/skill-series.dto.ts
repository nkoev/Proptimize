export class SkillSeriesDTO {
    name: string;
    start: number;
    end: number;
    completed: {
        amount: number;
        fill?: string;
    }
}
