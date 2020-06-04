export class SkillGanttDTO {
    skill: string;
    startDate: Date;
    endDate: Date;
    completeness: {
        amount: number;
        fill: boolean;
    };
}
