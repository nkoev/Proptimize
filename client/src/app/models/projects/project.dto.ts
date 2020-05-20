import { ProjectStatusType } from './project-status.type';

export interface ProjectDTO {
    reporter: { id: string, firstName: string, lastName: string };
    name: string;
    description: string;
    targetInDays: number;
    createdAt: Date;
    updatedAt: Date;
    status: ProjectStatusType;
    skills: string[];
}
