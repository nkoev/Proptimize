import { ProjectStatusType } from './project-status.type';

export class ProjectCreateDTO {
    name: string;
    description: string;
    targetInDays: number;
}
