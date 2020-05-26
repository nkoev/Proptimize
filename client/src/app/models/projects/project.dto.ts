import { ProjectStatusType } from './project-status.type';

export interface ProjectDTO {
    id: string,
    reporter: { id: string, firstName: string, lastName: string };
    name: string;
    description: string;
    targetInDays: number;
    createdAt: Date;
    updatedAt: Date;
    status: ProjectStatusType;
    skills: string[];
}
