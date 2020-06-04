import { ProjectStatusType } from './project-status.type';
import { SkillDTO } from '../skills/skill.dto';

export class ProjectDTO {
    id?: string;
    reporter: {
        id: string;
        firstName: string;
        lastName: string;
    };
    name: string;
    description: string;
    targetInDays: number;
    createdAt: any;
    updatedAt: any;
    status: ProjectStatusType;
    mCreatedAt: any;
    mUpdatedAt: any;
    mDone: number;
    managementHours: number;
    managementTarget: number;
    skills: SkillDTO[];
}
