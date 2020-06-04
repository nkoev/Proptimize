export class SkillDTO {
    name: string;
    createdAt: any;
    updatedAt: any;
    targetInHours: number;
    done: number;
    employees: {
        id: string;
        firstName: string;
        lastName: string;
        hoursPerSkill: number;
    }[];
}
